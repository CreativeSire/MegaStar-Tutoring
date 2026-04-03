import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { journeyRoutes, processSteps, teachingPillars } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Open the assessment, matching, live classroom, and archive pages to see the full tutoring flow.",
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
                The tutoring flow now has{" "}
                <span className="gradient-text">its own route tree</span>
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                Use this hub to jump into the exact step you want to see, whether that is assessment,
                matching, the live classroom, or the archive handoff.
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
                  <Link href="/subjects">Open subjects hub</Link>
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden border-navy-100 bg-white shadow-strong">
              <div className="relative h-[360px]">
                <Image
                  src="/visuals/hero-classroom.svg"
                  alt="Live tutoring journey overview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/25 to-transparent" />
                <div className="absolute left-6 top-6">
                  <Badge className="rounded-full bg-white/90 px-4 py-2 text-navy shadow-soft">
                    Route hub
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6 right-6 rounded-[24px] bg-white/92 p-5 shadow-soft backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                    Click deeper
                  </p>
                  <p className="mt-2 text-lg font-semibold text-navy">
                    Assessment, matching, live room, and archive now live on their own pages.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="section-header mb-10">
            <span className="eyebrow">Step routes</span>
            <h2>Open the exact part of the journey you want</h2>
            <p>
              Every card below opens a dedicated page, so the teaching flow reads like a real multi-page product.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {journeyRoutes.map((route) => (
              <Card key={route.href} className="overflow-hidden border-navy-100 shadow-soft transition-transform hover:-translate-y-1">
                <div className="relative h-44">
                  <Image src={route.image} alt={route.title} fill sizes="(max-width: 1200px) 100vw, 25vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                </div>
                <CardContent className="space-y-4 p-6">
                  <Badge className="rounded-full bg-navy-50 px-3 py-1 text-navy">Journey step</Badge>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-navy">{route.title}</h3>
                    <p className="text-sm leading-6 text-navy-500">{route.summary}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50">
                    <Link href={route.href}>Open page</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-premium">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-4">Flow summary</span>
              <h2 className="text-heading-1 text-navy">A route tree instead of a single explanation page</h2>
              <p className="mt-6 text-navy-500 leading-7">
                The hub stays concise, while the step pages carry the real details and the deeper click paths.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {teachingPillars.map((pillar) => (
                <Card key={pillar.title} className="border-navy-100 bg-white shadow-soft">
                  <CardContent className="space-y-2 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">{pillar.title}</p>
                    <p className="text-sm leading-6 text-navy-500">{pillar.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="section-header mb-10">
            <span className="eyebrow">Route sequence</span>
            <h2>The flow still matters, even when the pages split apart</h2>
            <p>
              This quick sequence gives the hub a little more depth while keeping the child pages
              available for the richer detail.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {processSteps.map((step) => (
              <Card key={step.num} className="border-navy-100 shadow-soft">
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">{step.num}</p>
                  <h3 className="text-xl font-bold text-navy">{step.title}</h3>
                  <p className="text-sm leading-6 text-navy-500">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="rounded-[32px] border border-navy-100 bg-white p-8 shadow-soft">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="eyebrow mb-4">Next action</span>
                <h2 className="text-heading-1 text-navy">Choose a step and keep exploring</h2>
                <p className="mt-4 max-w-2xl text-navy-500 leading-7">
                  The product now gives you something different on each page, so you can move from overview into detail without repeating yourself.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/how-it-works/live-classroom">Open live classroom</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50">
                  <Link href="/how-it-works/archive">Open archive</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="bg-navy-100" />
    </div>
  );
}
