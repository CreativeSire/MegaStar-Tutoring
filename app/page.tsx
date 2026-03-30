"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Premium curated imagery
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=90",
  studentThinking: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=85",
  studentWriting: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=85",
  studentLaptop: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85",
  mathTutor: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=85",
  englishTutor: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&q=85",
  scienceTutor: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=85",
  parent: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=85",
  studentSuccess: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=85",
  tutor: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=85",
};

const subjects = [
  { name: "Mathematics", students: "240+ students", image: IMAGES.mathTutor },
  { name: "English", students: "180+ students", image: IMAGES.englishTutor },
  { name: "Science", students: "200+ students", image: IMAGES.scienceTutor },
];

const steps = [
  { 
    num: "01", 
    title: "Meet your tutor", 
    desc: "Book a free session to find your perfect match",
    image: IMAGES.studentThinking
  },
  { 
    num: "02", 
    title: "Learn your way", 
    desc: "Personalised lessons that adapt to your pace",
    image: IMAGES.studentWriting
  },
  { 
    num: "03", 
    title: "See results", 
    desc: "Track improvements with milestone celebrations",
    image: IMAGES.studentLaptop
  },
];

const testimonials = [
  {
    quote: "My daughter went from a C to an A*. The personalised approach made all the difference.",
    author: "Sarah Mitchell",
    role: "Parent of Year 11",
    image: IMAGES.parent,
    subject: "Mathematics",
  },
  {
    quote: "Finally, a tutor who understands how I learn. Physics actually makes sense now.",
    author: "James Kim",
    role: "A-Level Student",
    image: IMAGES.studentSuccess,
    subject: "Physics",
  },
  {
    quote: "The platform makes it so easy to focus on teaching. Everything just works.",
    author: "Dr. Michael Chen",
    role: "Science Tutor",
    image: IMAGES.tutor,
    subject: "Chemistry",
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 20,
      y: (e.clientY - rect.top - rect.height / 2) / 20,
    });
  };

  return (
    <div className="mega-landing">
      {/* Navigation */}
      <nav className={`mega-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="logo-mark">
              <span>M</span>
            </div>
            <span className="logo-text">MegaStar</span>
          </Link>
          <div className="nav-links">
            <Link href="/sign-in" className="nav-link">Sign in</Link>
            <Link href="/sign-up" className="nav-cta">Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mega-hero">
        <div className="hero-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Trusted by 500+ families across the UK
          </div>
          
          <h1 className="hero-title">
            Learning that
            <span className="gradient-text"> finally clicks</span>
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
              <img src={IMAGES.parent} alt="Parent" />
              <img src={IMAGES.studentSuccess} alt="Student" />
              <img src={IMAGES.tutor} alt="Tutor" />
              <div className="avatar-more">+</div>
            </div>
            <div className="trust-info">
              <div className="stars">★★★★★</div>
              <span>4.9/5 from 200+ reviews</span>
            </div>
          </div>
        </div>

        <div 
          className="hero-visual"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        >
          <div 
            className="main-image-3d"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
            }}
          >
            <img src={IMAGES.hero} alt="Student learning" />
            <div className="image-shine"></div>
          </div>
          
          <div className="floating-pill pill-stats" style={{ animationDelay: "0s" }}>
            <div className="pill-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 6l-9.5 9.5-5-5L1 18" />
              </svg>
            </div>
            <div>
              <span className="pill-value">+2 grades</span>
              <span className="pill-label">avg. improvement</span>
            </div>
          </div>
          
          <div className="floating-pill pill-live" style={{ animationDelay: "1s" }}>
            <div className="live-badge">
              <span className="live-pulse"></span>
              Live session
            </div>
            <div className="tutor-mini">
              <img src={IMAGES.tutor} alt="Tutor" />
              <div>
                <strong>Dr. Sarah M.</strong>
                <span>Mathematics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-num gradient-text"><AnimatedCounter value={94} suffix="%" /></span>
            <span className="stat-label">Improve their grades</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num gradient-text"><AnimatedCounter value={500} suffix="+" /></span>
            <span className="stat-label">Happy families</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num gradient-text"><AnimatedCounter value={4} suffix=".9" /></span>
            <span className="stat-label">Average rating</span>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="subjects-section">
        <div className="section-header">
          <span className="eyebrow">Expert tutors</span>
          <h2>Support in every subject</h2>
          <p>From primary to A-Level, we've got you covered.</p>
        </div>
        
        <div className="subjects-grid">
          {subjects.map((subject, i) => (
            <div 
              key={subject.name} 
              className="subject-card-3d"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="card-image-wrapper">
                <img src={subject.image} alt={subject.name} />
                <div className="card-overlay"></div>
              </div>
              <div className="card-content">
                <h3>{subject.name}</h3>
                <p>{subject.students}</p>
                <span className="card-arrow">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="process-section">
        <div className="section-header light">
          <span className="eyebrow">Simple process</span>
          <h2>Three steps to better grades</h2>
        </div>
        
        <div className="process-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card-3d" style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="step-image-wrapper">
                <img src={step.image} alt={step.title} />
                <div className="step-number-badge">{step.num}</div>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
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
        
        <div className="testimonials-carousel">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card-3d">
              <div className="testi-header">
                <img src={t.image} alt={t.author} />
                <div className="testi-meta">
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
              <blockquote>"{t.quote}"</blockquote>
              <div className="testi-footer">
                <span className="subject-tag">{t.subject}</span>
                <span className="stars">★★★★★</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to transform your grades?</h2>
          <p>Your first lesson is completely free. No commitment required.</p>
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
        <p className="copyright">© 2025 MegaStar Tutoring. All rights reserved.</p>
      </footer>
    </div>
  );
}
