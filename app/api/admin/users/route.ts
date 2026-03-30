import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isClerkConfigured } from "@/lib/clerk-config";
import { findWorkspaceProfileByClerkUserId, listWorkspaceProfiles, setWorkspaceProfileRole } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { canAccessWorkspace, normalizeAppRole } from "@/lib/roles";

const roleUpdateSchema = z.object({
  clerkUserId: z.string().trim().min(1).max(120),
  role: z.enum(["tutor", "client", "admin"]),
});

async function requireAdminActor() {
  if (!isClerkConfigured()) {
    return null;
  }

  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const profile = await findWorkspaceProfileByClerkUserId(userId);
  if (!profile || !canAccessWorkspace(profile.role) || profile.role !== "admin") {
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

export async function GET(request: Request) {
  const actor = await requireAdminActor();
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.admin.users.read", 30, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const profiles = await listWorkspaceProfiles();
  const response = NextResponse.json({ profiles });
  await recordAuditEvent(actor, request, "admin.users.list", response.status, { count: profiles.length }).catch(() => undefined);
  return response;
}

export async function PATCH(request: Request) {
  const actor = await requireAdminActor();
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    await enforceRateLimit(actor, request, "api.admin.users.update", 20, 60_000);
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

  const parsed = roleUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid role payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const nextRole = normalizeAppRole(parsed.data.role, "tutor");
  const updated = await setWorkspaceProfileRole(parsed.data.clerkUserId, nextRole);
  if (!updated) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const response = NextResponse.json({ profile: updated });
  await recordAuditEvent(actor, request, "admin.users.update_role", response.status, {
    clerkUserId: parsed.data.clerkUserId,
    role: nextRole,
  }).catch(() => undefined);
  return response;
}
