export type NavItem = {
  href: string;
  label: string;
  description: string;
};

export const workspaceNav: NavItem[] = [
  { href: "/app", label: "Dashboard", description: "Daily overview" },
  { href: "/app/clients", label: "Clients", description: "Private client list" },
  { href: "/app/calendar", label: "Calendar", description: "Availability and sync" },
  { href: "/app/sessions", label: "Sessions", description: "Work log and attendance" },
  { href: "/app/invoices", label: "Invoices", description: "Private exports" },
  { href: "/app/ratings", label: "Ratings", description: "Tutor reviews" },
  { href: "/app/ai", label: "AI", description: "Assistant tools" },
  { href: "/app/settings", label: "Settings", description: "Workspace setup" },
];

export const clientNav: NavItem[] = [
  { href: "/dashboard", label: "Overview", description: "Your lessons" },
  { href: "/dashboard/sessions", label: "Sessions", description: "Attendance and notes" },
  { href: "/dashboard/invoices", label: "Invoices", description: "Billing history" },
  { href: "/dashboard/reschedule", label: "Reschedule", description: "Request a change" },
  { href: "/dashboard/review", label: "Review", description: "Rate your tutor" },
];
