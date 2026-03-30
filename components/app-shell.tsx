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
    <div className="app-shell">
      {/* Mobile Header */}
      <header className="app-mobile-header">
        <div className="brand-lockup">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">{title}</div>
          </div>
        </div>
        <div className="workspace-badge role-badge">{role}</div>
      </header>

      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <Link href="/" className="brand-lockup">
            <div className="brand-mark">M</div>
            <div>
              <div className="brand-name">{title}</div>
              <div className="brand-subtitle">{subtitle}</div>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-label">Menu</span>
            {visibleNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`nav-link ${active ? "active" : ""}`}
                >
                  <span className="nav-link-text">{item.label}</span>
                  <small>{item.description}</small>
                  {active && <span className="active-indicator" />}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="privacy-note">
            <span className="privacy-icon">🔒</span>
            <span>Your data is private and secure</span>
          </div>
          <Link href="/" className="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to website
          </Link>
        </div>
      </aside>

      <main className="app-main">
        <header className="main-header">
          <div className="header-title">
            <span className="header-eyebrow">{subtitle}</span>
            <h1 className="header-heading">{title}</h1>
          </div>
          <div className="header-actions">
            <div className="header-badge premium-badge">
              <span className="badge-dot" />
              {role}
            </div>
            <Link href="/sign-in" className="header-signout">
              Sign out
            </Link>
          </div>
        </header>
        
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  );
}
