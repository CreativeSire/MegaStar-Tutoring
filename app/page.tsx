"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const IMAGES = {
  heroMain: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=90",
  student1: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=85",
  student2: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&q=85",
  tutor1: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=85",
  tutor2: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
};

const subjects = [
  { name: "Mathematics", icon: "∑", students: "240+ students", color: "#4f46e5", gradient: "from-indigo-500 to-purple-600" },
  { name: "English", icon: "✦", students: "180+ students", color: "#10b981", gradient: "from-emerald-500 to-teal-600" },
  { name: "Science", icon: "◈", students: "200+ students", color: "#8b5cf6", gradient: "from-violet-500 to-purple-600" },
  { name: "11+ Prep", icon: "◆", students: "150+ students", color: "#f59e0b", gradient: "from-amber-500 to-orange-600" },
  { name: "GCSE", icon: "◇", students: "320+ students", color: "#ef4444", gradient: "from-red-500 to-rose-600" },
  { name: "A-Level", icon: "✹", students: "190+ students", color: "#06b6d4", gradient: "from-cyan-500 to-blue-600" },
];

const testimonials = [
  {
    quote: "My daughter went from a C to an A*. The personalised approach made all the difference.",
    author: "Sarah Mitchell",
    role: "Parent of Year 11",
    image: IMAGES.student1,
    subject: "Mathematics",
    improvement: "2 grades up",
  },
  {
    quote: "Finally, a tutor who understands how I learn. Physics actually makes sense now.",
    author: "James Kim",
    role: "A-Level Student",
    image: IMAGES.student2,
    subject: "Physics",
    improvement: "Confidence +",
  },
];

const steps = [
  { num: "01", title: "Meet your tutor", desc: "Free 30-min session to find your perfect match", icon: "🤝", color: "bg-indigo-500" },
  { num: "02", title: "Learn your way", desc: "Personalised lessons that adapt to your pace", icon: "🎯", color: "bg-emerald-500" },
  { num: "03", title: "See progress", desc: "Track improvements with clear milestone updates", icon: "📈", color: "bg-amber-500" },
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`mega-landing ${isDark ? 'dark' : ''}`}>
      {/* Navigation */}
      <nav className={`mega-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="logo-mark">
              <span>M</span>
            </div>
            <span className="logo-text">MegaStar</span>
          </Link>
          <div className="nav-right">
            <button 
              onClick={() => setIsDark(!isDark)} 
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <Link href="/sign-in" className="nav-link">Sign in</Link>
            <Link href="/sign-up" className="nav-cta">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mega-hero">
        <div className="hero-bg">
          <div className="gradient-blob blob-1"></div>
          <div className="gradient-blob blob-2"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Trusted by 500+ families
          </div>
          
          <h1 className="hero-title">
            <span className="title-word">Learning</span>
            <span className="title-word accent">that clicks</span>
          </h1>
          
          <p className="hero-lead">
            One-to-one tutoring with carefully matched experts. 
            Personalised lessons that build confidence and deliver results.
          </p>
          
          <div className="hero-actions">
            <Link href="/sign-up" className="btn-primary">
              Start free lesson
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="hero-trust">
            <div className="avatar-group">
              <img src={IMAGES.student1} alt="Student" />
              <img src={IMAGES.tutor1} alt="Tutor" />
              <img src={IMAGES.student2} alt="Student" />
              <div className="avatar-more">+</div>
            </div>
            <div className="trust-info">
              <div className="stars">★★★★★ <span>4.9/5</span></div>
              <span className="trust-text">from 200+ reviews</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="main-image">
            <img src={IMAGES.heroMain} alt="Student learning" />
            <div className="image-overlay"></div>
          </div>
          
          <div className="float-card stats-float">
            <div className="float-icon">📊</div>
            <div>
              <span className="float-value">+2 grades</span>
              <span className="float-label">avg. improvement</span>
            </div>
          </div>
          
          <div className="float-card tutor-float">
            <div className="live-indicator">
              <span className="live-dot"></span>
              Live now
            </div>
            <div className="tutor-info">
              <img src={IMAGES.tutor1} alt="Tutor" />
              <div>
                <strong>Dr. Sarah M.</strong>
                <span>Mathematics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar - HORIZONTAL */}
      <section className="stats-section">
        <div className="stats-scroll">
          <div className="stat-box">
            <span className="stat-num gradient-text"><AnimatedCounter value={94} suffix="%" /></span>
            <span className="stat-label">Improve grades</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-num gradient-text"><AnimatedCounter value={500} suffix="+" /></span>
            <span className="stat-label">Happy families</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-box">
            <span className="stat-num gradient-text"><AnimatedCounter value={4} suffix=".9" /></span>
            <span className="stat-label">Average rating</span>
          </div>
        </div>
      </section>

      {/* Subjects - HORIZONTAL SCROLL ON MOBILE */}
      <section className="subjects-section">
        <div className="section-header">
          <span className="eyebrow">What we teach</span>
          <h2>Expert support in every subject</h2>
          <p>From primary school to A-Levels, we&apos;ve got you covered.</p>
        </div>
        
        <div className="subjects-scroll-container">
          <div className="subjects-track">
            {subjects.map((subject, i) => (
              <div key={subject.name} className="subject-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`subject-icon ${subject.gradient}`}>
                  <span>{subject.icon}</span>
                </div>
                <h3>{subject.name}</h3>
                <span className="subject-meta">{subject.students}</span>
              </div>
            ))}
          </div>
          <div className="scroll-hint">
            <span>← Swipe to explore →</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="process-section">
        <div className="section-header">
          <span className="eyebrow">How it works</span>
          <h2>Three steps to success</h2>
        </div>
        
        <div className="process-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className={`step-icon ${step.color}`}>{step.icon}</div>
              <span className="step-num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="eyebrow">Success stories</span>
          <h2>Real results from real students</h2>
        </div>
        
        <div className="testimonials-scroll">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testi-image">
                <img src={t.image} alt={t.author} />
                <span className="improve-badge">{t.improvement}</span>
              </div>
              <div className="testi-content">
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="testi-author">
                  <strong>{t.author}</strong>
                  <span>{t.role} • {t.subject}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-blob"></div>
        </div>
        <div className="cta-content">
          <h2>Ready to see the difference?</h2>
          <p>Your first lesson is completely free.</p>
          <Link href="/sign-up" className="btn-white">
            Book free lesson
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mega-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="logo-mark small">
              <span>M</span>
            </div>
            <span>MegaStar Tutoring</span>
          </div>
          <div className="footer-links">
            <Link href="/sign-up">Get started</Link>
            <Link href="/sign-in">Sign in</Link>
          </div>
        </div>
        <p className="copyright">© 2025 MegaStar Tutoring</p>
      </footer>
    </div>
  );
}
