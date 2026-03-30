"use client";

import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="brand-lockup">
        <div className="brand-mark">MS</div>
        <div>
          <div className="brand-name">MegaStar Tutoring</div>
          <div className="brand-subtitle">Tutoring made simple</div>
        </div>
      </div>
      <nav className="public-nav">
        <Link href="/app">Dashboard</Link>
        <Link href="/dashboard">Student area</Link>
        <Link href="/sign-in" className="public-nav-cta">
          Sign in
        </Link>
      </nav>
    </header>
  );
}
