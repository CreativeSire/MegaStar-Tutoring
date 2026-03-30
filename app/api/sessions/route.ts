import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, listSessions } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";

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

async function requireActor() {
  const { userId } = await auth();
  return userId || null;
}

export async function GET() {
  const userId = await requireActor();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessionList = await listSessions({ clerkUserId: userId });
  return NextResponse.json({ sessions: sessionList });
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
  const parsed = sessionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const session = await createSession({ clerkUserId: userId }, parsed.data);
  return NextResponse.json({ session }, { status: 201 });
}
