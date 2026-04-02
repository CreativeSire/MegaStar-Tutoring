import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, listSessions } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { requireApiActor } from "@/lib/api-actor";

const sessionSchema = z.object({
  clientId: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  title: z.string().trim().min(1).max(160),
  startsAt: z.string().trim().min(1),
  endsAt: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  status: z.enum(["planned", "completed", "missed", "rescheduled", "partial"]),
  source: z.enum(["manual", "google"]),
  billable: z.preprocess((value) => value === "true" || value === true, z.boolean()),
  amountCents: z.coerce.number().int().min(0).max(1_000_000),
  notes: z.string().trim().max(2000).default(""),
  externalEventId: z.string().trim().max(200).nullable().optional().transform((value) => value || null),
});

export async function GET(request: Request) {
  const actor = await requireApiActor(request, "workspace");
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }
  try {
    await enforceRateLimit(actor, request, "api.sessions.read", 60, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const sessionList = await listSessions(actor);
  const response = NextResponse.json({ sessions: sessionList });
  await recordAuditEvent(actor, request, "sessions.list", response.status, { count: sessionList.length }).catch(() => undefined);
  return response;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const actor = await requireApiActor(request, "workspace");
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }
  try {
    await enforceRateLimit(actor, request, "api.sessions.create", 20, 60_000);
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
  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const session = await createSession(actor, parsed.data);
  const response = NextResponse.json({ session }, { status: 201 });
  await recordAuditEvent(actor, request, "sessions.create", response.status, {
    sessionId: session.id,
    clientId: session.clientId,
    status: session.status,
  }).catch(() => undefined);
  return response;
}
