import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createRating, listRatings } from "@/lib/repository";
import { assertSameOrigin, readJsonBody } from "@/lib/request-security";

const ratingSchema = z.object({
  clientId: z.string().trim().min(1).nullable().optional().transform((value) => value || null),
  score: z.coerce.number().int().min(1).max(5),
  category: z.string().trim().min(1).max(60),
  comment: z.string().trim().max(2000).default(""),
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

  const ratingList = await listRatings({ clerkUserId: userId });
  return NextResponse.json({ ratings: ratingList });
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
  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rating data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const rating = await createRating({ clerkUserId: userId }, parsed.data);
  return NextResponse.json({ rating }, { status: 201 });
}
