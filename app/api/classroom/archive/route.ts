import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isClerkConfigured } from "@/lib/clerk-config";
import { LOCAL_TEST_AUTH_COOKIE, getLocalTestActorSeed } from "@/lib/local-test-auth";
import {
  createLessonArchive,
  findWorkspaceProfileByClerkUserId,
  listLessonArchives,
  getWorkspaceProfile,
} from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { canAccessWorkspace } from "@/lib/roles";

function readTestEmailFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader.match(new RegExp(`${LOCAL_TEST_AUTH_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function requireWorkspaceActor(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    const url = new URL(request.url);
    const seed = getLocalTestActorSeed(url.searchParams.get("testActor") || readTestEmailFromCookieHeader(request.headers.get("cookie")));
    if (seed) {
      const profile = await getWorkspaceProfile(seed);
      if (canAccessWorkspace(profile.role)) {
        return {
          clerkUserId: seed.clerkUserId,
          profileId: profile.id,
          role: profile.role,
          email: profile.email,
          displayName: profile.displayName,
        };
      }
    }
  }

  if (!isClerkConfigured()) {
    return null;
  }

  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const profile = await findWorkspaceProfileByClerkUserId(userId);
  if (!profile || !canAccessWorkspace(profile.role)) {
    return null;
  }

  return {
    clerkUserId: userId,
    profileId: profile.id,
    role: profile.role,
    email: profile.email,
    displayName: profile.displayName,
  };
}

const archiveSchema = z.object({
  sessionId: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  clientId: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().min(1).max(4000),
  boardLabel: z.string().trim().min(1).max(160),
  snapshotJson: z.string().trim().min(2).max(200_000),
  fileName: z.string().trim().max(200).nullable().optional().transform((value) => value || null),
});

export async function GET(request: Request) {
  const actor = await requireWorkspaceActor(request);
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.classroom.archive.read", 40, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const archives = await listLessonArchives(actor);
  const response = NextResponse.json({ archives });
  await recordAuditEvent(actor, request, "classroom.archive.list", response.status, { count: archives.length }).catch(() => undefined);
  return response;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const actor = await requireWorkspaceActor(request);
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.classroom.archive.write", 15, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  let body = null;
  try {
    body = await readJsonBody(request);
  } catch {
    return NextResponse.json({ error: "Request body too large or invalid." }, { status: 413 });
  }

  const parsed = archiveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lesson record.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const archive = await createLessonArchive(actor, parsed.data);
  const response = NextResponse.json({ archive }, { status: 201 });
  await recordAuditEvent(actor, request, "classroom.archive.create", response.status, {
    archiveId: archive.id,
    sessionId: archive.sessionId,
  }).catch(() => undefined);
  return response;
}
