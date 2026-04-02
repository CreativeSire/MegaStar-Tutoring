import { NextResponse } from "next/server";
import { z } from "zod";
import { updateRatingModeration, listRatings } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { requireApiActor } from "@/lib/api-actor";

const moderationSchema = z.object({
  moderationStatus: z.enum(["approved", "pending", "hidden"]),
});

export async function PATCH(request: Request, context: { params: Promise<{ ratingId: string }> }) {
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
    await enforceRateLimit(actor, request, "api.ratings.update", 30, 60_000);
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

  const parsed = moderationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid moderation status.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { ratingId } = await context.params;
  const ratings = await listRatings(actor);
  const current = ratings.find((entry) => entry.id === ratingId);
  if (!current) {
    return NextResponse.json({ error: "Rating not found." }, { status: 404 });
  }

  const updated = await updateRatingModeration(actor, ratingId, parsed.data);
  const response = NextResponse.json({ rating: updated }, { status: 200 });
  await recordAuditEvent(actor, request, "ratings.update", response.status, {
    ratingId,
    moderationStatus: parsed.data.moderationStatus,
  }).catch(() => undefined);
  return response;
}
