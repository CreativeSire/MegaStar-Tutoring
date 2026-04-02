import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Transparent pricing for MegaStar Tutoring.",
};

const tiers = [
  {
    name: "Starter",
    price: "£35",
    subtitle: "For families trying us out",
    accent: "bg-white",
    features: ["1-to-1 lessons", "Private notes and updates", "Live classroom access", "Email support"],
    cta: "Start free session",
    href: "/auth/sign-up",
  },
  {
    name: "Monthly",
    price: "£29",
    subtitle: "For regular weekly learning",
    accent: "bg-coral-50",
    features: ["Everything in Starter", "Priority booking", "Weekly progress summaries", "Family-friendly reminders"],
    cta: "Book a call",
    href: "/contact",
    featured: true,
  },
  {
    name: "Semester",
    price: "£25",
    subtitle: "For long-term exam preparation",
    accent: "bg-navy-50",
    features: ["Everything in Monthly", "Exam planning support", "Private invoice exports", "Progress-first scheduling"],
    cta: "Talk to us",
    href: "/contact",
  },
];

const guarantees = [
  "No hidden fees",
  "Cancel anytime",
  "Private client records",
  "Works across UK, Nigeria, Germany, Spain, and Mauritius",
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-18">
        <div className="container-premium">
          <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-6">Pricing</span>
              <h1 className="text-display-2 mb-6 text-navy">
                Simple pricing that feels{" "}
                <span className="gradient-text">premium, fair, and clear</span>
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                Choose a plan that fits the way you teach or learn. We keep the structure calm, private, and easy to
                understand so families know exactly what they are getting.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">Transparent rates</Badge>
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">Private lesson logs</Badge>
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">Live classroom included</Badge>
              </div>
            </div>

            <Card className="border-navy-100 bg-white/90 shadow-strong backdrop-blur">
              <CardContent className="space-y-6 p-7">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">What is included</p>
                  <h2 className="text-2xl font-bold text-navy">A premium tutoring stack without the clutter</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {guarantees.map((item) => (
                    <div key={item} className="rounded-3xl border border-navy-100 bg-navy-50/60 p-4 text-sm leading-6 text-navy-600">
                      {item}
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Best fit</p>
                  <p className="text-lg leading-7 text-navy-600">
                    Families, solo tutors, and small tutoring teams who want an elegant workflow from first lesson to
                    invoice export.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`overflow-hidden border-navy-100 shadow-soft ${tier.featured ? "ring-2 ring-coral-200" : ""}`}
              >
                <div className={`p-6 ${tier.accent}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">{tier.name}</p>
                      <h3 className="mt-2 text-3xl font-bold text-navy">{tier.price}</h3>
                    </div>
                    {tier.featured ? (
                      <Badge className="rounded-full bg-navy px-3 py-1 text-white">Most chosen</Badge>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-navy-500">{tier.subtitle}</p>
                </div>
                <CardContent className="space-y-5 p-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-navy-600">
                        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral-50 text-[11px] font-bold text-coral">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full rounded-full">
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-premium">
          <div className="rounded-[32px] border border-navy-100 bg-white p-8 shadow-soft">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className="eyebrow mb-4">Why it feels premium</span>
                <h2 className="text-heading-1 text-navy">Pricing that stays out of the way</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-navy-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Private by default</p>
                  <p className="mt-2 text-sm leading-6 text-navy-600">
                    Lesson history, notes, and invoices stay inside the tutor workspace and client portal.
                  </p>
                </div>
                <div className="rounded-3xl bg-coral-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Works live</p>
                  <p className="mt-2 text-sm leading-6 text-navy-600">
                    The classroom, archive, and scheduling flow are wired for real tutoring sessions.
                  </p>
                </div>
                <div className="rounded-3xl bg-navy-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Built for scale</p>
                  <p className="mt-2 text-sm leading-6 text-navy-600">
                    The market layer handles different locales and keeps the experience aligned across regions.
                  </p>
                </div>
                <div className="rounded-3xl bg-coral-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Easy next step</p>
                  <p className="mt-2 text-sm leading-6 text-navy-600">
                    Start on a single plan, then grow into the full tutoring workflow without changing tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="container-premium">
          <div className="rounded-[32px] border border-white/10 bg-white/5 px-8 py-10 text-center shadow-strong">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-coral-200">
              Ready when you are
            </p>
            <h2 className="mb-4 text-4xl font-bold text-white">Choose the path that fits your teaching rhythm</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-navy-200">
              If you want a live demo, a pricing walkthrough, or a quick setup chat, we can keep it simple and move
              fast.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="rounded-full bg-white text-navy hover:bg-navy-50">
                <Link href="/auth/sign-up">Start free session</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10">
                <Link href="/contact">Talk to us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
