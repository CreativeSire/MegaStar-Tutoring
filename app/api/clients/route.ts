import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, getWorkspaceOverview, listClients } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";

const clientSchema = z.object({
  name: z.string().trim().min(1).max(120),
  billTo: z.string().trim().min(1).max(160),
  rateCents: z.coerce.number().int().min(0).max(1_000_000),
  meetingsPerWeek: z.coerce.number().int().min(0).max(40),
  preferredDays: z.string().trim().max(200).default(""),
  notes: z.string().trim().max(2000).default(""),
  status: z.string().trim().min(1).max(40),
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

  const clientList = await listClients({ clerkUserId: userId });
  return NextResponse.json({ clients: clientList });
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
  const parsed = clientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid client data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const client = await createClient({ clerkUserId: userId }, parsed.data);
  const overview = await getWorkspaceOverview({ clerkUserId: userId });
  return NextResponse.json({ client, overview }, { status: 201 });
}
