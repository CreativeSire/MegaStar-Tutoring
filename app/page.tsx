"use client";

import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { useEffect, useRef, useState } from "react";

// Premium Unsplash Images - curated for warmth and trust
const IMAGES = {
  heroMain: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=85",
  tutorWithStudent: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
  studentLearning: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
  happyStudent: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
  parent: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  tutor: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
};

const subjects = [
  { name: "Mathematics", level: "KS2 to A-Level" },
  { name: "English", level: "KS2 to A-Level" },
  { name: "Science", level: "KS2 to GCSE" },
  { name: "11+ Prep", level: "Entrance Exams" },
  { name: "GCSE", level: "All Subjects" },
  { name: "A-Level", level: "All Subjects" },
];

const testimonials = [
  {
    quote: "My daughter's confidence has completely transformed. She went from dreading maths to actually enjoying it.",
    author: "Sarah M.",
    detail: "Parent of Year 10 student",
    image: IMAGES.parent,
  },
  {
    quote: "The tutor really understood how I learn. For the first time, physics actually makes sense.",
    author: "James K.",
    detail: "A-Level student",
    image: IMAGES.happyStudent,
  },
  {
    quote: "Having everything in one place—lessons, notes, progress—makes tutoring so much more effective.",
    author: "Dr. Chen",
    detail: "Chemistry tutor",
    image: IMAGES.tutor,
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Meet your tutor",
    description: "Book a free 30-minute session. We'll match you with someone who fits your learning style and goals.",
  },
  {
    step: "2",
    title: "Learn your way",
    description: "Your tutor creates a plan just for you. Ask questions, work through problems, and build confidence.",
  },
  {
    step: "3",
    title: "See the progress",
    description: "Track improvements over time. Parents get updates, and you see how far you've come.",
  },
];

const trustIndicators = [
  { value: "94%", label: "Students improve their grades" },
  { value: "500+", label: "Families trust us" },
  { value: "4.9", label: "Average rating" },
];

// Animated Counter
function AnimatedCounter({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const numericValue = parseInt(value.replace(/\D/g, ""));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = numericValue / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              setCount(numericValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericValue]);

  const suffix = value.includes("%") ? "%" : value.includes("+") ? "+" : "";
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  return (
    <div className="landing-page">
      <PublicHeader />
      
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-indicator"></span>
              Trusted by 500+ families across the UK
            </div>
            <h1 className="hero-title">
              Learning that finally
              <span className="highlight"> clicks</span>
            </h1>
            <p className="hero-lead">
              One-to-one online tutoring with carefully matched tutors. 
              Personalised lessons, real progress, and the confidence to succeed.
            </p>
            <div className="hero-actions">
              <Link href="/sign-up" className="btn btn-primary btn-large">
                Start with a free lesson
              </Link>
              <Link href="/sign-in" className="btn btn-ghost">
                Already have an account?
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                <img src={IMAGES.happyStudent} alt="Student" />
                <img src={IMAGES.parent} alt="Parent" />
                <img src={IMAGES.tutor} alt="Tutor" />
              </div>
              <p className="trust-text">
                <span className="stars">★★★★★</span>
                <span>4.9/5 from 200+ families</span>
              </p>
            </div>
          </div>
          <div className="hero-image">
            <img src={IMAGES.heroMain} alt="Student learning with tutor" />
          </div>
        </section>

        {/* Trust Bar */}
        <section className="trust-bar">
          {trustIndicators.map((item, i) => (
            <div key={i} className="trust-item">
              <span className="trust-value">
                <AnimatedCounter value={item.value} />
              </span>
              <span className="trust-label">{item.label}</span>
            </div>
          ))}
        </section>

        {/* Subjects Section */}
        <section className="subjects-section">
          <div className="section-header">
            <h2>Expert help in every subject</h2>
            <p>From primary school to A-Levels, our tutors cover it all.</p>
          </div>
          <div className="subjects-grid">
            {subjects.map((subject) => (
              <div key={subject.name} className="subject-item">
                <span className="subject-name">{subject.name}</span>
                <span className="subject-level">{subject.level}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="process-section">
          <div className="section-header">
            <h2>How it works</h2>
            <p>Getting started is simple. No long-term commitments, no hidden fees.</p>
          </div>
          <div className="process-steps">
            {howItWorks.map((step, i) => (
              <div key={i} className="process-card">
                <span className="process-number">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="section-header">
            <h2>What families say</h2>
            <p>Real stories from students, parents, and tutors.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="quote-mark">"</div>
                <p className="quote-text">{t.quote}</p>
                <div className="quote-author">
                  <img src={t.image} alt={t.author} />
                  <div>
                    <strong>{t.author}</strong>
                    <span>{t.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to see the difference?</h2>
            <p>Your first lesson is free. No commitment, no credit card required.</p>
            <Link href="/sign-up" className="btn btn-white btn-large">
              Book your free lesson
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="brand-lockup">
                <div className="brand-mark">M</div>
                <div>
                  <div className="brand-name">MegaStar Tutoring</div>
                </div>
              </div>
              <p>Personalised online tutoring that helps students thrive.</p>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>For Students</h4>
                <Link href="/sign-up">Find a tutor</Link>
                <Link href="/sign-in">Student login</Link>
              </div>
              <div className="link-group">
                <h4>For Tutors</h4>
                <Link href="/sign-up">Join as a tutor</Link>
                <Link href="/sign-in">Tutor login</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 MegaStar Tutoring. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
