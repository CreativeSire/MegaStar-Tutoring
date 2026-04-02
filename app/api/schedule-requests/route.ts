import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isClerkConfigured } from "@/lib/clerk-config";
import { createScheduleRequest, findWorkspaceProfileByClerkUserId, listScheduleRequests } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { canAccessWorkspace } from "@/lib/roles";

async function requireWorkspaceActor() {
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

const scheduleRequestSchema = z.object({
  clientId: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  lessonTitle: z.string().trim().min(1).max(160),
  requestedStartsAt: z.string().trim().min(1),
  reason: z.string().trim().min(1).max(120),
  details: z.string().trim().max(2000).default(""),
});

export async function GET(request: Request) {
  const actor = await requireWorkspaceActor();
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.schedule-requests.read", 60, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const requests = await listScheduleRequests(actor);
  const response = NextResponse.json({ requests });
  await recordAuditEvent(actor, request, "schedule_requests.list", response.status, { count: requests.length }).catch(() => undefined);
  return response;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const actor = await requireWorkspaceActor();
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.schedule-requests.create", 20, 60_000);
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

  const parsed = scheduleRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const requestRow = await createScheduleRequest(actor, parsed.data);
  const response = NextResponse.json({ request: requestRow }, { status: 201 });
  await recordAuditEvent(actor, request, "schedule_requests.create", response.status, {
    requestId: requestRow.id,
    clientId: requestRow.clientId,
    requestedStartsAt: requestRow.requestedStartsAt.toISOString(),
  }).catch(() => undefined);
  return response;
}
