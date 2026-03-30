"use client";

import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link href="/" className="brand-lockup">
          <div className="brand-mark">M</div>
          <div className="brand-name">MegaStar Tutoring</div>
        </Link>
        <nav className="public-nav">
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-up" className="nav-cta">
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
