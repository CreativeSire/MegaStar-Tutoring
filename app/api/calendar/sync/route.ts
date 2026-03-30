import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { importCalendarEvents } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";

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

async function requireActor() {
  const { userId } = await auth();
  return userId || null;
}

export async function POST(request: Request) {
  const userId = await requireActor();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
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

  const result = await importCalendarEvents({ clerkUserId: userId }, parsed.data.calendarId, parsed.data.events);
  return NextResponse.json(result, { status: 201 });
}
