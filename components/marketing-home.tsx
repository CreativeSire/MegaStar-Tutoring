import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { gatewayPages, marketRegions, teachingPillars } from "@/lib/marketing-content";

export function MarketingHome() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-20">
        <div className="container-premium">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-6">Multi-page tutoring platform</span>
              <h1 className="text-display-2 mb-6 text-navy">
                One brand, with{" "}
                <span className="gradient-text">separate pages for every part</span>{" "}
                of the journey
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                Subjects, how it works, tutors, pricing, and the live classroom now live on
                their own routes so the experience feels clearer, premium, and easier to move through.
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
                  <Link href="/subjects">Explore subjects</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {marketRegions.map((region) => (
                  <Badge key={region} className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="overflow-hidden border-white/70 bg-white shadow-strong">
                <div className="relative h-[340px]">
                  <Image
                    src="/visuals/hero-classroom.svg"
                    alt="Live classroom in progress"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                  <div className="absolute left-6 top-6">
                    <Badge className="rounded-full bg-white/90 px-4 py-2 text-navy shadow-soft">
                      Live classroom
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 rounded-[24px] bg-white/92 p-5 shadow-soft backdrop-blur">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                      What is live
                    </p>
                    <p className="mt-2 text-lg font-semibold text-navy">
                      Video, board sync, archive handoff, and follow-up in one place.
                    </p>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-navy-100 bg-white shadow-soft">
                  <CardContent className="space-y-3 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                      Region ready
                    </p>
                    <p className="text-lg font-semibold text-navy">Built for UK, Nigeria, Europe, and North America</p>
                    <p className="text-sm leading-6 text-navy-500">
                      The marketing and classroom paths now reflect the international scope more clearly.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-navy-100 bg-coral-50 shadow-soft">
                  <CardContent className="space-y-3 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                      Clear routing
                    </p>
                    <p className="text-lg font-semibold text-navy">Every major topic now has its own page</p>
                    <p className="text-sm leading-6 text-navy-500">
                      Subjects, how it works, tutors, and pricing are no longer buried inside a single scroll.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="section-header mb-10">
            <span className="eyebrow">Explore the site</span>
            <h2>Every part of the journey now has its own route</h2>
            <p>
              The homepage is now a starting point, not a wall of sections. Tap through to the
              page that matches what you want to see.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {gatewayPages.map((page) => (
              <Card key={page.href} className="overflow-hidden border-navy-100 shadow-soft transition-transform hover:-translate-y-1">
                <div className="relative h-44">
                  <Image src={page.image} alt={page.title} fill sizes="(max-width: 1200px) 100vw, 25vw" className="object-cover" />
                </div>
                <CardContent className="space-y-4 p-6">
                  <Badge className="rounded-full bg-navy-50 px-3 py-1 text-navy">{page.label}</Badge>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-navy">{page.title}</h3>
                    <p className="text-sm leading-6 text-navy-500">{page.description}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50">
                    <Link href={page.href}>Open page</Link>
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
              <span className="eyebrow mb-4">Why it feels clearer</span>
              <h2 className="text-heading-1 text-navy">The site is now organized by intent</h2>
              <p className="mt-6 text-navy-500 leading-7">
                Instead of hiding the curriculum, process, tutors, and plans inside a single homepage,
                the structure now gives each part a home of its own.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {marketRegions.map((region) => (
                  <Badge key={region} className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {teachingPillars.map((pillar) => (
                <Card key={pillar.title} className="border-navy-100 bg-white shadow-soft">
                  <CardContent className="space-y-3 p-6">
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
          <div className="rounded-[32px] border border-navy-100 bg-navy-50/60 p-8 shadow-soft">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="eyebrow mb-4">Next step</span>
                <h2 className="text-heading-1 text-navy">Pick a page, then keep moving</h2>
                <p className="mt-4 max-w-2xl text-navy-500 leading-7">
                  The premium flow is now split across the routes that matter, so you can
                  browse subjects, understand the process, and then move into the classroom or the client areas.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/auth/sign-up">Start free session</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50">
                  <Link href="/pricing">View pricing</Link>
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
