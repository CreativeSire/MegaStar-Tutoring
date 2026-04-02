import { NextResponse } from "next/server";
import { deleteAvailabilityBlock, listAvailabilityBlocks } from "@/lib/repository";
import { assertSameOrigin } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { requireApiActor } from "@/lib/api-actor";

export async function DELETE(request: Request, context: { params: Promise<{ blockId: string }> }) {
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
    await enforceRateLimit(actor, request, "api.availability.delete", 20, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const { blockId } = await context.params;
  const blocks = await listAvailabilityBlocks(actor);
  const current = blocks.find((entry) => entry.id === blockId);
  if (!current) {
    return NextResponse.json({ error: "Availability block not found." }, { status: 404 });
  }

  await deleteAvailabilityBlock(actor, blockId);
  const response = NextResponse.json({ deleted: true }, { status: 200 });
  await recordAuditEvent(actor, request, "availability.delete", response.status, { blockId }).catch(() => undefined);
  return response;
}
