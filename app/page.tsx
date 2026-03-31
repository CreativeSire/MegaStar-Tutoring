"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Types for API data
interface Stats {
  sessionsCompleted: number;
  activeStudents: number;
  averageRating: number;
  expertTutors: number;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  result: string;
  subject: string;
  rating: number;
  image: string;
}

interface Activity {
  user: string;
  action: string;
  subject: string;
  time: string;
}

const IMAGES = {
  heroMain: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=90",
  tutor1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=85",
  tutor2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85",
  tutor3: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
  success: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=85",
};

const subjects = [
  { name: "Mathematics", icon: "∑", students: 1240, color: "#6366f1", bg: "#e0e7ff" },
  { name: "English", icon: "Aa", students: 980, color: "#8b5cf6", bg: "#ede9fe" },
  { name: "Physics", icon: "⚛", students: 756, color: "#06b6d4", bg: "#cffafe" },
  { name: "Chemistry", icon: "🧪", students: 642, color: "#10b981", bg: "#d1fae5" },
  { name: "Biology", icon: "🧬", students: 589, color: "#84cc16", bg: "#ecfccb" },
  { name: "History", icon: "⚔", students: 423, color: "#f59e0b", bg: "#fef3c7" },
  { name: "Geography", icon: "🌍", students: 387, color: "#3b82f6", bg: "#dbeafe" },
  { name: "French", icon: "🇫🇷", students: 298, color: "#ef4444", bg: "#fee2e2" },
  { name: "Spanish", icon: "🇪🇸", students: 267, color: "#f97316", bg: "#ffedd5" },
  { name: "Computer Science", icon: "</>", students: 534, color: "#14b8a6", bg: "#ccfbf1" },
  { name: "Economics", icon: "📈", students: 312, color: "#6366f1", bg: "#e0e7ff" },
  { name: "Psychology", icon: "🧠", students: 245, color: "#ec4899", bg: "#fce7f3" },
];

const features = [
  {
    title: "AI-Powered Matching",
    desc: "Our matching engine studies the way you learn and pairs you with a tutor who fits naturally.",
    stat: "98% match satisfaction",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&q=90",
    badge: "Smart match",
    points: ["Learns your pace", "Balances subject + style"],
    inset: {
      title: "Matched in seconds",
      note: "A calm start with the right tutor",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=90",
    },
  },
  {
    title: "Interactive Classroom",
    desc: "Lessons feel like a real room, with live conversation, shared notes, and visual support.",
    stat: "Live and collaborative",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=90",
    badge: "Live lesson",
    points: ["Shared whiteboard", "Screen share ready"],
    inset: {
      title: "Feels like a real room",
      note: "Simple, natural, and easy to follow",
      image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=600&q=90",
    },
  },
  {
    title: "Progress Tracking",
    desc: "Your progress stays visible, with updates that show what’s improving and what comes next.",
    stat: "Weekly reports",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=90",
    badge: "Clear progress",
    points: ["Simple milestones", "Easy to review"],
    inset: {
      title: "Progress at a glance",
      note: "See what is moving forward",
      image: "https://images.unsplash.com/photo-1553484771-0a7b0f8b1f3f?w=600&q=90",
    },
  },
  {
    title: "Safe & Secure",
    desc: "Every lesson stays private and protected with tutor checks, safe account access, and clear controls.",
    stat: "Fully protected",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=90",
    badge: "Protected space",
    points: ["Trusted tutors", "Privacy first"],
    inset: {
      title: "Quiet confidence",
      note: "Private, secure, and built with care",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&q=90",
    },
  },
];

const tutors = [
  { name: "Dr. Sarah Mitchell", subject: "Mathematics", rating: 4.9, students: 127, image: IMAGES.tutor1, uni: "Cambridge", exp: "8 years" },
  { name: "James Chen", subject: "Physics", rating: 4.8, students: 94, image: IMAGES.tutor3, uni: "Imperial", exp: "6 years" },
  { name: "Emma Williams", subject: "English", rating: 5.0, students: 156, image: IMAGES.tutor2, uni: "Oxford", exp: "10 years" },
];

const steps = [
  { num: "01", title: "Assessment", desc: "Take our diagnostic test to identify your strengths and learning gaps." },
  { num: "02", title: "Matching", desc: "Our AI matches you with the perfect tutor based on your profile." },
  { num: "03", title: "Learning", desc: "Start personalised lessons with regular progress tracking." },
  { num: "04", title: "Success", desc: "Achieve your goals with guaranteed grade improvement." },
];

const faqs = [
  { q: "How does the free trial work?", a: "Start with 2 completely free sessions. No credit card required. Experience our platform risk-free." },
  { q: "Can I change my tutor?", a: "Absolutely. If you're not 100% satisfied, we'll match you with a new tutor instantly at no cost." },
  { q: "What subjects do you cover?", a: "We offer 30+ subjects from Primary to A-Level: Maths, Sciences, Languages, Humanities, and more." },
  { q: "How are tutors selected?", a: "Only 5% pass our rigorous screening: qualification check, teaching demo, DBS check, and training." },
];

// Fallback testimonials
const fallbackTestimonials: Testimonial[] = [
  { id: "1", name: "Emma Richardson", role: "Parent", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=85", quote: "My daughter's confidence has completely transformed. She went from dreading math to actually enjoying it.", result: "Grade C → A*", subject: "Mathematics", rating: 5 },
  { id: "2", name: "James Chen", role: "A-Level Student", image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=85", quote: "The personalised approach made all the difference. My tutor actually understood how I learn best.", result: "Grade D → B", subject: "Physics", rating: 5 },
  { id: "3", name: "Sarah Mitchell", role: "Parent", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85", quote: "Best investment we've made. Both our children have improved dramatically. Worth every penny.", result: "Two grades up", subject: "English & Science", rating: 5 },
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
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Real data from APIs
  const [stats, setStats] = useState<Stats>({
    sessionsCompleted: 2547,
    activeStudents: 1893,
    averageRating: 4.9,
    expertTutors: 52,
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [activity, setActivity] = useState<Activity[]>([
    { user: "Alex M.", action: "booked a session", subject: "Mathematics", time: "2 min ago" },
    { user: "Sophie L.", action: "completed a lesson", subject: "Physics", time: "5 min ago" },
    { user: "Daniel K.", action: "improved grade to A", subject: "Chemistry", time: "12 min ago" },
    { user: "Emma R.", action: "joined MegaStar", subject: "English", time: "18 min ago" },
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [statsRes, testimonialsRes, activityRes] = await Promise.all([
          fetch("/api/public/stats").catch(() => null),
          fetch("/api/public/testimonials").catch(() => null),
          fetch("/api/public/activity").catch(() => null),
        ]);

        if (statsRes?.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (testimonialsRes?.ok) {
          const testimonialsData = await testimonialsRes.json();
          if (testimonialsData.testimonials?.length > 0) {
            setTestimonials(testimonialsData.testimonials);
          }
        }

        if (activityRes?.ok) {
          const activityData = await activityRes.json();
          if (activityData.activity?.length > 0) {
            setActivity(activityData.activity);
          }
        }
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh activity every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="mega-landing">
      {/* Navigation */}
      <nav className={`mega-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="logo-mark"><span>M</span></div>
            <span className="logo-text">MegaStar</span>
          </Link>
          <div className="nav-links">
            <Link href="#subjects" className="nav-link">Subjects</Link>
            <Link href="#how-it-works" className="nav-link">How it Works</Link>
            <Link href="#tutors" className="nav-link">Tutors</Link>
            <Link href="#pricing" className="nav-link">Pricing</Link>
            <Link href="/sign-in" className="nav-link">Sign in</Link>
            <Link href="/sign-up" className="nav-cta">
              <span>Start free trial</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot"></span>
            <span>{loading ? "Loading..." : `${stats.activeStudents.toLocaleString()} students learning now`}</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Unlock your</span>
            <span className="title-line accent">full potential</span>
          </h1>
          
          <p className="hero-subtitle">
            1-to-1 online tutoring that actually works. 
            <strong> 94% of students improve by 2+ grades</strong> within 3 months.
          </p>
          
          <div className="hero-ctas">
            <Link href="/sign-up" className="btn-primary">
              <span>Start 2 free lessons</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button className="btn-secondary">
              <span className="play-btn">▶</span>
              <span>Watch demo</span>
            </button>
          </div>

          <div className="hero-social-proof">
            <div className="avatar-stack">
              <img src={testimonials[0]?.image || IMAGES.tutor1} alt="User" className="avatar" />
              <img src={testimonials[1]?.image || IMAGES.tutor2} alt="User" className="avatar" />
              <img src={testimonials[2]?.image || IMAGES.tutor3} alt="User" className="avatar" />
              <div className="avatar-more">+{Math.max(0, stats.activeStudents - 3)}</div>
            </div>
            <div className="rating-block">
              <div className="stars">★★★★★</div>
              <span>{stats.averageRating}/5 from {stats.sessionsCompleted.toLocaleString()}+ reviews</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img src={IMAGES.heroMain} alt="Student learning" className="hero-image" />
          </div>
          
          <div className="float-card card-improvement">
            <div className="card-icon green">📈</div>
            <div>
              <span className="card-value">+2 grades</span>
              <span className="card-label">avg. improvement</span>
            </div>
          </div>
          
          <div className="float-card card-session">
            <div className="session-header">
              <span className="live-indicator"></span>
              <span>Live now</span>
            </div>
            <div className="session-tutor">
              <img src={IMAGES.tutor1} alt="Tutor" />
              <div>
                <strong>Dr. Sarah M.</strong>
                <span>Mathematics • GCSE</span>
              </div>
            </div>
          </div>

          <div className="float-card card-activity">
            <div className="activity-list">
              {activity.slice(0, 3).map((act, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-dot"></span>
                  <span><strong>{act.user}</strong> {act.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip - REAL DATA */}
      <section className="stats-strip">
        <div className="stats-inner">
          <div className="stat-box">
            <span className="stat-number">
              <AnimatedCounter value={94} suffix="%" />
            </span>
            <span className="stat-label">Improve grades</span>
            <span className="stat-sub">Within 3 months</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              <AnimatedCounter value={stats.activeStudents} suffix="+" />
            </span>
            <span className="stat-label">Active students</span>
            <span className="stat-sub">Learning right now</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              <AnimatedCounter value={Math.floor(stats.averageRating * 10) / 10} suffix="" />
            </span>
            <span className="stat-label">Average rating</span>
            <span className="stat-sub">From {stats.sessionsCompleted.toLocaleString()}+ reviews</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              <AnimatedCounter value={stats.expertTutors} suffix="+" />
            </span>
            <span className="stat-label">Expert tutors</span>
            <span className="stat-sub">Top 5% selected</span>
          </div>
        </div>
      </section>

      {/* Subjects Cloud */}
      <section id="subjects" className="subjects-section">
        <div className="section-header">
          <span className="eyebrow">Subjects</span>
          <h2>30+ subjects, all exam boards</h2>
          <p>From Primary to A-Level, we&apos;ve got every subject covered.</p>
        </div>
        
        <div className="subjects-cloud">
          {subjects.map((subject, i) => (
            <div key={subject.name} className="subject-bubble" style={{ '--subject-color': subject.color, '--subject-bg': subject.bg } as React.CSSProperties}>
              <span className="bubble-icon">{subject.icon}</span>
              <span className="bubble-name">{subject.name}</span>
              <span className="bubble-count">{subject.students.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="exam-boards">
          <span>All major boards:</span>
          {["AQA", "Edexcel", "OCR", "WJEC", "CCEA", "Cambridge"].map(board => <span key={board} className="board-pill">{board}</span>)}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="process-section">
        <div className="section-header">
          <span className="eyebrow">How it works</span>
          <h2>Your path to better grades</h2>
          <p>Four simple steps to academic success.</p>
        </div>
        
        <div className="process-steps">
          {steps.map((step, i) => (
            <div key={i} className="process-step">
              <div className="step-number">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {i < steps.length - 1 && <div className="step-connector"></div>}
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header">
          <span className="eyebrow">Why MegaStar</span>
          <h2>Built to feel real</h2>
          <p>Each feature sits in one large image-led card with a floating detail panel, so it feels grounded and easy to scan.</p>
        </div>

        <div className="feature-story-stack">
          {features.map((feature, i) => (
            <article key={feature.title} className={`feature-story-card ${i % 2 === 1 ? "reverse" : ""}`}>
              <div className="feature-story-media">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 55vw"
                  className="feature-story-image"
                  priority={i === 0}
                />
                <div className="feature-story-overlay" />
                <div className="feature-image-badge">{feature.badge}</div>
                <div className="feature-story-stat">
                  <span>{feature.stat}</span>
                </div>
                <div className="feature-story-inset">
                  <div className="feature-story-inset-media">
                    <Image
                      src={feature.inset.image}
                      alt={feature.inset.title}
                      fill
                      sizes="96px"
                      className="feature-story-inset-image"
                    />
                  </div>
                  <div className="feature-story-inset-copy">
                    <span>{feature.inset.title}</span>
                    <strong>{feature.inset.note}</strong>
                  </div>
                </div>
              </div>
              <div className="feature-story-body">
                <span className="eyebrow">0{i + 1}</span>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="feature-point-row">
                  {feature.points.map((point) => (
                    <span key={point} className="feature-point-pill">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style jsx global>{`
        .feature-story-stack {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 28px;
        }

        .feature-story-card {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(0, 0.88fr);
          align-items: stretch;
          position: relative;
          overflow: hidden;
          border-radius: 30px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #ffffff;
          box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
        }

        .feature-story-card.reverse {
          grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
        }

        .feature-story-card.reverse .feature-story-media {
          order: 2;
        }

        .feature-story-card.reverse .feature-story-body {
          order: 1;
        }

        .feature-story-media {
          position: relative;
          min-height: 460px;
          overflow: hidden;
          background: #cbd5e1;
        }

        .feature-story-image {
          object-fit: cover;
          object-position: center;
        }

        .feature-story-overlay {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0.42) 100%);
          z-index: 1;
        }

        .feature-image-badge,
        .feature-story-stat,
        .feature-story-inset {
          position: relative;
          z-index: 2;
          backdrop-filter: blur(18px);
        }

        .feature-image-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.85);
          color: #0f172a;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .feature-story-stat {
          position: absolute;
          right: 20px;
          bottom: 24px;
          display: inline-flex;
          align-items: center;
          border-radius: 18px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.9);
          color: #0f172a;
          font-size: 0.95rem;
          font-weight: 700;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
          z-index: 2;
        }

        .feature-story-inset {
          position: absolute;
          left: 20px;
          bottom: 24px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
          padding: 14px;
          z-index: 2;
          max-width: min(360px, calc(100% - 40px));
        }

        .feature-story-inset-media {
          position: relative;
          width: 76px;
          height: 76px;
          flex: 0 0 auto;
          overflow: hidden;
          border-radius: 20px;
        }

        .feature-story-inset-image {
          object-fit: cover;
          object-position: center;
        }

        .feature-story-inset-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .feature-story-inset-copy span {
          color: #fb923c;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .feature-story-inset-copy strong {
          color: #0f172a;
          font-size: 0.95rem;
          line-height: 1.35;
        }

        .feature-story-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: 40px;
          background: linear-gradient(180deg, #ffffff 0%, #fffaf7 100%);
        }

        .feature-story-body .eyebrow {
          width: fit-content;
        }

        .feature-story-body h3 {
          font-size: 1.8rem;
          line-height: 1.06;
          color: #0f172a;
        }

        .feature-story-body p {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.7;
        }

        .feature-point-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 4px;
        }

        .feature-point-pill {
          display: flex;
          align-items: center;
          min-height: 58px;
          border-radius: 18px;
          border: 1px solid rgba(249, 115, 22, 0.16);
          background: #fff7ed;
          padding: 14px 16px;
          color: #9a3412;
          font-size: 0.92rem;
          font-weight: 700;
        }

        @media (max-width: 900px) {
          .feature-story-card,
          .feature-story-card.reverse {
            grid-template-columns: 1fr;
          }

          .feature-story-card.reverse .feature-story-media,
          .feature-story-card.reverse .feature-story-body {
            order: initial;
          }

          .feature-story-media {
            min-height: 320px;
          }

          .feature-story-body {
            padding: 28px;
          }

          .feature-point-row {
            grid-template-columns: 1fr;
          }

          .feature-story-inset {
            left: 16px;
            right: 16px;
            bottom: 16px;
            max-width: none;
          }

          .feature-story-stat {
            right: 16px;
            bottom: 110px;
          }
        }
      `}</style>

      {/* Tutors Showcase */}
      <section id="tutors" className="tutors-section">
        <div className="section-header">
          <span className="eyebrow">Expert tutors</span>
          <h2>Learn from the best</h2>
          <p>Top 5% of applicants. Rigourously vetted. Passionate about teaching.</p>
        </div>
        
        <div className="tutors-showcase">
          {tutors.map((tutor, i) => (
            <div key={i} className="tutor-spotlight">
              <div className="tutor-image-container">
                <img src={tutor.image} alt={tutor.name} />
                <div className="tutor-badge">★ {tutor.rating}</div>
              </div>
              <div className="tutor-info">
                <h3>{tutor.name}</h3>
                <p className="tutor-subject">{tutor.subject}</p>
                <div className="tutor-meta">
                  <span>{tutor.uni}</span><span>•</span><span>{tutor.exp}</span><span>•</span><span>{tutor.students} students</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tutor-stats">
          <div className="tutor-stat-item"><span className="tutor-stat-num">5%</span><span>Acceptance rate</span></div>
          <div className="tutor-stat-divider"></div>
          <div className="tutor-stat-item"><span className="tutor-stat-num">5-Step</span><span>Screening process</span></div>
          <div className="tutor-stat-divider"></div>
          <div className="tutor-stat-item"><span className="tutor-stat-num">DBS</span><span>All tutors checked</span></div>
        </div>
      </section>

      {/* Testimonials - REAL DATA */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonial-content">
            <span className="eyebrow">Success stories</span>
            <h2>Real results, real students</h2>
            
            <div className="testimonial-slider">
              {testimonials.map((t, i) => (
                <div key={t.id} className={`testimonial-slide ${i === currentTestimonial ? 'active' : ''}`}>
                  <div className="testimonial-result"><span>{t.result}</span></div>
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="testimonial-author">
                    <img src={t.image} alt={t.name} />
                    <div><strong>{t.name}</strong><span>{t.role} • {t.subject}</span></div>
                  </div>
                  <div className="testimonial-stars">{[...Array(t.rating)].map((_, j) => <span key={j}>★</span>)}</div>
                </div>
              ))}
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, i) => <button key={i} className={i === currentTestimonial ? 'active' : ''} onClick={() => setCurrentTestimonial(i)} />)}
            </div>
          </div>

          <div className="testimonial-visual">
            <img src={IMAGES.success} alt="Student success" />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <span className="eyebrow">Pricing</span>
          <h2>Simple, transparent pricing</h2>
          <p>No hidden fees. Cancel anytime. Start with 2 free sessions.</p>
        </div>
        
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Pay As You Go</h3>
            <div className="price"><span className="currency">£</span><span className="amount">35</span><span className="period">/hour</span></div>
            <p className="price-desc">Perfect for trying us out</p>
            <ul>
              <li><span className="check">✓</span> 1-on-1 sessions</li>
              <li><span className="check">✓</span> Flexible scheduling</li>
              <li><span className="check">✓</span> Session recordings</li>
              <li><span className="check">✓</span> Email support</li>
            </ul>
            <Link href="/sign-up" className="btn-outline">Get started</Link>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge">Most Popular</div>
            <h3>Monthly</h3>
            <div className="price"><span className="currency">£</span><span className="amount">29</span><span className="period">/hour</span></div>
            <p className="price-desc">Best for regular learning</p>
            <ul>
              <li><span className="check">✓</span> Everything in Pay As You Go</li>
              <li><span className="check">✓</span> Weekly progress reports</li>
              <li><span className="check">✓</span> Priority booking</li>
              <li><span className="check">✓</span> 24/7 chat support</li>
              <li><span className="check">✓</span> Parent dashboard</li>
            </ul>
            <Link href="/sign-up" className="btn-primary">Start free trial</Link>
          </div>

          <div className="pricing-card">
            <h3>Semester</h3>
            <div className="price"><span className="currency">£</span><span className="amount">25</span><span className="period">/hour</span></div>
            <p className="price-desc">Maximum value</p>
            <ul>
              <li><span className="check">✓</span> Everything in Monthly</li>
              <li><span className="check">✓</span> Exam strategy sessions</li>
              <li><span className="check">✓</span> Mock exam reviews</li>
              <li><span className="check">✓</span> Weekly parent calls</li>
              <li><span className="check">✓</span> Grade guarantee</li>
            </ul>
            <Link href="/sign-up" className="btn-outline">Get started</Link>
          </div>
        </div>

        <div className="pricing-guarantees">
          <span><span className="icon">🛡️</span> 30-day money-back guarantee</span>
          <span><span className="icon">✓</span> Cancel anytime</span>
          <span><span className="icon">💳</span> No credit card for trial</span>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="section-header">
          <span className="eyebrow">FAQ</span>
          <h2>Questions? Answered.</h2>
        </div>
        
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${activeFaq === i ? 'open' : ''}`}>
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span className="faq-toggle">{activeFaq === i ? '−' : '+'}</span>
              </button>
              {activeFaq === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to transform your grades?</h2>
          <p>Join {stats.activeStudents.toLocaleString()}+ students achieving their academic goals.</p>
          <div className="cta-buttons">
            <Link href="/sign-up" className="btn-primary btn-large">
              <span>Claim 2 free sessions</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
          <div className="cta-trust">
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 94% success rate</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mega-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-mark"><span>M</span></div>
            <div>
              <span className="footer-name">MegaStar</span>
              <p>Personalised online tutoring</p>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <Link href="#">How it works</Link>
              <Link href="#">Subjects</Link>
              <Link href="#">Pricing</Link>
              <Link href="#">For schools</Link>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link href="#">About</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Press</Link>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link href="#">Help Centre</Link>
              <Link href="#">Contact</Link>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 MegaStar Tutoring. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
