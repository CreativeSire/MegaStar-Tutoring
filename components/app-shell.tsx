"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { NavItem } from "@/lib/navigation";

type AppShellProps = {
  title: string;
  subtitle: string;
  nav: NavItem[];
  children: ReactNode;
};

export function AppShell({ title, subtitle, nav, children }: AppShellProps) {
  const pathname = usePathname();

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
          {nav.map((item) => {
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
          Google Calendar sync, ratings, and invoices stay private by default.
        </div>
      </aside>

      <main className="workspace-main">
        <div className="workspace-topbar">
          <div>
            <div className="workspace-kicker">Operational workspace</div>
            <h1 className="workspace-title">{title}</h1>
          </div>
          <div className="workspace-badge">Web app on Vercel</div>
        </div>
        {children}
      </main>
    </div>
  );
}
