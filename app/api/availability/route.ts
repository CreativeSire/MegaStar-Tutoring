import { NextResponse } from "next/server";
import { z } from "zod";
import { createAvailabilityBlock, listAvailabilityBlocks } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { requireApiActor } from "@/lib/api-actor";

function parseTimeValue(value: unknown) {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    if (value.includes(":")) {
      const [hours, minutes] = value.split(":");
      return Number(hours) * 60 + Number(minutes);
    }
    return Number(value);
  }
  return Number.NaN;
}

const availabilitySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startMinute: z.preprocess(parseTimeValue, z.number().int().min(0).max(24 * 60)),
  endMinute: z.preprocess(parseTimeValue, z.number().int().min(0).max(24 * 60)),
  label: z.string().trim().min(1).max(120).default("Available"),
  notes: z.string().trim().max(1000).default(""),
  active: z.preprocess((value) => value === "true" || value === true, z.boolean()),
});

export async function GET(request: Request) {
  const actor = await requireApiActor(request, "workspace");
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.availability.read", 60, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const blocks = await listAvailabilityBlocks(actor);
  const response = NextResponse.json({ blocks });
  await recordAuditEvent(actor, request, "availability.list", response.status, { count: blocks.length }).catch(() => undefined);
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
    await enforceRateLimit(actor, request, "api.availability.create", 20, 60_000);
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

  const parsed = availabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid availability block.", issues: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.startMinute >= parsed.data.endMinute) {
    return NextResponse.json({ error: "End time must be after the start time." }, { status: 400 });
  }

  const block = await createAvailabilityBlock(actor, parsed.data);
  const response = NextResponse.json({ block }, { status: 201 });
  await recordAuditEvent(actor, request, "availability.create", response.status, {
    blockId: block.id,
    dayOfWeek: block.dayOfWeek,
  }).catch(() => undefined);
  return response;
}
