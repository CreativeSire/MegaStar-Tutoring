"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { NavItem } from "@/lib/navigation";
import type { AppRole } from "@/lib/roles";

type AppShellProps = {
  title: string;
  subtitle: string;
  nav: NavItem[];
  role: AppRole;
  children: ReactNode;
};

export function AppShell({ title, subtitle, nav, role, children }: AppShellProps) {
  const pathname = usePathname();
  const visibleNav = nav.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="brand-lockup workspace-brand">
          <div className="brand-mark">MS</div>
          <div>
            <div className="brand-name">{title}</div>
            <div className="brand-subtitle">{subtitle}</div>
          </div>
        </div>

        <nav className="workspace-nav">
          {visibleNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={active ? "workspace-link active" : "workspace-link"}>
                <span>{item.label}</span>
                <small>{item.description}</small>
              </Link>
            );
          })}
        </nav>

        <div className="workspace-note">
          Lessons, calendars, and invoices stay separate so each student only sees their own work.
        </div>
      </aside>

      <main className="workspace-main">
        <div className="workspace-topbar">
          <div>
            <div className="workspace-kicker">Tutor dashboard</div>
            <h1 className="workspace-title">{title}</h1>
          </div>
          <div className="workspace-topbar-actions">
            <div className="workspace-badge">{role}</div>
            <div className="workspace-badge">Private web app</div>
            <Link className="workspace-badge workspace-badge-link" href="/sign-in">
              Sign in
            </Link>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
