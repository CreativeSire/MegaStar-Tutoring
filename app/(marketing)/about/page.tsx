import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about MegaStar Tutoring's mission to help every student achieve their full potential through personalised online tutoring.",
};

const stats = [
  { value: "2,500+", label: "Students helped" },
  { value: "50+", label: "Expert tutors" },
  { value: "30+", label: "Subjects covered" },
  { value: "94%", label: "Success rate" },
];

const values = [
  {
    title: "Results that feel real",
    description:
      "We keep lessons focused on clear progress, so students and families can see where the next step is.",
    image:
      "/visuals/subject-cs.svg",
  },
  {
    title: "Support that feels personal",
    description:
      "Every student gets a pace, style, and learning path shaped around how they learn best.",
    image:
      "/visuals/hero-classroom.svg",
  },
  {
    title: "Confidence built lesson by lesson",
    description:
      "We keep the experience calm and encouraging so students stay engaged and keep moving forward.",
    image:
      "/visuals/subject-history.svg",
  },
  {
    title: "Quality you can trust",
    description:
      "Tutors are selected with care, so families can feel good about every lesson from the start.",
    image:
      "/visuals/success-story.svg",
  },
];

const differentiators = [
  "Tutors matched around the way a student learns",
  "Weekly progress updates that are easy to understand",
  "Live lessons that feel natural and interactive",
  "Simple follow-up after every session",
  "Clear support for families from start to finish",
  "A calm, polished experience on every screen",
];

const team = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Head of Learning",
    bio: "Former Cambridge lecturer with a deep focus on clarity, confidence, and measurable progress.",
    image:
      "/visuals/tutor-emma.svg",
  },
  {
    name: "James Chen",
    role: "Science Tutor Lead",
    bio: "Imperial College graduate who brings structure and energy to maths and science lessons.",
    image:
      "/visuals/tutor-sarah.svg",
  },
  {
    name: "Emma Williams",
    role: "Humanities Tutor Lead",
    bio: "Oxford graduate with a warm style that helps students write, read, and speak with confidence.",
    image:
      "/visuals/tutor-james.svg",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-20">
        <div className="container-premium">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-6">About MegaStar</span>
              <h1 className="text-display-2 mb-6 text-navy">
                Tutoring that feels{" "}
                <span className="gradient-text">personal, calm, and clear</span>
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                MegaStar Tutoring was built on a simple belief: every student
                deserves a learning experience that feels thoughtful, focused,
                and tailored to the way they learn best.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/sign-up">Book a free session</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-navy-200 bg-white text-navy hover:bg-navy-50"
                >
                  <Link href="/contact">Talk to us</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  1-to-1 support
                </Badge>
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  Clear progress updates
                </Badge>
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  Friendly tutor matching
                </Badge>
              </div>
            </div>

            <div className="relative">
              <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[420px] overflow-hidden rounded-[32px] shadow-strong">
                  <Image
                    src="/visuals/success-story.svg"
                    alt="Students learning with a tutor"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                  <div className="absolute left-6 top-6">
                    <Badge className="rounded-full bg-white/90 px-4 py-2 text-navy shadow-soft">
                      Built around each learner
                    </Badge>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="rounded-3xl bg-white/90 p-5 shadow-soft backdrop-blur">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                        Trusted by families
                      </p>
                      <p className="mt-2 text-lg font-semibold text-navy">
                        Lessons that stay clear, personal, and easy to follow.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Card className="overflow-hidden border-white/50 bg-white/80 shadow-soft backdrop-blur">
                    <div className="relative h-48">
                      <Image
                        src="/visuals/hero-classroom.svg"
                        alt="Tutor and student working together"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="space-y-2 p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                        Personal attention
                      </p>
                      <p className="text-lg font-semibold text-navy">
                        Every learner gets a plan that fits.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-coral-100 bg-coral-50/80 shadow-soft">
                    <CardContent className="space-y-3 p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                        Strong results
                      </p>
                      <p className="text-4xl font-bold text-navy">94%</p>
                      <p className="text-sm text-navy-500">
                        of students improve by at least two grades within a few months.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="overflow-hidden border-white/50 bg-white/80 shadow-soft">
                    <div className="relative h-36">
                      <Image
                        src="/visuals/subject-history.svg"
                        alt="Online tutoring session"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-premium">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-navy-100 bg-navy-50/50 text-center">
                <CardContent className="space-y-1 py-8">
                  <p className="text-4xl font-bold text-navy">{stat.value}</p>
                  <p className="text-sm uppercase tracking-[0.22em] text-navy-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="eyebrow mb-4">What we stand for</span>
            <h2 className="text-heading-1 text-navy">A clearer, calmer tutoring experience</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <Card key={value.title} className="overflow-hidden border-navy-100 shadow-soft">
                <div className="relative h-64">
                  <Image src={value.image} alt={value.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-navy/10 to-transparent" />
                  <div className="absolute left-5 top-5">
                    <Badge className="rounded-full bg-white/90 px-4 py-2 text-navy shadow-soft">
                      0{index + 1}
                    </Badge>
                  </div>
                </div>
                <CardContent className="space-y-3 p-6">
                  <h3 className="text-2xl font-bold text-navy">{value.title}</h3>
                  <p className="text-navy-500">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-coral-50">
        <div className="container-premium">
          <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative overflow-hidden rounded-[32px] shadow-strong">
              <Image
                src="/visuals/hero-classroom.svg"
                alt="Students in a tutoring session"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <span className="eyebrow mb-4">Why families choose us</span>
              <h2 className="text-heading-1 mb-6 text-navy">A service that feels thoughtful from the first lesson</h2>
              <p className="mb-8 max-w-2xl text-navy-500">
                We keep things simple for families and serious about learning.
                Students know what&apos;s happening next, tutors know the plan,
                and progress stays visible without feeling overwhelming.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {differentiators.map((item, index) => (
                  <Card key={item} className="border-white/70 bg-white/85 shadow-soft">
                    <CardContent className="flex items-start gap-4 p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-coral-50 text-sm font-bold text-coral">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-navy-600">{item}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="eyebrow mb-4">Our team</span>
            <h2 className="text-heading-1 text-navy">Meet the educators behind MegaStar</h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((person) => (
              <Card key={person.name} className="overflow-hidden border-navy-100 shadow-soft">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
                </div>
                <CardContent className="space-y-2 p-6">
                  <Badge className="rounded-full bg-coral-50 px-3 py-1 text-coral">
                    {person.role}
                  </Badge>
                  <h3 className="text-xl font-bold text-navy">{person.name}</h3>
                  <p className="text-sm leading-6 text-navy-500">{person.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="container-premium">
          <div className="rounded-[32px] border border-white/10 bg-white/5 px-8 py-10 text-center shadow-strong">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-coral-200">
              Ready when you are
            </p>
            <h2 className="mb-6 text-4xl font-bold text-white">
              Ready to start a better learning rhythm?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-8 text-navy-200">
              Join families who want tutoring to feel calm, personal, and
              easy to trust.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full bg-white text-navy hover:bg-navy-50"
              >
                <Link href="/sign-up">Book free session</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/25 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

