"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Premium imagery
const IMAGES = {
  heroMain: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=90",
  student1: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=85",
  student2: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&q=85",
  tutor1: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=85",
  tutor2: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
  session: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=85",
  study: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=85",
};

const subjects = [
  { name: "Mathematics", icon: "∑", color: "#6366f1" },
  { name: "English", icon: "✦", color: "#10b981" },
  { name: "Science", icon: "◈", color: "#8b5cf6" },
  { name: "11+ Prep", icon: "◆", color: "#f59e0b" },
  { name: "GCSE", icon: "◇", color: "#ef4444" },
  { name: "A-Level", icon: "✹", color: "#06b6d4" },
];

const testimonials = [
  {
    quote: "My daughter went from a C to an A*. The personalised approach made all the difference.",
    author: "Sarah Mitchell",
    role: "Parent",
    image: IMAGES.student1,
    subject: "Mathematics",
    result: "Grade improved",
  },
  {
    quote: "Finally, a tutor who understands how I learn. Physics actually makes sense now.",
    author: "James Kim",
    role: "A-Level Student",
    image: IMAGES.student2,
    subject: "Physics",
    result: "Confidence boost",
  },
];

const features = [
  {
    title: "Matched to you",
    desc: "We pair you with tutors who fit your learning style, not just your subject.",
    icon: "🎯",
  },
  {
    title: "Learn your way",
    desc: "Lessons adapt to your pace. Ask questions, dive deep, build understanding.",
    icon: "🌱",
  },
  {
    title: "Track progress",
    desc: "See how far you've come with clear insights and milestone celebrations.",
    icon: "📈",
  },
];

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
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
  }, [value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mega-landing">
      {/* Navigation */}
      <nav className={`mega-nav ${isScrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="logo-mark">
              <span>M</span>
            </div>
            <span className="logo-text">MegaStar</span>
          </Link>
          <div className="nav-links">
            <Link href="/sign-in" className="nav-link">Sign in</Link>
            <Link href="/sign-up" className="nav-cta">Start free</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mega-hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            500+ families trust us
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Learning that</span>
            <span className="title-line highlight">finally clicks</span>
          </h1>
          
          <p className="hero-lead">
            One-to-one tutoring with carefully matched experts. 
            Personalised lessons that build confidence and deliver results.
          </p>
          
          <div className="hero-actions">
            <Link href="/sign-up" className="btn-mega btn-primary">
              <span>Start with a free lesson</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="hero-social">
            <div className="avatar-stack">
              <img src={IMAGES.student1} alt="Student" />
              <img src={IMAGES.tutor1} alt="Tutor" />
              <img src={IMAGES.student2} alt="Student" />
              <img src={IMAGES.tutor2} alt="Tutor" />
            </div>
            <div className="social-text">
              <div className="stars">★★★★★</div>
              <span>Trusted by students & parents</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card main-image">
            <img src={IMAGES.heroMain} alt="Student learning" />
            <div className="image-glow"></div>
          </div>
          
          <div className="floating-card card-stats">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <span className="stat-value">+2 grades</span>
              <span className="stat-label">Average improvement</span>
            </div>
          </div>
          
          <div className="floating-card card-session">
            <div className="session-live">
              <span className="live-pulse"></span>
              Live session
            </div>
            <div className="session-tutor">
              <img src={IMAGES.tutor1} alt="Tutor" />
              <div>
                <strong>Dr. Sarah M.</strong>
                <span>Mathematics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="mega-stats">
        <div className="stat-item">
          <span className="stat-number"><AnimatedCounter value={94} suffix="%" /></span>
          <span className="stat-desc">Improve their grades</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number"><AnimatedCounter value={500} suffix="+" /></span>
          <span className="stat-desc">Happy families</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number"><AnimatedCounter value={4} suffix=".9" /></span>
          <span className="stat-desc">Average rating</span>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="mega-subjects">
        <div className="section-header">
          <span className="section-eyebrow">What we teach</span>
          <h2>Expert support in every subject</h2>
        </div>
        
        <div className="subjects-grid">
          {subjects.map((subject, i) => (
            <div key={subject.name} className="subject-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="subject-icon" style={{ background: `${subject.color}15`, color: subject.color }}>
                {subject.icon}
              </div>
              <h3>{subject.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mega-process">
        <div className="process-container">
          <div className="section-header light">
            <span className="section-eyebrow">How it works</span>
            <h2>Three steps to better grades</h2>
          </div>
          
          <div className="process-steps">
            {features.map((feature, i) => (
              <div key={i} className="process-card">
                <div className="card-number">0{i + 1}</div>
                <div className="card-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mega-testimonials">
        <div className="section-header">
          <span className="section-eyebrow">Success stories</span>
          <h2>Real results from real students</h2>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="card-image">
                <img src={t.image} alt={t.author} />
                <div className="result-badge">{t.result}</div>
              </div>
              <div className="card-content">
                <blockquote>"{t.quote}"</blockquote>
                <div className="card-author">
                  <strong>{t.author}</strong>
                  <span>{t.role} • {t.subject}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mega-cta">
        <div className="cta-background">
          <div className="gradient-orb orb-large"></div>
        </div>
        <div className="cta-content">
          <h2>Ready to see the difference?</h2>
          <p>Your first lesson is completely free. No commitment required.</p>
          <Link href="/sign-up" className="btn-mega btn-white">
            <span>Book your free lesson</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mega-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-mark">
              <span>M</span>
            </div>
            <p>MegaStar Tutoring</p>
          </div>
          <div className="footer-links">
            <Link href="/sign-up">Get started</Link>
            <Link href="/sign-in">Sign in</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MegaStar Tutoring</p>
        </div>
      </footer>
    </div>
  );
}
