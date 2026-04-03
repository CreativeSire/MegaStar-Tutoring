import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { examBoards, marketRegions, subjectShowcase } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Subjects",
  description:
    "Browse the subjects, exam boards, and language tracks we support across our tutoring platform.",
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
                Every subject sits on its{" "}
                <span className="gradient-text">own page of the journey</span>
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                Use this page to explore the curriculum, see where the strongest demand is,
                and move from subject discovery into tutoring and pricing without losing your place.
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
                    Multi-region support
                  </Badge>
                </div>
                <div className="absolute bottom-6 left-6 right-6 rounded-[24px] bg-white/92 p-5 shadow-soft backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                    Subjects and routes
                  </p>
                  <p className="mt-2 text-lg font-semibold text-navy">
                    The page is designed for quick scanning, not endless scrolling.
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
            <span className="eyebrow">Subject library</span>
            <h2>Explore the subjects students ask for most</h2>
            <p>
              Each card is calm, image-led, and easy to compare. You can move from one subject to another
              without losing the broader learning context.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {subjectShowcase.map((subject) => (
              <Card key={subject.name} className="overflow-hidden border-navy-100 shadow-soft">
                <div className="relative h-48">
                  <Image src={subject.image} alt={subject.name} fill sizes="(max-width: 1200px) 100vw, 33vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                  <div className="absolute left-5 bottom-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-navy shadow-soft">
                    {subject.students.toLocaleString()} learners
                  </div>
                </div>
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: subject.accent }}>
                    {subject.note}
                  </p>
                  <h3 className="text-2xl font-bold text-navy">{subject.name}</h3>
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
              <span className="eyebrow mb-4">Exam support</span>
              <h2 className="text-heading-1 text-navy">Built to support real exam paths</h2>
              <p className="mt-6 text-navy-500 leading-7">
                The platform is set up for students across the UK, Nigeria, Germany, Spain, Mauritius,
                France, the US, and Canada, with the subject presentation staying clear and premium.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {examBoards.map((board) => (
                  <Badge key={board} className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                    {board}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {marketRegions.map((region) => (
                <Card key={region} className="border-navy-100 bg-white shadow-soft">
                  <CardContent className="space-y-2 p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">Region</p>
                    <p className="text-xl font-bold text-navy">{region}</p>
                    <p className="text-sm leading-6 text-navy-500">
                      The tutoring flow and marketing language stay aligned for this market.
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="eyebrow mb-4">Next move</span>
                <h2 className="text-heading-1 text-navy">Compare a subject, then move into the teaching flow</h2>
                <p className="mt-4 max-w-2xl text-navy-500 leading-7">
                  The homepage no longer needs to carry every subject itself. This page gives you the
                  scan-friendly overview, and the rest of the product handles the live session journey.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/auth/sign-up">Start free session</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50">
                  <Link href="/tutors">Meet tutors</Link>
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
