import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { examBoards, marketRegions, subjectRoutes, subjectShowcase } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Subjects",
  description:
    "Browse the subject map and open a dedicated subject page for maths, science, languages, or English.",
};

export default function SubjectsPage() {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-20">
        <div className="container-premium">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-6">Subjects</span>
              <h1 className="text-display-2 mb-6 text-navy">
                Open a subject, then{" "}
                <span className="gradient-text">drill into the detail</span>
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                This page is a hub, not an endpoint. Each subject now opens into its own page so the
                public site feels more like a premium product map than a long brochure.
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
                  <Link href="/how-it-works">See how it works</Link>
                </Button>
              </div>
            </div>

            <Card className="overflow-hidden border-navy-100 bg-white shadow-strong">
              <div className="relative h-[360px]">
                <Image
                  src="/visuals/subject-cs.svg"
                  alt="Curriculum and subject overview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/25 to-transparent" />
                <div className="absolute left-6 top-6">
                  <Badge className="rounded-full bg-white/90 px-4 py-2 text-navy shadow-soft">
                    Dedicated routes
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6 right-6 rounded-[24px] bg-white/92 p-5 shadow-soft backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                    More than a list
                  </p>
                  <p className="mt-2 text-lg font-semibold text-navy">
                    Each subject card opens a richer page with its own context, paths, and CTAs.
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
            <span className="eyebrow">Subject routes</span>
            <h2>Choose a subject to open its dedicated page</h2>
            <p>
              The strongest click path is now one level deeper. From here, users can jump into a
              subject-specific page instead of reading another general overview.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {subjectRoutes.map((subject) => (
              <Card key={subject.href} className="overflow-hidden border-navy-100 shadow-soft transition-transform hover:-translate-y-1">
                <div className="relative h-44">
                  <Image src={subject.image} alt={subject.title} fill sizes="(max-width: 1200px) 100vw, 25vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                  <div className="absolute left-5 bottom-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-navy shadow-soft">
                    Open page
                  </div>
                </div>
                <CardContent className="space-y-4 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: subject.accent }}>
                    Subject
                  </p>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-navy">{subject.title}</h3>
                    <p className="text-sm leading-6 text-navy-500">{subject.summary}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50">
                    <Link href={subject.href}>Open {subject.title}</Link>
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
              <span className="eyebrow mb-4">Subject depth</span>
              <h2 className="text-heading-1 text-navy">The library is bigger than one scroll</h2>
              <p className="mt-6 text-navy-500 leading-7">
                Each subject-specific page can now carry its own examples, exam support, tutor fit,
                and action buttons, while this hub keeps the overview clean.
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
              {subjectShowcase.slice(0, 4).map((subject) => (
                <Card key={subject.name} className="border-navy-100 bg-white shadow-soft">
                  <CardContent className="space-y-2 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: subject.accent }}>
                      {subject.note}
                    </p>
                    <p className="text-xl font-bold text-navy">{subject.name}</p>
                    <p className="text-sm leading-6 text-navy-500">
                      {subject.students.toLocaleString()} learners already use this as a starting point.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="rounded-[32px] border border-navy-100 bg-white p-8 shadow-soft">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <span className="eyebrow mb-4">Boards</span>
                <h2 className="text-heading-1 text-navy">The major exam boards stay visible here too</h2>
                <p className="mt-4 max-w-2xl text-navy-500 leading-7">
                  The subject hub keeps the board landscape in view, so families can move from
                  subject choice into the right kind of tutoring route.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {examBoards.map((board) => (
                  <Badge key={board} className="rounded-full bg-navy-50 px-4 py-2 text-navy shadow-soft">
                    {board}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="rounded-[32px] border border-navy-100 bg-white p-8 shadow-soft">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="eyebrow mb-4">Next step</span>
                <h2 className="text-heading-1 text-navy">Pick a subject route and keep moving</h2>
                <p className="mt-4 max-w-2xl text-navy-500 leading-7">
                  The homepage is no longer carrying the full subject story. This hub is now the
                  gateway, and the child pages will carry the richer breakdown.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/subjects/mathematics">Open Mathematics</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50">
                  <Link href="/subjects/english">Open English</Link>
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
