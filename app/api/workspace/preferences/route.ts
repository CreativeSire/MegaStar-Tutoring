import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspacePreferences, saveWorkspacePreferences } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { marketKeys } from "@/lib/market";
import { requireApiActor } from "@/lib/api-actor";

const workspacePreferenceSchema = z.object({
  market: z.enum(marketKeys).default("uk"),
  preferredDays: z.string().trim().max(200).default(""),
  lessonLengthMinutes: z.coerce.number().int().min(15).max(240),
  primaryGoal: z.string().trim().max(1000).default(""),
});

export async function GET(request: Request) {
  const actor = await requireApiActor(request, "workspace");
  if (!actor) {
    return NextResponse.json({ error: "Auth is not configured." }, { status: 503 });
  }

  try {
    await enforceRateLimit(actor, request, "api.workspace.preferences.read", 30, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const preferences = await getWorkspacePreferences(actor);
  const response = NextResponse.json({ preferences });
  await recordAuditEvent(actor, request, "workspace.preferences.read", response.status, {
    preferencesId: preferences.id,
  }).catch(() => undefined);
  return response;
}

export async function PATCH(request: Request) {
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
    await enforceRateLimit(actor, request, "api.workspace.preferences.write", 8, 60_000);
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

  const parsed = workspacePreferenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the setup details and try again.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const preferences = await saveWorkspacePreferences(actor, parsed.data);
  const response = NextResponse.json({ preferences });
  await recordAuditEvent(actor, request, "workspace.preferences.update", response.status, {
    preferencesId: preferences.id,
  }).catch(() => undefined);
  return response;
}
