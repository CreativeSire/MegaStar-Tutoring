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
