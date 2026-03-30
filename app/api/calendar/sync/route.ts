import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { findWorkspaceProfileByClerkUserId, importCalendarEvents } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { canAccessWorkspace } from "@/lib/roles";

async function requireWorkspaceActor() {
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

const calendarEventSchema = z.object({
  externalEventId: z.string().trim().min(1).max(200),
  clientId: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  title: z.string().trim().min(1).max(200),
  startsAt: z.string().trim().min(1),
  endsAt: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  billable: z.preprocess((value) => value === "true" || value === true, z.boolean()),
  amountCents: z.coerce.number().int().min(0).max(1_000_000),
  notes: z.string().trim().max(2000).default(""),
});

const calendarSyncSchema = z.object({
  calendarId: z.string().trim().min(1).max(120),
  events: z.array(calendarEventSchema).max(2500),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const actor = await requireWorkspaceActor();
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await enforceRateLimit(actor, request, "api.calendar.sync", 8, 60_000);
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
  const parsed = calendarSyncSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid calendar payload.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const result = await importCalendarEvents(actor, parsed.data.calendarId, parsed.data.events);
  const response = NextResponse.json(result, { status: 201 });
  await recordAuditEvent(actor, request, "calendar.sync", response.status, {
    calendarId: parsed.data.calendarId,
    imported: result.imported,
  }).catch(() => undefined);
  return response;
}
