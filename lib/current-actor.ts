import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isClerkConfigured } from "@/lib/clerk-config";
import { canAccessClientPortal, canAccessWorkspace, getBootstrapRoleForEmail, normalizeAppRole, type AppRole } from "@/lib/roles";
import { findWorkspaceProfileByClerkUserId, getWorkspaceProfile, type Actor } from "@/lib/repository";

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

function isWorkspaceBootstrapEmail(email: string | null | undefined) {
  return Boolean(email && (getBootstrapRoleForEmail(email) === "tutor" || getBootstrapRoleForEmail(email) === "admin"));
}

export async function requireActor(options: RequireActorOptions = {}): Promise<Actor> {
  if (!isClerkConfigured()) {
    redirect("/sign-in");
  }

  const actor = await resolveActor(options);
  if (!actor) {
    redirect("/sign-in");
  }

  return actor;
}

export async function resolveActor(options: RequireActorOptions = {}): Promise<Actor | null> {
  if (!isClerkConfigured()) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return null;
  }

  const existingProfile = await findWorkspaceProfileByClerkUserId(user.id);
  const actorSeed = {
    clerkUserId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    displayName:
      user.fullName ||
      user.firstName ||
    user.username ||
    user.primaryEmailAddress?.emailAddress ||
    "Tutor",
    role:
      existingProfile?.role ||
      normalizeAppRole(
        getRoleFromUserMetadata(user) || getBootstrapRoleForEmail(user.primaryEmailAddress?.emailAddress),
        options.bootstrapRole || getDefaultRoleFromEnvironment(),
      ),
  };
  const profile = existingProfile || (await getWorkspaceProfile(actorSeed));

  return {
    clerkUserId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    displayName: actorSeed.displayName,
    role: profile.role,
    profileId: profile.id,
  };
}

export async function requireWorkspaceActor(options: RequireActorOptions = {}) {
  if (!isClerkConfigured()) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const existingProfile = await findWorkspaceProfileByClerkUserId(user.id);
  if (!existingProfile && !isWorkspaceBootstrapEmail(user.primaryEmailAddress?.emailAddress)) {
    redirect("/dashboard");
  }

  const actor = await resolveActor({ bootstrapRole: options.bootstrapRole || "tutor" });
  if (!actor || !canAccessWorkspace(actor.role || getDefaultRoleFromEnvironment())) {
    redirect("/dashboard");
  }

  return actor;
}

export async function requireClientActor(options: RequireActorOptions = {}) {
  if (!isClerkConfigured()) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const existingProfile = await findWorkspaceProfileByClerkUserId(user.id);
  if (!existingProfile && isWorkspaceBootstrapEmail(user.primaryEmailAddress?.emailAddress)) {
    redirect("/app");
  }

  const actor = await resolveActor({ bootstrapRole: options.bootstrapRole || "client" });
  if (!actor || !canAccessClientPortal(actor.role || getDefaultRoleFromEnvironment())) {
    redirect("/app");
  }

  return actor;
}

export async function requireAdminActor(options: RequireRoleOptions = {}) {
  if (!isClerkConfigured()) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const existingProfile = await findWorkspaceProfileByClerkUserId(user.id);
  const email = user.primaryEmailAddress?.emailAddress ?? null;
  if (!existingProfile && getBootstrapRoleForEmail(email) !== "admin") {
    redirect(options.redirectTo || "/app");
  }

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
