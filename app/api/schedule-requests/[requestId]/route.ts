import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isClerkConfigured } from "@/lib/clerk-config";
import { createSession, findWorkspaceProfileByClerkUserId, getClientById, listScheduleRequests, updateScheduleRequest } from "@/lib/repository";
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

const actionSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

export async function PATCH(request: Request, context: { params: Promise<{ requestId: string }> }) {
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
    await enforceRateLimit(actor, request, "api.schedule-requests.update", 30, 60_000);
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

  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request action." }, { status: 400 });
  }

  const { requestId } = await context.params;
  const requests = await listScheduleRequests(actor);
  const current = requests.find((entry) => entry.id === requestId);
  if (!current) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  if (parsed.data.action === "decline") {
    const updated = await updateScheduleRequest(actor, requestId, { status: "declined", linkedSessionId: current.linkedSessionId });
    const response = NextResponse.json({ request: updated }, { status: 200 });
    await recordAuditEvent(actor, request, "schedule_requests.decline", response.status, { requestId }).catch(() => undefined);
    return response;
  }

  if (current.linkedSessionId) {
    const updated = await updateScheduleRequest(actor, requestId, { status: "accepted", linkedSessionId: current.linkedSessionId });
    const response = NextResponse.json({ request: updated }, { status: 200 });
    await recordAuditEvent(actor, request, "schedule_requests.accept", response.status, {
      requestId,
      sessionId: current.linkedSessionId,
      reusedSession: true,
    }).catch(() => undefined);
    return response;
  }

  const client = current.clientId ? await getClientById(actor, current.clientId) : null;
  const createdSession = await createSession(actor, {
    clientId: current.clientId,
    title: current.lessonTitle,
    startsAt: current.requestedStartsAt.toISOString(),
    endsAt: new Date(current.requestedStartsAt.getTime() + 60 * 60_000).toISOString(),
    status: "planned",
    source: "manual",
    billable: true,
    amountCents: client?.rateCents || 0,
    notes: current.details || current.reason,
  });

  const updated = await updateScheduleRequest(actor, requestId, { status: "accepted", linkedSessionId: createdSession?.id || null });
  const response = NextResponse.json({ request: updated, session: createdSession }, { status: 200 });
  await recordAuditEvent(actor, request, "schedule_requests.accept", response.status, {
    requestId,
    sessionId: createdSession?.id || null,
    clientId: current.clientId,
  }).catch(() => undefined);
  return response;
}
