import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Target, 
  Heart, 
  Users, 
  Award, 
  BookOpen, 
  TrendingUp,
  CheckCircle2
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about MegaStar Tutoring's mission to help every student achieve their full potential through personalised 1-to-1 online tutoring.",
};

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description: "We measure success by the grades our students achieve. 94% improve by 2+ grades within 3 months.",
  },
  {
    icon: Heart,
    title: "Student-First",
    description: "Every decision we make puts the student's learning journey and wellbeing at the centre.",
  },
  {
    icon: Users,
    title: "Personalised Learning",
    description: "No two students are the same. We match learning styles with teaching approaches for optimal results.",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Only 5% of tutor applicants make it through our rigorous 5-step screening process.",
  },
];

const stats = [
  { value: "2,500+", label: "Students helped" },
  { value: "50+", label: "Expert tutors" },
  { value: "30+", label: "Subjects covered" },
  { value: "94%", label: "Success rate" },
];

const differentiators = [
  "AI-powered tutor matching based on learning style",
  "Personalised study plans updated weekly",
  "Progress tracking with parent dashboards",
  "HD video lessons with interactive whiteboards",
  "Session recordings for revision",
  "24/7 support from our education team",
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-50 pt-32 pb-20">
        <div className="container-premium">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mb-6">About Us</span>
            <h1 className="text-display-2 mb-6 text-navy">
              Helping every student unlock their{" "}
              <span className="gradient-text">full potential</span>
            </h1>
            <p className="text-body-large mx-auto max-w-2xl text-navy-500">
              Founded in 2023, MegaStar Tutoring was born from a simple belief: 
              every student deserves access to world-class education that adapts 
              to how they learn best.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=90"
                  alt="Students learning together"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 rounded-2xl bg-coral p-8 text-white shadow-strong">
                <p className="text-5xl font-bold">94%</p>
                <p className="text-coral-100">Success Rate</p>
              </div>
            </div>
            
            <div>
              <span className="eyebrow mb-4">Our Mission</span>
              <h2 className="text-heading-1 mb-6 text-navy">
                Education that adapts to the student, not the other way around
              </h2>
              <p className="mb-6 text-navy-500">
                Traditional classrooms often fail to address individual learning needs. 
                We built MegaStar to change that. Our platform uses AI to match students 
                with tutors who understand their unique learning style, creating a 
                personalised pathway to academic success.
              </p>
              <p className="mb-8 text-navy-500">
                Every lesson is tailored, every session is tracked, and every student 
                is supported on their journey to achieving their goals.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link href="/sign-up">Start your journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-navy py-20 text-white">
        <div className="container-premium">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="mb-2 text-5xl font-bold text-coral">{stat.value}</p>
                <p className="text-navy-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="eyebrow mb-4">Our Values</span>
            <h2 className="text-heading-1 text-navy">What drives us every day</h2>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-0 bg-navy-50/50 text-center">
                <CardContent className="pt-8">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-coral-50 text-coral">
                    <value.icon size={32} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-navy">{value.title}</h3>
                  <p className="text-navy-500">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators Section */}
      <section className="section-padding bg-coral-50">
        <div className="container-premium">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="eyebrow mb-4">Why Choose Us</span>
              <h2 className="text-heading-1 mb-6 text-navy">
                The MegaStar difference
              </h2>
              <p className="mb-8 text-navy-500">
                We&apos;re not just another tutoring platform. We&apos;ve built every feature 
                with one goal in mind: helping students achieve their best possible grades.
              </p>
              <ul className="space-y-4">
                {differentiators.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-coral" />
                    <span className="text-navy-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid gap-6">
              <Card className="border-coral-100">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-coral-50 text-coral">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">30+ Subjects</p>
                    <p className="text-navy-500">From Maths to Languages</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-coral-100">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-coral-50 text-coral">
                    <Users size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">1-to-1 Learning</p>
                    <p className="text-navy-500">Personalised attention</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-coral-100">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-coral-50 text-coral">
                    <TrendingUp size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">Proven Results</p>
                    <p className="text-navy-500">Track progress weekly</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-premium">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="eyebrow mb-4">Our Team</span>
            <h2 className="text-heading-1 text-navy">Meet the educators behind MegaStar</h2>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Dr. Sarah Mitchell",
                role: "Head of Education",
                bio: "Former Cambridge lecturer with 15 years of teaching experience",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85",
              },
              {
                name: "James Chen",
                role: "Lead Tutor - Sciences",
                bio: "Imperial College graduate, specialising in Physics and Chemistry",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
              },
              {
                name: "Emma Williams",
                role: "Lead Tutor - Humanities",
                bio: "Oxford graduate with a passion for English Literature",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=85",
              },
            ].map((person) => (
              <Card key={person.name} className="overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-navy">{person.name}</h3>
                  <p className="mb-2 text-coral font-medium">{person.role}</p>
                  <p className="text-sm text-navy-500">{person.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-coral py-20">
        <div className="container-premium text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to start your success story?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-coral-50">
            Join thousands of students who have transformed their grades with MegaStar Tutoring.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="rounded-full bg-white text-coral hover:bg-coral-50">
              <Link href="/sign-up">Start free trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-2 border-white text-white hover:bg-white/10">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
