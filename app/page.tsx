"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const IMAGES = {
  heroMain: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&q=90",
  student1: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=85",
  student2: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=85",
  tutor1: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=85",
  tutor2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85",
  tutor3: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
  session: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=85",
  classroom: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=85",
  study: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=85",
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

const stats = [
  { value: 94, suffix: "%", label: "Improve grades", sub: "Within 3 months" },
  { value: 2500, suffix: "+", label: "Active students", sub: "Learning right now" },
  { value: 4.9, suffix: "", label: "Average rating", sub: "From 2,000+ reviews" },
  { value: 50, suffix: "+", label: "Expert tutors", sub: "Top 5% selected" },
];

const features = [
  { 
    icon: "🎯", 
    title: "AI-Powered Matching", 
    desc: "Our algorithm analyses your learning style and personality to find your perfect tutor match.",
    stat: "98% match satisfaction"
  },
  { 
    icon: "📹", 
    title: "Interactive Classroom", 
    desc: "HD video with collaborative whiteboard, screen sharing, and real-time document editing.",
    stat: "99.9% uptime"
  },
  { 
    icon: "📊", 
    title: "Progress Tracking", 
    desc: "Visual dashboards show your improvement with AI-generated insights and recommendations.",
    stat: "Weekly reports"
  },
  { 
    icon: "🛡️", 
    title: "100% Safe & Secure", 
    desc: "All tutors DBS checked, sessions recorded, GDPR compliant, strict safeguarding policies.",
    stat: "Fully protected"
  },
];

const testimonials = [
  { 
    name: "Emma Richardson", 
    role: "Parent", 
    image: IMAGES.student1,
    quote: "My daughter's confidence has completely transformed. She went from dreading math to actually enjoying it.",
    result: "Grade C → A*",
    subject: "Mathematics",
    rating: 5
  },
  { 
    name: "James Chen", 
    role: "A-Level Student", 
    image: IMAGES.student2,
    quote: "The personalised approach made all the difference. My tutor actually understood how I learn best.",
    result: "Grade D → B",
    subject: "Physics",
    rating: 5
  },
  { 
    name: "Sarah Mitchell", 
    role: "Parent", 
    image: IMAGES.tutor2,
    quote: "Best investment we've made. Both our children have improved dramatically. Worth every penny.",
    result: "Two grades up",
    subject: "English & Science",
    rating: 5
  },
];

const tutors = [
  { name: "Dr. Sarah Mitchell", subject: "Mathematics", rating: 4.9, students: 127, image: IMAGES.tutor1, uni: "Cambridge", exp: "8 years" },
  { name: "James Chen", subject: "Physics", rating: 4.8, students: 94, image: IMAGES.tutor3, uni: "Imperial", exp: "6 years" },
  { name: "Emma Williams", subject: "English", rating: 5.0, students: 156, image: IMAGES.tutor2, uni: "Oxford", exp: "10 years" },
];

const activities = [
  { user: "Alex M.", action: "booked a session", subject: "Mathematics", time: "2 min ago" },
  { user: "Sophie L.", action: "completed a lesson", subject: "Physics", time: "5 min ago" },
  { user: "Daniel K.", action: "improved grade to A", subject: "Chemistry", time: "12 min ago" },
  { user: "Emma R.", action: "joined MegaStar", subject: "English", time: "18 min ago" },
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
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 30,
      y: (e.clientY - rect.top - rect.height / 2) / 30,
    });
  };

  return (
    <div className="mega-landing">
      {/* Navigation */}
      <nav className={`mega-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="logo-pulse">
              <div className="logo-mark"><span>M</span></div>
            </div>
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
        <div className="hero-glow"></div>
        <div className="hero-grid"></div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot"></span>
            <span>487 students learning right now</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Unlock your</span>
            <span className="title-line gradient-text">full potential</span>
          </h1>
          
          <p className="hero-subtitle">
            1-to-1 online tutoring that actually works. 
            <strong> 94% of students improve by 2+ grades</strong> within 3 months.
          </p>
          
          <div className="hero-ctas">
            <Link href="/sign-up" className="btn-primary btn-glow">
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
              {[IMAGES.student1, IMAGES.student2, IMAGES.tutor1, IMAGES.tutor2].map((img, i) => (
                <img key={i} src={img} alt="User" className="avatar" />
              ))}
              <div className="avatar-more">+2k</div>
            </div>
            <div className="rating-block">
              <div className="stars">★★★★★</div>
              <span>4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" onMouseMove={handleMouseMove} onMouseLeave={() => setMousePos({ x: 0, y: 0 })}>
          <div className="hero-image-wrapper" style={{ transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}>
            <img src={IMAGES.heroMain} alt="Student learning" className="hero-image" />
            <div className="image-shine"></div>
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
              {activities.slice(0, 3).map((act, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-dot"></span>
                  <span><strong>{act.user}</strong> {act.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="stats-strip">
        <div className="stats-inner">
          {stats.map((stat, i) => (
            <div key={i} className="stat-box">
              <span className="stat-number gradient-text">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-sub">{stat.sub}</span>
            </div>
          ))}
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
            <div 
              key={subject.name} 
              className="subject-bubble"
              style={{ 
                '--subject-color': subject.color, 
                '--subject-bg': subject.bg,
                animationDelay: `${i * 0.05}s`
              } as React.CSSProperties}
            >
              <span className="bubble-icon">{subject.icon}</span>
              <span className="bubble-name">{subject.name}</span>
              <span className="bubble-count">{subject.students.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="exam-boards">
          <span>All major boards:</span>
          {["AQA", "Edexcel", "OCR", "WJEC", "CCEA", "Cambridge"].map(board => (
            <span key={board} className="board-pill">{board}</span>
          ))}
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
                  <span>{tutor.uni}</span>
                  <span>•</span>
                  <span>{tutor.exp}</span>
                  <span>•</span>
                  <span>{tutor.students} students</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tutor-stats">
          <div className="tutor-stat-item">
            <span className="tutor-stat-num">5%</span>
            <span>Acceptance rate</span>
          </div>
          <div className="tutor-stat-divider"></div>
          <div className="tutor-stat-item">
            <span className="tutor-stat-num">5-Step</span>
            <span>Screening process</span>
          </div>
          <div className="tutor-stat-divider"></div>
          <div className="tutor-stat-item">
            <span className="tutor-stat-num">DBS</span>
            <span>All tutors checked</span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonial-content">
            <span className="eyebrow">Success stories</span>
            <h2>Real results, real students</h2>
            
            <div className="testimonial-slider">
              {testimonials.map((t, i) => (
                <div 
                  key={i} 
                  className={`testimonial-slide ${i === currentTestimonial ? 'active' : ''}`}
                >
                  <div className="testimonial-result">
                    <span>{t.result}</span>
                  </div>
                  <blockquote>&quot;{t.quote}&quot;</blockquote>
                  <div className="testimonial-author">
                    <img src={t.image} alt={t.name} />
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role} • {t.subject}</span>
                    </div>
                  </div>
                  <div className="testimonial-stars">
                    {[...Array(t.rating)].map((_, j) => <span key={j}>★</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  className={i === currentTestimonial ? 'active' : ''}
                  onClick={() => setCurrentTestimonial(i)}
                />
              ))}
            </div>
          </div>

          <div className="testimonial-visual">
            <img src={IMAGES.success} alt="Student success" />
            <div className="success-stats">
              <div className="success-stat">
                <span>2,500+</span>
                <span>Students helped</span>
              </div>
              <div className="success-stat">
                <span>94%</span>
                <span>Grade improvement</span>
              </div>
            </div>
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
            <div className="price">
              <span className="currency">£</span>
              <span className="amount">35</span>
              <span className="period">/hour</span>
            </div>
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
            <div className="price">
              <span className="currency">£</span>
              <span className="amount">29</span>
              <span className="period">/hour</span>
            </div>
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
            <div className="price">
              <span className="currency">£</span>
              <span className="amount">25</span>
              <span className="period">/hour</span>
            </div>
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
        <div className="cta-glow"></div>
        <div className="cta-content">
          <h2>Ready to transform your grades?</h2>
          <p>Join 2,500+ students achieving their academic goals.</p>
          <div className="cta-buttons">
            <Link href="/sign-up" className="btn-primary btn-large btn-glow">
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
