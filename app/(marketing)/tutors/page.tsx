import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Our Tutors",
  description:
    "Meet our expert tutors. Top applicants are carefully reviewed, so students get patient, clear, and reliable support.",
};

const subjects = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "History",
  "Languages",
];

const features = [
  {
    title: "Carefully chosen",
    description:
      "Every tutor profile is reviewed for subject knowledge, clarity, and teaching style.",
    image:
      "/visuals/hero-classroom.svg",
  },
  {
    title: "Interactive lessons",
    description:
      "Students can ask questions, work through examples, and stay engaged throughout the session.",
    image:
      "/visuals/subject-spanish.svg",
  },
  {
    title: "Clear progress",
    description:
      "Families can see how lessons are going and what to focus on next.",
    image:
      "/visuals/subject-cs.svg",
  },
  {
    title: "Safe and supportive",
    description:
      "We keep the experience calm, consistent, and easy to trust from the first lesson.",
    image:
      "/visuals/hero-classroom.svg",
  },
];

const tutors = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    subject: "Mathematics",
    image:
      "/visuals/tutor-emma.svg",
    rating: 5.0,
    reviews: 127,
    university: "Cambridge",
    experience: "8 years",
    specialties: ["GCSE", "A-Level", "Further Maths"],
    bio: "Former Cambridge lecturer with a calm approach that helps complex ideas feel manageable.",
    price: 45,
  },
  {
    id: "2",
    name: "James Chen",
    subject: "Physics",
    image:
      "/visuals/tutor-sarah.svg",
    rating: 4.9,
    reviews: 94,
    university: "Imperial",
    experience: "6 years",
    specialties: ["A-Level", "IB", "Oxbridge Prep"],
    bio: "Imperial College graduate who makes physics feel logical, visual, and much easier to follow.",
    price: 42,
  },
  {
    id: "3",
    name: "Emma Williams",
    subject: "English",
    image:
      "/visuals/tutor-sarah.svg",
    rating: 5.0,
    reviews: 156,
    university: "Oxford",
    experience: "10 years",
    specialties: ["11+", "GCSE", "A-Level", "Creative Writing"],
    bio: "Oxford graduate with a thoughtful style that helps students build confidence in writing and reading.",
    price: 40,
  },
  {
    id: "4",
    name: "Dr. Michael Brown",
    subject: "Chemistry",
    image:
      "/visuals/tutor-james.svg",
    rating: 4.9,
    reviews: 112,
    university: "UCL",
    experience: "7 years",
    specialties: ["GCSE", "A-Level", "Organic Chemistry"],
    bio: "PhD chemist with a structured teaching style and a strong focus on exam confidence.",
    price: 43,
  },
  {
    id: "5",
    name: "Lisa Park",
    subject: "Biology",
    image:
      "/visuals/tutor-emma.svg",
    rating: 4.8,
    reviews: 89,
    university: "King's College",
    experience: "5 years",
    specialties: ["GCSE", "A-Level", "Human Biology"],
    bio: "Medical student turned tutor who brings energy and clarity to biology topics.",
    price: 38,
  },
  {
    id: "6",
    name: "David Thompson",
    subject: "History",
    image:
      "/visuals/tutor-james.svg",
    rating: 4.9,
    reviews: 76,
    university: "LSE",
    experience: "9 years",
    specialties: ["GCSE", "A-Level", "Modern History"],
    bio: "History tutor who makes timelines, sources, and essays feel more natural to work through.",
    price: 40,
  },
];

export default function TutorsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-navy-50 via-white to-coral-50/50 pt-32 pb-20">
        <div className="container-premium">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-2xl">
              <span className="eyebrow mb-6">Expert tutors</span>
              <h1 className="text-display-2 mb-6 text-navy">
                Learn from tutors who feel{" "}
                <span className="gradient-text">warm, clear, and real</span>
              </h1>
              <p className="text-body-large max-w-2xl text-navy-500">
                We work with tutors who know how to make lessons feel calm and
                focused, so students can ask questions freely and keep moving
                forward.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  Carefully reviewed
                </Badge>
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  Clear teaching style
                </Badge>
                <Badge className="rounded-full bg-white px-4 py-2 text-navy shadow-soft">
                  Friendly support
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="overflow-hidden border-white/70 bg-white shadow-soft">
                <div className="relative h-48">
                  <Image
                    src="/visuals/hero-classroom.svg"
                    alt="Tutor guiding a student"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                    Personal fit
                  </p>
                  <p className="text-lg font-semibold text-navy">
                    Tutoring that feels natural from the first lesson
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-white/70 bg-white shadow-soft sm:mt-10">
                <div className="relative h-48">
                  <Image
                    src="/visuals/subject-cs.svg"
                    alt="Student progress and planning"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                    Clear progress
                  </p>
                  <p className="text-lg font-semibold text-navy">
                    Families can see what is going well and what comes next
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="overflow-hidden border-navy-100 shadow-soft">
                <div className="relative h-44">
                  <Image src={feature.image} alt={feature.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                </div>
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
                    {feature.title}
                  </p>
                  <p className="text-sm leading-6 text-navy-500">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container-premium">
          <div className="rounded-full border border-navy-100 bg-navy-50 p-2">
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <button
                  key={subject}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    subject === "All"
                      ? "bg-navy text-white"
                      : "bg-white text-navy-600 hover:bg-navy-100"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <Card key={tutor.id} className="overflow-hidden border-navy-100 shadow-soft">
                <div className="relative aspect-[4/3]">
                  <Image src={tutor.image} alt={tutor.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                  <div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-sm font-bold shadow-md">
                    ★ {tutor.rating}
                  </div>
                </div>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-navy">{tutor.name}</h3>
                      <p className="text-coral font-medium">{tutor.subject}</p>
                    </div>
                    <p className="text-right">
                      <span className="text-2xl font-bold text-navy">£{tutor.price}</span>
                      <span className="text-sm text-navy-400">/hr</span>
                    </p>
                  </div>

                  <p className="text-sm leading-6 text-navy-500">{tutor.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {tutor.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="rounded-full bg-navy-50 text-navy-600"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-navy-400">
                    <span>{tutor.university}</span>
                    <span>•</span>
                    <span>{tutor.experience}</span>
                    <span>•</span>
                    <span>{tutor.reviews} reviews</span>
                  </div>

                  <Button asChild className="w-full rounded-full">
                    <Link href={`/tutors/${tutor.id}`}>View profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20">
        <div className="container-premium">
          <div className="grid items-center gap-8 rounded-[32px] border border-white/10 bg-white/5 px-8 py-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-coral-200">
                Join as a tutor
              </p>
              <h2 className="text-4xl font-bold text-white">
                Are you a tutor who brings clarity and care?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-navy-200">
                We&apos;re always looking for tutors who can make lessons feel
                calm, thoughtful, and effective.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full bg-white text-navy hover:bg-navy-50"
            >
              <Link href="/tutor-application">Apply to become a tutor</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

