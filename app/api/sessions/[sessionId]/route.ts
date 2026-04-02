import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createLessonArchive,
  listLessonArchives,
  listSessions,
  updateSession,
  findWorkspaceProfileByClerkUserId,
} from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { requireApiActor } from "@/lib/api-actor";

const sessionUpdateSchema = z.object({
  status: z.enum(["planned", "completed", "missed", "rescheduled", "partial"]),
  notes: z.string().trim().max(2000).optional().default(""),
});

export async function PATCH(request: Request, context: { params: Promise<{ sessionId: string }> }) {
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
    await enforceRateLimit(actor, request, "api.sessions.update", 30, 60_000);
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

  const parsed = sessionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session update.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { sessionId } = await context.params;
  const sessions = await listSessions(actor);
  const current = sessions.find((entry) => entry.id === sessionId);
  if (!current) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  const updated = await updateSession(actor, sessionId, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Session not found." }, { status: 404 });
  }

  let archive = null;
  if (parsed.data.status === "completed") {
    const archives = await listLessonArchives(actor);
    archive = archives.find((item) => item.sessionId === sessionId) || null;

    if (!archive) {
      const clientName = current.clientId ? current.title : current.title;
      archive = await createLessonArchive(actor, {
        sessionId: updated.id,
        clientId: updated.clientId,
        title: updated.title,
        summary: [updated.title, "", updated.notes || "No lesson notes added yet.", "", `Status: ${updated.status}`, `Client: ${clientName}`].join("\n"),
        boardLabel: updated.title,
        snapshotJson: JSON.stringify([
          {
            id: updated.id,
            title: updated.title,
            status: updated.status,
            startsAt: updated.startsAt.toISOString(),
            endsAt: updated.endsAt ? updated.endsAt.toISOString() : null,
            notes: updated.notes,
          },
        ]),
        fileName: `${updated.title.toLowerCase().replace(/\s+/g, "-")}-lesson-record.txt`,
      });
    }
  }

  const response = NextResponse.json({ session: updated, archive }, { status: 200 });
  await recordAuditEvent(actor, request, "sessions.update", response.status, {
    sessionId: updated.id,
    status: updated.status,
    archiveId: archive?.id || null,
  }).catch(() => undefined);
  return response;
}
