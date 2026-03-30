import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { canAccessClientPortal, canAccessWorkspace, normalizeAppRole, type AppRole } from "@/lib/roles";
import { getWorkspaceProfile, type Actor } from "@/lib/repository";

type RequireActorOptions = {
  bootstrapRole?: AppRole;
};

type RequireRoleOptions = RequireActorOptions & {
  redirectTo?: string;
};

function getDefaultRoleFromEnvironment() {
  return normalizeAppRole(process.env.MEGASTAR_DEFAULT_ROLE, "tutor");
}

function getRoleFromUserMetadata(user: Awaited<ReturnType<typeof currentUser>>) {
  const publicMetadata = user?.publicMetadata as Record<string, unknown> | undefined;
  return publicMetadata?.role;
}

export async function requireActor(options: RequireActorOptions = {}): Promise<Actor> {
  const actor = await resolveActor(options);
  if (!actor) {
    redirect("/sign-in");
  }

  return actor;
}

export async function resolveActor(options: RequireActorOptions = {}): Promise<Actor | null> {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const actorSeed = {
    clerkUserId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    displayName:
      user.fullName ||
      user.firstName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      "Tutor",
    role: normalizeAppRole(getRoleFromUserMetadata(user), options.bootstrapRole || getDefaultRoleFromEnvironment()),
  };
  const profile = await getWorkspaceProfile(actorSeed);

  return {
    clerkUserId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    displayName: actorSeed.displayName,
    role: profile.role,
    profileId: profile.id,
  };
}

export async function requireWorkspaceActor(options: RequireActorOptions = {}) {
  const actor = await requireActor({ bootstrapRole: options.bootstrapRole || "tutor" });
  if (!canAccessWorkspace(actor.role || getDefaultRoleFromEnvironment())) {
    redirect("/dashboard");
  }

  return actor;
}

export async function requireClientActor(options: RequireActorOptions = {}) {
  const actor = await requireActor({ bootstrapRole: options.bootstrapRole || "client" });
  if (!canAccessClientPortal(actor.role || getDefaultRoleFromEnvironment())) {
    redirect("/app");
  }

  return actor;
}

export async function requireAdminActor(options: RequireRoleOptions = {}) {
  const actor = await requireActor(options);
  if (actor.role !== "admin") {
    redirect(options.redirectTo || "/app");
  }

  return actor;
}

export async function requireRole(allowedRoles: AppRole[], options: RequireRoleOptions = {}) {
  const actor = await requireActor(options);
  if (!allowedRoles.includes(actor.role || getDefaultRoleFromEnvironment())) {
    const redirectTarget = canAccessClientPortal(actor.role || getDefaultRoleFromEnvironment()) ? "/dashboard" : "/app";
    redirect(options.redirectTo || redirectTarget);
  }

  return actor;
}
