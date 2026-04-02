import { getBootstrapRoleForEmail, normalizeAppRole, type AppRole } from "@/lib/roles";

export const LOCAL_TEST_AUTH_COOKIE = "megastar_test_actor";

export type LocalTestActorSeed = {
  clerkUserId: string;
  email: string;
  displayName: string;
  role: AppRole;
};

function getDefaultRoleFromEnvironment(): AppRole {
  return normalizeAppRole(process.env.MEGASTAR_DEFAULT_ROLE, "tutor");
}

export function getLocalTestActorSeed(email: string | null | undefined): LocalTestActorSeed | null {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) {
    return null;
  }

  const displayName = normalizedEmail
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const role = normalizeAppRole(getBootstrapRoleForEmail(normalizedEmail) || getDefaultRoleFromEnvironment(), "tutor");

  return {
    clerkUserId: `test:${normalizedEmail}`,
    email: normalizedEmail,
    displayName: displayName || normalizedEmail,
    role,
  };
}

