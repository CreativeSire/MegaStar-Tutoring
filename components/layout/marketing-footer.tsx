import Link from "next/link";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Subjects", href: "/#subjects" },
      { label: "Pricing", href: "/pricing" },
      { label: "For schools", href: "#" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help centre", href: "#" },
      { label: "Contact us", href: "/contact" },
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Terms of service", href: "/legal/terms" },
    ],
  },
  social: {
    title: "Connect",
    links: [
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
    ],
  },
};

export function MarketingFooter() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="container-premium py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral font-bold text-white">
                M
              </div>
              <span className="text-xl font-bold">MegaStar</span>
            </Link>
            <p className="mt-4 text-sm text-navy-300">
              Personalised online tutoring that delivers results. 94% of students improve by 2+ grades.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-navy-300">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-200 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-12 h-px bg-navy-700" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-navy-400">
            © {new Date().getFullYear()} MegaStar Tutoring. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="text-sm text-navy-400 hover:text-white">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-sm text-navy-400 hover:text-white">
              Terms
            </Link>
            <Link href="/legal/cookies" className="text-sm text-navy-400 hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
