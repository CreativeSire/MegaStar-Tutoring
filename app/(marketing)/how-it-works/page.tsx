import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { processSteps, teachingPillars } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See how MegaStar Tutoring moves from assessment to live lesson, archive, and follow-up.",
};

export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-20">
        <div className="container-premium">
          <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-6">How it works</span>
              <h1 className="text-display-2 mb-6 text-navy">
                A clear route from first{" "}
                <span className="gradient-text">assessment to live teaching</span>
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                This page explains the full journey in one place so the homepage can stay concise
                and the live product can do the rest.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/auth/sign-up">Start free session</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50"
                >
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>

            <Card className="border-navy-100 bg-white shadow-strong">
              <CardContent className="space-y-5 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-coral">
                  Session flow
                </p>
                <div className="space-y-4">
                  {processSteps.map((step) => (
                    <div key={step.num} className="flex gap-4 rounded-3xl bg-navy-50/60 p-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-bold text-coral shadow-soft">
                        {step.num}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-navy">{step.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-navy-500">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="section-header mb-10">
            <span className="eyebrow">Inside the lesson</span>
            <h2>What happens once the room opens</h2>
            <p>
              The live room is now treated as a proper product surface, with a clear path through
              join, teaching, saving, and archive handoff.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {teachingPillars.map((pillar, index) => (
              <Card key={pillar.title} className="border-navy-100 shadow-soft">
                <CardContent className="space-y-3 p-6">
                  <Badge className="rounded-full bg-navy-50 px-3 py-1 text-navy">{`0${index + 1}`}</Badge>
                  <h3 className="text-xl font-bold text-navy">{pillar.title}</h3>
                  <p className="text-sm leading-6 text-navy-500">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-premium">
          <div className="rounded-[32px] border border-navy-100 bg-white p-8 shadow-soft">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <span className="eyebrow mb-4">Why this structure helps</span>
                <h2 className="text-heading-1 text-navy">The site is easier to understand when every step has its own page</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-navy-100 bg-navy-50/60 shadow-soft">
                  <CardContent className="space-y-2 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Before</p>
                    <p className="text-sm leading-6 text-navy-500">
                      The homepage held the subjects, process, tutors, and pricing in one scroll.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-navy-100 bg-coral-50/70 shadow-soft">
                  <CardContent className="space-y-2 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Now</p>
                    <p className="text-sm leading-6 text-navy-500">
                      The homepage points to dedicated pages, and the flow feels more premium.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-20">
        <div className="container-premium">
          <div className="rounded-[32px] border border-navy-100 bg-navy p-8 text-center shadow-strong">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-coral-200">
              Ready to move on
            </p>
            <h2 className="mb-4 text-4xl font-bold text-white">Open the classroom, or keep browsing the product pages</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-navy-200">
              The route structure is now clear enough that students, tutors, and families can land on the right page
              without having to scroll through everything at once.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="rounded-full bg-white text-navy hover:bg-navy-50">
                <Link href="/auth/sign-up">Start free session</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10">
                <Link href="/tutors">Meet tutors</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-navy-100" />
    </div>
  );
}
