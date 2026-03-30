"use client";

import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link href="/" className="brand-lockup">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">MegaStar Tutoring</div>
            <div className="brand-tagline">Excellence in Education</div>
          </div>
        </Link>
        <nav className="public-nav">
          <Link href="/sign-up">Get Started</Link>
          <Link href="/sign-in" className="public-nav-cta">
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
