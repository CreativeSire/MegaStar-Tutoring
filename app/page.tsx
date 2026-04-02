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
  heroMain: "/visuals/hero-classroom.svg",
  tutor1: "/visuals/tutor-james.svg",
  tutor2: "/visuals/testimonial-1.svg",
  tutor3: "/visuals/tutor-sarah.svg",
  success: "/visuals/success-story.svg",
};

const subjects = [
  { name: "Mathematics", students: 1240, image: "/visuals/subject-math.svg", accent: "#6366f1", note: "Number confidence" },
  { name: "English", students: 980, image: "/visuals/subject-english.svg", accent: "#8b5cf6", note: "Reading and writing" },
  { name: "Physics", students: 756, image: "/visuals/subject-physics.svg", accent: "#06b6d4", note: "Concepts that click" },
  { name: "Chemistry", students: 642, image: "/visuals/subject-chemistry.svg", accent: "#10b981", note: "See the reaction" },
  { name: "Biology", students: 589, image: "/visuals/subject-biology.svg", accent: "#84cc16", note: "Life and systems" },
  { name: "History", students: 423, image: "/visuals/subject-history.svg", accent: "#f59e0b", note: "Stories that stay" },
  { name: "Geography", students: 387, image: "/visuals/subject-geography.svg", accent: "#3b82f6", note: "World view" },
  { name: "French", students: 298, image: "/visuals/subject-french.svg", accent: "#ef4444", note: "Speak with ease" },
  { name: "Spanish", students: 267, image: "/visuals/subject-spanish.svg", accent: "#f97316", note: "Build fluency" },
  { name: "Computer Science", students: 534, image: "/visuals/subject-cs.svg", accent: "#14b8a6", note: "Code with confidence" },
  { name: "Economics", students: 312, image: "/visuals/subject-econ.svg", accent: "#6366f1", note: "Think analytically" },
  { name: "Psychology", students: 245, image: "/visuals/subject-psych.svg", accent: "#ec4899", note: "Understand people" },
];

const features = [
  { icon: "🎯", title: "AI-Powered Matching", desc: "Our algorithm analyses your learning style and personality to find your perfect tutor match.", stat: "98% match satisfaction" },
  { icon: "📹", title: "Interactive Classroom", desc: "HD video with collaborative whiteboard, screen sharing, and real-time document editing.", stat: "99.9% uptime" },
  { icon: "📊", title: "Progress Tracking", desc: "Visual dashboards show your improvement with AI-generated insights and recommendations.", stat: "Weekly reports" },
  { icon: "🛡️", title: "100% Safe & Secure", desc: "All tutors DBS checked, sessions recorded, GDPR compliant, strict safeguarding policies.", stat: "Fully protected" },
];

const tutors = [
  { name: "Dr. Sarah Mitchell", subject: "Mathematics", rating: 4.9, students: 127, image: IMAGES.tutor1, uni: "Cambridge", exp: "8 years", highlight: "GCSE + A-Level specialist" },
  { name: "James Chen", subject: "Physics", rating: 4.8, students: 94, image: IMAGES.tutor3, uni: "Imperial", exp: "6 years", highlight: "Explains hard ideas simply" },
  { name: "Emma Williams", subject: "English", rating: 5.0, students: 156, image: IMAGES.tutor2, uni: "Oxford", exp: "10 years", highlight: "Essay and exam strategy" },
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
  { id: "1", name: "Emma Richardson", role: "Parent", image: "/visuals/testimonial-1.svg", quote: "My daughter's confidence has completely transformed. She went from dreading math to actually enjoying it.", result: "Grade C → A*", subject: "Mathematics", rating: 5 },
  { id: "2", name: "James Chen", role: "A-Level Student", image: "/visuals/testimonial-2.svg", quote: "The personalised approach made all the difference. My tutor actually understood how I learn best.", result: "Grade D → B", subject: "Physics", rating: 5 },
  { id: "3", name: "Sarah Mitchell", role: "Parent", image: "/visuals/testimonial-1.svg", quote: "Best investment we've made. Both our children have improved dramatically. Worth every penny.", result: "Two grades up", subject: "English & Science", rating: 5 },
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
  const [loading, setLoading] = useState(false);

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
            <span>{`${stats.activeStudents.toLocaleString()} students learning now`}</span>
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
              <Image src={testimonials[0]?.image || IMAGES.tutor1} alt="User" width={40} height={40} className="avatar" />
              <Image src={testimonials[1]?.image || IMAGES.tutor2} alt="User" width={40} height={40} className="avatar" />
              <Image src={testimonials[2]?.image || IMAGES.tutor3} alt="User" width={40} height={40} className="avatar" />
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
            <Image src={IMAGES.heroMain} alt="Student learning" fill sizes="(max-width: 900px) 100vw, 50vw" className="hero-image" />
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
              <Image src={IMAGES.tutor1} alt="Tutor" width={44} height={44} />
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
          <h2>Every subject, shown beautifully</h2>
          <p>Explore the subjects students ask for most, each one presented as a calm image card with a clear focus.</p>
        </div>
        
        <div className="subjects-grid">
          {subjects.map((subject, i) => (
            <article key={subject.name} className="subject-card">
              <div className="subject-card-media">
                <Image
                  src={subject.image}
                  alt={subject.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 25vw"
                  className="subject-card-image"
                />
                <div className="subject-card-overlay" />
                <div className="subject-card-count">
                  {subject.students.toLocaleString()} learners
                </div>
              </div>
              <div className="subject-card-body">
                <span className="subject-card-note" style={{ color: subject.accent }}>
                  {subject.note}
                </span>
                <h3>{subject.name}</h3>
              </div>
            </article>
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
          <h2>Built for results</h2>
          <p>Everything you need to succeed, powered by cutting-edge technology.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <span className="feature-stat">{feature.stat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Tutors Showcase */}
      <section id="tutors" className="tutors-section">
        <div className="section-header">
          <span className="eyebrow">Expert tutors</span>
          <h2>Meet tutors who feel personal</h2>
          <p>Hand-picked people who teach with calm, clarity, and care.</p>
        </div>
        
        <div className="tutors-grid">
          {tutors.map((tutor, i) => (
            <article key={i} className="tutor-card">
              <div className="tutor-image-container">
                <Image
                  src={tutor.image}
                  alt={tutor.name}
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="tutor-image"
                />
                <div className="tutor-badge">★ {tutor.rating}</div>
              </div>
              <div className="tutor-info">
                <span className="eyebrow">Tutor {i + 1}</span>
                <h3>{tutor.name}</h3>
                <p className="tutor-subject">{tutor.subject}</p>
                <p className="tutor-highlight">{tutor.highlight}</p>
                <div className="tutor-meta">
                  <span>{tutor.uni}</span><span>•</span><span>{tutor.exp}</span><span>•</span><span>{tutor.students} students</span>
                </div>
              </div>
            </article>
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
                    <Image src={t.image} alt={t.name} width={48} height={48} />
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
            <Image src={IMAGES.success} alt="Student success" width={960} height={720} />
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
        <div className="footer-shell">
          <div className="footer-brand-panel">
            <div className="footer-brand">
              <div className="logo-mark"><span>M</span></div>
              <div>
                <span className="footer-name">MegaStar</span>
                <p>Personalised online tutoring, shaped around each learner.</p>
              </div>
            </div>
            <p className="footer-copy">
              Clear lessons, calm progress, and a simple path from first session to finished results.
            </p>
            <div className="footer-pills">
              <span>1-to-1 lessons</span>
              <span>Private progress</span>
              <span>Friendly support</span>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <h4>Explore</h4>
              <Link href="#subjects">Subjects</Link>
              <Link href="#how-it-works">How it works</Link>
              <Link href="#tutors">Tutors</Link>
              <Link href="#pricing">Pricing</Link>
            </div>
            <div className="footer-col">
              <h4>Learn</h4>
              <Link href="/dashboard">Student area</Link>
              <Link href="/app">Tutor area</Link>
              <Link href="/dashboard/progress">Progress</Link>
              <Link href="/dashboard/messages">Messages</Link>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link href="/contact">Contact</Link>
              <Link href="/legal/privacy">Privacy</Link>
              <Link href="/legal/terms">Terms</Link>
              <Link href="/legal/cookies">Cookies</Link>
            </div>
            <div className="footer-col footer-cta">
              <h4>Start simple</h4>
              <p>See the full experience and begin with a free first step.</p>
              <Link href="/sign-up" className="btn-coral footer-button">Start free trial</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 MegaStar Tutoring. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .subjects-section,
        .tutors-section {
          max-width: 1400px;
          margin: 0 auto;
          padding: 96px 24px;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
        }

        .subject-card {
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #ffffff;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
        }

        .subject-card-media {
          position: relative;
          min-height: 220px;
          overflow: hidden;
        }

        .subject-card-image {
          object-fit: cover;
          object-position: center;
        }

        .subject-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.02) 0%, rgba(15, 23, 42, 0.46) 100%);
          z-index: 1;
        }

        .subject-card-count {
          position: absolute;
          right: 16px;
          bottom: 16px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #0f172a;
          padding: 10px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.12);
        }

        .subject-card-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 18px 18px 20px;
        }

        .subject-card-note {
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .subject-card-body h3 {
          color: #0f172a;
          font-size: 1.08rem;
          line-height: 1.2;
        }

        .tutors-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .tutor-card {
          overflow: hidden;
          border-radius: 30px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #ffffff;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
        }

        .tutor-image-container {
          position: relative;
          min-height: 320px;
          overflow: hidden;
          background: #e2e8f0;
        }

        .tutor-image {
          object-fit: cover;
          object-position: center;
        }

        .tutor-image-container::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.04) 0%, rgba(15, 23, 42, 0.34) 100%);
          z-index: 1;
        }

        .tutor-badge {
          position: absolute;
          left: 16px;
          bottom: 16px;
          z-index: 2;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: #0f172a;
          padding: 10px 14px;
          font-size: 0.82rem;
          font-weight: 800;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.12);
        }

        .tutor-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 22px;
        }

        .tutor-info .eyebrow {
          width: fit-content;
        }

        .tutor-info h3 {
          color: #0f172a;
          font-size: 1.2rem;
          line-height: 1.15;
        }

        .tutor-subject {
          color: #fb923c;
          font-size: 0.94rem;
          font-weight: 800;
        }

        .tutor-highlight {
          color: #475569;
          font-size: 0.98rem;
          line-height: 1.6;
        }

        .tutor-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          color: #64748b;
          font-size: 0.84rem;
        }

        @media (max-width: 1024px) {
          .subjects-grid,
          .tutors-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .subjects-section,
          .tutors-section {
            padding: 72px 16px;
          }

          .subjects-grid,
          .tutors-grid {
            grid-template-columns: 1fr;
          }

          .subject-card-media {
            min-height: 200px;
          }

          .tutor-image-container {
            min-height: 280px;
          }
        }

        .hero-content,
        .hero-visual,
        .stats-strip,
        .section-header,
        .subject-card,
        .tutor-card,
        .feature-story-card,
        .pricing-card,
        .faq-item,
        .testimonial-slide,
        .cta-content,
        .footer-shell {
          animation: riseUp 700ms ease both;
        }

        .hero-visual {
          animation-delay: 80ms;
        }

        .stats-strip {
          animation-delay: 120ms;
        }

        .subject-card:nth-child(2n),
        .tutor-card:nth-child(2n),
        .feature-story-card:nth-child(2n) {
          animation-delay: 80ms;
        }

        .subject-card,
        .tutor-card,
        .feature-story-card,
        .pricing-card,
        .faq-item,
        .testimonial-slide {
          transition:
            transform 220ms ease,
            box-shadow 220ms ease,
            border-color 220ms ease;
        }

        .subject-card:hover,
        .tutor-card:hover,
        .feature-story-card:hover,
        .pricing-card:hover,
        .faq-item:hover,
        .testimonial-slide:hover {
          transform: translateY(-6px);
          box-shadow: 0 26px 60px rgba(15, 23, 42, 0.12);
          border-color: rgba(251, 146, 60, 0.2);
        }

        .section-header {
          padding-top: 12px;
          animation: riseUp 700ms ease both;
        }

        .section-header .eyebrow {
          box-shadow: 0 10px 24px rgba(251, 146, 60, 0.12);
        }

        .mega-footer {
          background:
            radial-gradient(circle at top left, rgba(251, 146, 60, 0.12), transparent 30%),
            #0f172a;
          color: #e2e8f0;
          padding: 72px 24px 28px;
        }

        .footer-shell {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
          gap: 42px;
          padding-bottom: 56px;
        }

        .footer-brand-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 24px;
          border-radius: 30px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(14px);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .footer-name {
          display: block;
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .footer-brand p,
        .footer-copy,
        .footer-cta p {
          color: #cbd5e1;
          line-height: 1.7;
        }

        .footer-copy {
          max-width: 30rem;
        }

        .footer-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .footer-pills span {
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          padding: 10px 14px;
          font-size: 0.84rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-col h4 {
          color: #ffffff;
          font-size: 0.92rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .footer-col a {
          color: #cbd5e1;
          font-size: 0.95rem;
          line-height: 1.5;
          transition: color 180ms ease;
        }

        .footer-col a:hover {
          color: #ffffff;
        }

        .footer-cta {
          padding: 18px;
          border-radius: 24px;
          border: 1px solid rgba(251, 146, 60, 0.18);
          background: linear-gradient(180deg, rgba(251, 146, 60, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%);
        }

        .footer-button {
          width: fit-content;
          margin-top: 4px;
        }

        .footer-bottom {
          max-width: 1400px;
          margin: 0 auto;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          color: #94a3b8;
          font-size: 0.92rem;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .footer-bottom-links a {
          color: #cbd5e1;
        }

        .footer-bottom-links a:hover {
          color: #ffffff;
        }

        @keyframes riseUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1024px) {
          .footer-shell,
          .footer-links {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-content,
          .hero-visual,
          .stats-strip,
          .section-header,
          .subject-card,
          .tutor-card,
          .feature-story-card,
          .pricing-card,
          .faq-item,
          .testimonial-slide,
          .cta-content,
          .footer-shell {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

