import type { AppRole } from "@/lib/roles";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  roles?: AppRole[];
};

export const workspaceNav: NavItem[] = [
  { href: "/app", label: "Dashboard", description: "Today at a glance", roles: ["tutor", "admin"] },
  { href: "/app/clients", label: "Students", description: "Lesson profiles", roles: ["tutor", "admin"] },
  { href: "/app/calendar", label: "Calendar", description: "Lessons and availability", roles: ["tutor", "admin"] },
  { href: "/app/sessions", label: "Lessons", description: "Notes and attendance", roles: ["tutor", "admin"] },
  { href: "/app/invoices", label: "Invoices", description: "Private exports", roles: ["tutor", "admin"] },
  { href: "/app/ratings", label: "Reviews", description: "Tutor feedback", roles: ["tutor", "admin"] },
  { href: "/app/ai", label: "Help", description: "Smart suggestions", roles: ["tutor", "admin"] },
  { href: "/app/admin", label: "Admin", description: "People and access", roles: ["admin"] },
  { href: "/app/settings", label: "Settings", description: "App preferences", roles: ["tutor", "admin"] },
];

export const clientNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", description: "Your lessons", roles: ["client", "admin"] },
  { href: "/dashboard/sessions", label: "Lessons", description: "Times and notes", roles: ["client", "admin"] },
  { href: "/dashboard/invoices", label: "Payments", description: "Billing history", roles: ["client", "admin"] },
  { href: "/dashboard/reschedule", label: "Change time", description: "Ask for a new slot", roles: ["client", "admin"] },
  { href: "/dashboard/review", label: "Review", description: "Rate your tutor", roles: ["client", "admin"] },
];
