import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { z } from "zod";
import { requireActor } from "@/lib/current-actor";
import { isClerkConfigured } from "@/lib/clerk-config";
import { LOCAL_TEST_AUTH_COOKIE, getLocalTestActorSeed } from "@/lib/local-test-auth";
import { getWorkspaceProfile } from "@/lib/repository";
import { canAccessWorkspace } from "@/lib/roles";

const querySchema = z.object({
  roomName: z.string().trim().min(1).max(120),
});

function getLiveKitConfig() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL;
  const ttlSeconds = Number(process.env.LIVEKIT_TOKEN_TTL_SECONDS || 12 * 60 * 60);

  if (!apiKey || !apiSecret || !serverUrl) {
    return null;
  }

  return {
    apiKey,
    apiSecret,
    serverUrl,
    ttlSeconds: Number.isFinite(ttlSeconds) && ttlSeconds > 0 ? ttlSeconds : 12 * 60 * 60,
  };
}

export async function GET(request: Request) {
  if (!isClerkConfigured()) {
    return NextResponse.json({ error: "Authentication is not configured yet." }, { status: 503 });
  }

  const url = new URL(request.url);
  const parsedQuery = querySchema.safeParse({
    roomName: url.searchParams.get("roomName"),
  });

  if (!parsedQuery.success) {
    return NextResponse.json({ error: "A room name is required." }, { status: 400 });
  }

  const config = getLiveKitConfig();
  if (!config) {
    return NextResponse.json(
      {
        error: "Live room settings are missing.",
        setup: [
          "LIVEKIT_URL",
          "NEXT_PUBLIC_LIVEKIT_URL",
          "LIVEKIT_API_KEY",
          "LIVEKIT_API_SECRET",
        ],
      },
      { status: 503 },
    );
  }

  let actor = null;
  if (process.env.NODE_ENV !== "production") {
    const testActor = url.searchParams.get("testActor");
    const cookieHeader = request.headers.get("cookie");
    const match = cookieHeader?.match(new RegExp(`${LOCAL_TEST_AUTH_COOKIE}=([^;]+)`));
    const seed = getLocalTestActorSeed(testActor || (match ? decodeURIComponent(match[1]) : null));
    if (seed) {
      const profile = await getWorkspaceProfile(seed);
      if (canAccessWorkspace(profile.role) || profile.role === "client") {
        actor = {
          clerkUserId: seed.clerkUserId,
          email: seed.email,
          displayName: profile.displayName,
          role: profile.role,
          profileId: profile.id,
        };
      }
    }
  }

  if (!actor) {
    actor = await requireActor();
  }

  const identity = actor.clerkUserId;
  const token = new AccessToken(config.apiKey, config.apiSecret, {
    identity,
    name: actor.displayName || undefined,
    metadata: JSON.stringify({
      role: actor.role,
      email: actor.email,
      displayName: actor.displayName,
    }),
    ttl: config.ttlSeconds,
  });

  token.addGrant({
    roomJoin: true,
    room: parsedQuery.data.roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return NextResponse.json({
    token: await token.toJwt(),
    serverUrl: config.serverUrl,
    expiresAt: new Date(Date.now() + config.ttlSeconds * 1000).toISOString(),
    ttlSeconds: config.ttlSeconds,
    roomName: parsedQuery.data.roomName,
    participant: {
      identity,
      name: actor.displayName,
      role: actor.role,
    },
  });
}
