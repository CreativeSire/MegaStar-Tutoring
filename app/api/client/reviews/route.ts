import { NextResponse } from "next/server";
import { z } from "zod";
import { createRating } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { requireApiActor } from "@/lib/api-actor";

const clientReviewSchema = z.object({
  clientId: z.string().trim().min(1),
  sessionId: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  score: z.coerce.number().int().min(1).max(5),
  category: z.string().trim().min(1).max(60),
  comment: z.string().trim().max(2000).default(""),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const actor = await requireApiActor(request, "client");
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.client.reviews.create", 10, 60_000);
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

  const parsed = clientReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const rating = await createRating(actor, {
    ...parsed.data,
    moderationStatus: "pending",
    source: "client-portal",
  });

  const response = NextResponse.json({ rating }, { status: 201 });
  await recordAuditEvent(actor, request, "client_reviews.create", response.status, {
    ratingId: rating.id,
    clientId: rating.clientId,
    source: rating.source,
  }).catch(() => undefined);
  return response;
}
