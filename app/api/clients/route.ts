import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, findWorkspaceProfileByClerkUserId, getWorkspaceOverview, listClients } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";
import { enforceRateLimit, recordAuditEvent, RateLimitError } from "@/lib/security-controls";
import { canAccessWorkspace } from "@/lib/roles";

async function requireWorkspaceActor() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const profile = await findWorkspaceProfileByClerkUserId(userId);
  if (!profile) {
    return null;
  }

  if (!canAccessWorkspace(profile.role)) {
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

const clientSchema = z.object({
  name: z.string().trim().min(1).max(120),
  billTo: z.string().trim().min(1).max(160),
  rateCents: z.coerce.number().int().min(0).max(1_000_000),
  meetingsPerWeek: z.coerce.number().int().min(0).max(40),
  preferredDays: z.string().trim().max(200).default(""),
  notes: z.string().trim().max(2000).default(""),
  status: z.string().trim().min(1).max(40),
});

export async function GET(request: Request) {
  const actor = await requireWorkspaceActor();
  if (!actor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await enforceRateLimit(actor, request, "api.clients.read", 60, 60_000);
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    }
    throw error;
  }

  const clientList = await listClients(actor);
  const response = NextResponse.json({ clients: clientList });
  await recordAuditEvent(actor, request, "clients.list", response.status, {
    count: clientList.length,
  }).catch(() => undefined);
  return response;
}

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
    await enforceRateLimit(actor, request, "api.clients.create", 12, 60_000);
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
  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid client data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const client = await createClient(actor, parsed.data);
  const overview = await getWorkspaceOverview(actor);
  const response = NextResponse.json({ client, overview }, { status: 201 });
  await recordAuditEvent(actor, request, "clients.create", response.status, {
    clientId: client.id,
    status: client.status,
  }).catch(() => undefined);
  return response;
}
