import { auth } from "@clerk/nextjs/server";
import { isClerkConfigured } from "@/lib/clerk-config";
import { LOCAL_TEST_AUTH_COOKIE, getLocalTestActorSeed } from "@/lib/local-test-auth";
import { findWorkspaceProfileByClerkUserId, type Actor } from "@/lib/repository";
import { canAccessClientPortal, canAccessWorkspace } from "@/lib/roles";

type AccessKind = "workspace" | "client" | "admin";

function readTestEmailFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) {
    return null;
  }

  const match = cookieHeader.match(new RegExp(`${LOCAL_TEST_AUTH_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function readTestEmailFromRequestHeaders(request: Request) {
  const headerValue = request.headers.get("x-megastar-test-actor");
  return headerValue && headerValue.trim() ? headerValue.trim() : null;
}

async function resolveLocalTestActor(request: Request, access: AccessKind): Promise<Actor | null> {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const url = new URL(request.url);
  const seed = getLocalTestActorSeed(
    readTestEmailFromRequestHeaders(request) || url.searchParams.get("testActor") || readTestEmailFromCookieHeader(request.headers.get("cookie")),
  );
  if (!seed) {
    return null;
  }

  const profile = await findWorkspaceProfileByClerkUserId(seed.clerkUserId);
  const role = profile?.role || seed.role;
  const canAccess =
    access === "workspace" ? canAccessWorkspace(role) : access === "client" ? canAccessClientPortal(role) : role === "admin";
  if (!canAccess) {
    return null;
  }

  return {
    clerkUserId: seed.clerkUserId,
    profileId: profile?.id || seed.clerkUserId,
    role,
    email: profile?.email || seed.email,
    displayName: profile?.displayName || seed.displayName,
  };
}

async function resolveClerkActor(access: AccessKind): Promise<Actor | null> {
  if (!isClerkConfigured()) {
    return null;
  }

  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const profile = await findWorkspaceProfileByClerkUserId(userId);
  if (!profile) {
    return null;
  }

  const canAccess = access === "workspace" ? canAccessWorkspace(profile.role) : access === "client" ? canAccessClientPortal(profile.role) : profile.role === "admin";
  if (!canAccess) {
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

export async function requireApiActor(request: Request, access: AccessKind): Promise<Actor | null> {
  return (await resolveLocalTestActor(request, access)) || resolveClerkActor(access);
}
