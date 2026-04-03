import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Subjects", href: "/subjects" },
      { label: "How it works", href: "/how-it-works" },
      { label: "Tutors", href: "/tutors" },
      { label: "Students", href: "/auth/sign-up" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/tutors" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help centre", href: "/contact" },
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Terms of service", href: "/legal/terms" },
      { label: "Cookie policy", href: "/legal/cookies" },
    ],
  },
};

export function MarketingFooter() {
  return (
    <footer className="bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white">
      <div className="container-premium py-16">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-strong backdrop-blur">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral font-bold text-white shadow-soft">
                M
                </div>
                <span className="text-xl font-bold">MegaStar</span>
              </Link>
              <p className="mt-5 max-w-xl text-lg leading-8 text-navy-200">
                Personalised tutoring for families who want clear lessons, calm progress, and a simple path from first session to finished results.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-white text-navy hover:bg-navy-50">
                  <Link href="/auth/sign-up">Book free session</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10">
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-navy-200">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">1-to-1 lessons</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Friendly tutor matching</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Clear progress updates</span>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {Object.entries(footerLinks).map(([key, section]) => (
                <div key={key}>
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-navy-300">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-navy-100 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-10 bg-white/10" />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-navy-300">
              © {new Date().getFullYear()} MegaStar Tutoring. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/legal/privacy" className="text-sm text-navy-300 transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/legal/terms" className="text-sm text-navy-300 transition-colors hover:text-white">
                Terms
              </Link>
              <Link href="/legal/cookies" className="text-sm text-navy-300 transition-colors hover:text-white">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
