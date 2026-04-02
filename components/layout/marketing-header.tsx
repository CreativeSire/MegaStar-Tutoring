"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#subjects", label: "Subjects" },
  { href: "/#how-it-works", label: "How it Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tutors", label: "Tutors" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/92 backdrop-blur-xl shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-premium">
        <nav className="flex h-20 items-center justify-between rounded-b-3xl border-b border-transparent py-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-navy text-lg font-bold text-white shadow-soft">
              M
            </div>
            <span className="text-xl font-bold text-navy">MegaStar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="/auth/sign-in"
              className="text-sm font-semibold text-navy-600 transition-colors hover:text-navy"
            >
              Sign in
            </Link>
            <Button asChild className="rounded-full px-5">
              <Link href="/auth/sign-up">Book free session</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-20 border-b border-navy-100 bg-white p-6 shadow-lg md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-navy"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-navy-100" />
              <Link
                href="/auth/sign-in"
                className="text-lg font-medium text-navy-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Book free session</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
