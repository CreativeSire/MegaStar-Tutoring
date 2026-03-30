import type { AppRole } from "@/lib/roles";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  roles?: AppRole[];
};

export const workspaceNav: NavItem[] = [
  { href: "/app", label: "Dashboard", description: "Daily overview", roles: ["tutor", "admin"] },
  { href: "/app/clients", label: "Clients", description: "Private client list", roles: ["tutor", "admin"] },
  { href: "/app/calendar", label: "Calendar", description: "Availability and sync", roles: ["tutor", "admin"] },
  { href: "/app/sessions", label: "Sessions", description: "Work log and attendance", roles: ["tutor", "admin"] },
  { href: "/app/invoices", label: "Invoices", description: "Private exports", roles: ["tutor", "admin"] },
  { href: "/app/ratings", label: "Ratings", description: "Tutor reviews", roles: ["tutor", "admin"] },
  { href: "/app/ai", label: "AI", description: "Assistant tools", roles: ["tutor", "admin"] },
  { href: "/app/admin", label: "Admin", description: "Audit and controls", roles: ["admin"] },
  { href: "/app/settings", label: "Settings", description: "Workspace setup", roles: ["tutor", "admin"] },
];

export const clientNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", description: "Your lessons", roles: ["client", "admin"] },
  { href: "/dashboard/sessions", label: "Sessions", description: "Attendance and notes", roles: ["client", "admin"] },
  { href: "/dashboard/invoices", label: "Invoices", description: "Billing history", roles: ["client", "admin"] },
  { href: "/dashboard/reschedule", label: "Reschedule", description: "Request a change", roles: ["client", "admin"] },
  { href: "/dashboard/review", label: "Review", description: "Rate your tutor", roles: ["client", "admin"] },
];
