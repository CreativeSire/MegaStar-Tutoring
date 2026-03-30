"use client";

import Link from "next/link";
import { UserButton, useAuth } from "@clerk/nextjs";

export function PublicHeader() {
  const { isSignedIn } = useAuth();

  return (
    <header className="public-header">
      <div className="brand-lockup">
        <div className="brand-mark">MS</div>
        <div>
          <div className="brand-name">MegaStar Tutoring</div>
          <div className="brand-subtitle">Private tutoring OS</div>
        </div>
      </div>
      <nav className="public-nav">
        <Link href="/app">Tutor app</Link>
        <Link href="/dashboard">Client portal</Link>
        {!isSignedIn ? (
          <Link href="/sign-in" className="public-nav-cta">
            Sign in
          </Link>
        ) : (
          <UserButton />
        )}
      </nav>
    </header>
  );
}
