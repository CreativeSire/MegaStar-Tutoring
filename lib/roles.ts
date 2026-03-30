export const appRoles = ["tutor", "client", "admin"] as const;

export type AppRole = (typeof appRoles)[number];

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && appRoles.includes(value as AppRole);
}

export function normalizeAppRole(value: unknown, fallback: AppRole = "tutor"): AppRole {
  return isAppRole(value) ? value : fallback;
}

export function canAccessWorkspace(role: AppRole) {
  return role === "tutor" || role === "admin";
}

export function canAccessClientPortal(role: AppRole) {
  return role === "client" || role === "admin";
}

function splitCsv(value: string | undefined) {
  return value
    ?.split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean) || [];
}

export function emailMatchesList(email: string | null | undefined, csvList: string | undefined) {
  if (!email) {
    return false;
  }

  return splitCsv(csvList).includes(email.toLowerCase());
}

export function getBootstrapRoleForEmail(email: string | null | undefined) {
  if (emailMatchesList(email, process.env.MEGASTAR_ADMIN_EMAILS)) {
    return "admin" as const;
  }

  if (emailMatchesList(email, process.env.MEGASTAR_WORKSPACE_EMAILS)) {
    return "tutor" as const;
  }

  if (emailMatchesList(email, process.env.MEGASTAR_CLIENT_EMAILS)) {
    return "client" as const;
  }

  return null;
}
