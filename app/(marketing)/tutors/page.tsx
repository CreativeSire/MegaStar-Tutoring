import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Award, Clock, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Tutors",
  description: "Meet our expert tutors. Top 5% of applicants, rigorously vetted, passionate about helping students succeed.",
};

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Languages"];

const tutors = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    subject: "Mathematics",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85",
    rating: 5.0,
    reviews: 127,
    university: "Cambridge",
    experience: "8 years",
    specialties: ["GCSE", "A-Level", "Further Maths"],
    bio: "Former Cambridge lecturer with a passion for making complex concepts simple.",
    price: 45,
  },
  {
    id: "2",
    name: "James Chen",
    subject: "Physics",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
    rating: 4.9,
    reviews: 94,
    university: "Imperial",
    experience: "6 years",
    specialties: ["A-Level", "IB", "Oxbridge Prep"],
    bio: "Imperial College graduate specialising in making physics accessible and engaging.",
    price: 42,
  },
  {
    id: "3",
    name: "Emma Williams",
    subject: "English",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=85",
    rating: 5.0,
    reviews: 156,
    university: "Oxford",
    experience: "10 years",
    specialties: ["11+", "GCSE", "A-Level", "Creative Writing"],
    bio: "Oxford graduate with a love for literature and helping students find their voice.",
    price: 40,
  },
  {
    id: "4",
    name: "Dr. Michael Brown",
    subject: "Chemistry",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=85",
    rating: 4.9,
    reviews: 112,
    university: "UCL",
    experience: "7 years",
    specialties: ["GCSE", "A-Level", "Organic Chemistry"],
    bio: "PhD in Chemistry with industry experience. Expert in exam techniques.",
    price: 43,
  },
  {
    id: "5",
    name: "Lisa Park",
    subject: "Biology",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=85",
    rating: 4.8,
    reviews: 89,
    university: "Kings College",
    experience: "5 years",
    specialties: ["GCSE", "A-Level", "Human Biology"],
    bio: "Medical student turned tutor with a knack for explaining complex biological processes.",
    price: 38,
  },
  {
    id: "6",
    name: "David Thompson",
    subject: "History",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=85",
    rating: 4.9,
    reviews: 76,
    university: "LSE",
    experience: "9 years",
    specialties: ["GCSE", "A-Level", "Modern History"],
    bio: "History enthusiast who brings the past to life through engaging storytelling.",
    price: 40,
  },
];

const features = [
  { icon: CheckCircle2, text: "Top 5% of applicants accepted" },
  { icon: Award, text: "All tutors DBS checked" },
  { icon: Clock, text: "Average 5+ years experience" },
  { icon: BookOpen, text: "30+ subjects available" },
];

export default function TutorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-50 pt-32 pb-16">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mb-6">Expert Tutors</span>
            <h1 className="text-display-2 mb-6 text-navy">
              Learn from the{" "}
              <span className="gradient-text">best</span>
            </h1>
            <p className="text-body-large mx-auto max-w-2xl text-navy-500">
              Our tutors are in the top 5% of applicants. They&apos;re not just subject experts — 
              they&apos;re skilled educators who are passionate about helping students succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-navy-100 bg-white py-12">
        <div className="container-premium">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral-50 text-coral">
                  <feature.icon size={20} />
                </div>
                <span className="font-semibold text-navy-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Filter */}
      <section className="bg-white py-8">
        <div className="container-premium">
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  subject === "All"
                    ? "bg-navy text-white"
                    : "bg-navy-50 text-navy-600 hover:bg-navy-100"
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tutors Grid */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <Card key={tutor.id} className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={tutor.image}
                    alt={tutor.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-bold shadow-md">
                    <Star size={14} className="fill-coral text-coral" />
                    {tutor.rating}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-navy">{tutor.name}</h3>
                      <p className="text-coral font-medium">{tutor.subject}</p>
                    </div>
                    <p className="text-right">
                      <span className="text-2xl font-bold text-navy">£{tutor.price}</span>
                      <span className="text-sm text-navy-400">/hr</span>
                    </p>
                  </div>

                  <p className="mb-4 text-sm text-navy-500">{tutor.bio}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {tutor.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="bg-navy-50 text-navy-600">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-6 flex items-center gap-4 text-sm text-navy-400">
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

      {/* Become a Tutor CTA */}
      <section className="bg-coral py-20">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold text-white">
              Are you an exceptional tutor?
            </h2>
            <p className="mb-8 text-xl text-coral-50">
              Join our community of top educators. We&apos;re always looking for passionate tutors 
              who can make a real difference in students&apos; lives.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-full bg-white text-coral hover:bg-coral-50">
              <Link href="/tutor-application">Apply to become a tutor</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
