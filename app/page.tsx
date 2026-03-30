"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  classroom: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=85",
  studyGroup: "https://images.unsplash.com/photo-1427504740708-81734f1bd0fd?w=800&q=85",
  tutor1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=85",
  tutor2: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
  tutor3: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85",
  tutor4: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=85",
  tutor5: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=85",
  tutor6: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=85",
  studentHappy: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=85",
  studentGraduation: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=85",
  videoThumb: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&q=85",
  whiteboard: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=85",
  books: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=85",
  studyNight: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=85",
  tabletLearning: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=85",
  family: "https://images.unsplash.com/photo-1542037104857-4bb4b9fe2433?w=800&q=85",
  teacher: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=85",
  examPrep: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=85",
};

const allSubjects = [
  { name: "Mathematics", icon: "📐", students: "240+", color: "#4f46e5" },
  { name: "English", icon: "📚", students: "180+", color: "#7c3aed" },
  { name: "Physics", icon: "⚛️", students: "120+", color: "#0d9488" },
  { name: "Chemistry", icon: "🧪", students: "95+", color: "#059669" },
  { name: "Biology", icon: "🧬", students: "110+", color: "#10b981" },
  { name: "History", icon: "📜", students: "85+", color: "#f59e0b" },
  { name: "Geography", icon: "🌍", students: "70+", color: "#3b82f6" },
  { name: "French", icon: "🥐", students: "65+", color: "#ef4444" },
  { name: "Spanish", icon: "💃", students: "55+", color: "#f97316" },
  { name: "German", icon: "🍺", students: "40+", color: "#eab308" },
  { name: "Computer Science", icon: "💻", students: "90+", color: "#6366f1" },
  { name: "Economics", icon: "📈", students: "75+", color: "#14b8a6" },
];

const featuredSubjects = [
  { name: "Mathematics", students: "240+ students", image: IMAGES.mathTutor, color: "#4f46e5" },
  { name: "English", students: "180+ students", image: IMAGES.englishTutor, color: "#7c3aed" },
  { name: "Science", students: "200+ students", image: IMAGES.scienceTutor, color: "#0d9488" },
  { name: "11+ Prep", students: "150+ students", image: IMAGES.studentThinking, color: "#f59e0b" },
  { name: "GCSE", students: "320+ students", image: IMAGES.studentWriting, color: "#ec4899" },
  { name: "A-Level", students: "190+ students", image: IMAGES.studentLaptop, color: "#dc2626" },
];

const steps = [
  { num: "01", title: "Tell us your goals", desc: "Share what subjects you need help with and your learning objectives", icon: "🎯" },
  { num: "02", title: "Get matched", desc: "Our AI finds the perfect tutor based on your learning style and needs", icon: "🤝" },
  { num: "03", title: "Start learning", desc: "Begin your personalised lessons and track your progress weekly", icon: "🚀" },
];

const testimonials = [
  { quote: "My daughter went from a C to an A*. The personalised approach made all the difference.", author: "Sarah Mitchell", role: "Parent of Year 11", image: IMAGES.parent, subject: "Mathematics", improvement: "C → A*" },
  { quote: "Finally, a tutor who understands how I learn. Physics actually makes sense now.", author: "James Kim", role: "A-Level Student", image: IMAGES.studentSuccess, subject: "Physics", improvement: "D → B" },
  { quote: "The platform makes it so easy to focus on teaching. Everything just works.", author: "Dr. Michael Chen", role: "Science Tutor", image: IMAGES.tutor, subject: "Chemistry", improvement: "50+ students" },
  { quote: "Worth every penny. My son's confidence has improved so much.", author: "Emma Thompson", role: "Parent of Year 10", image: IMAGES.tutor5, subject: "English", improvement: "E → C" },
  { quote: "I actually enjoy maths now. My tutor explains things in a way that clicks.", author: "Olivia Williams", role: "GCSE Student", image: IMAGES.tutor3, subject: "Mathematics", improvement: "4 → 7" },
  { quote: "Best investment we've made for our children's education.", author: "David Park", role: "Parent of Year 9", image: IMAGES.tutor4, subject: "Science", improvement: "Both kids improved" },
];

const features = [
  { icon: "🎯", title: "AI-Powered Matching", desc: "Our algorithm analyses learning styles to find your perfect tutor match" },
  { icon: "📅", title: "Flexible Scheduling", desc: "Book sessions 24/7 with tutors across time zones" },
  { icon: "📹", title: "HD Video Classroom", desc: "Crystal-clear video with interactive whiteboard and screen sharing" },
  { icon: "📊", title: "Progress Dashboard", desc: "Track improvements with detailed analytics and milestone reports" },
  { icon: "📝", title: "Smart Session Notes", desc: "AI-generated summaries after every lesson with key takeaways" },
  { icon: "🛡️", title: "100% Safe", desc: "All tutors DBS checked, sessions recorded, fully GDPR compliant" },
];

const trustFeatures = [
  { icon: "🔒", title: "Secure Payments", desc: "Encrypted transactions, money-back guarantee" },
  { icon: "✅", title: "No Hidden Fees", desc: "Transparent pricing, no setup or cancellation charges" },
  { icon: "🎓", title: "Verified Tutors", desc: "Rigorous 5-step screening process" },
  { icon: "🛡️", title: "Safe Platform", desc: "Recorded sessions, strict safeguarding policies" },
];

const faqs = [
  { q: "How does the free trial work?", a: "Your first 30-minute session is completely free. It's a chance to meet your tutor and see if it's a good fit. No credit card required." },
  { q: "What subjects do you cover?", a: "We cover 30+ subjects including Maths, English, Sciences, Languages, Humanities, and more. From primary school to A-Levels." },
  { q: "Can I change my tutor?", a: "Absolutely. If you're not satisfied, we'll match you with a different tutor at no extra cost. Your learning comes first." },
  { q: "How do payments work?", a: "Pay per session or buy a package. No long-term contracts. Cancel anytime. We accept all major cards and PayPal." },
  { q: "What if I need to cancel?", desc: "Cancel or reschedule up to 24 hours before your session for a full refund." },
  { q: "Do you offer group sessions?", a: "Yes! Small group sessions of 2-4 students are available at discounted rates." },
  { q: "How are tutors selected?", a: "Only 5% of applicants pass our rigorous screening: application review, qualification check, teaching demo, background check, and training." },
  { q: "What technology do I need?", a: "Just a computer/tablet with internet. Our platform works in your browser—no downloads needed. We recommend a quiet space and headphones." },
];

const tutors = [
  { name: "Dr. Sarah Mitchell", subject: "Mathematics", rating: 4.9, students: 127, sessions: 2400, image: IMAGES.tutor, tags: ["GCSE", "A-Level", "Further Maths"], badge: "Top Rated" },
  { name: "James Chen", subject: "Physics", rating: 4.8, students: 94, sessions: 1800, image: IMAGES.tutor1, tags: ["A-Level", "IB"], badge: "Expert" },
  { name: "Emma Williams", subject: "English", rating: 5.0, students: 156, sessions: 3100, image: IMAGES.tutor5, tags: ["11+", "GCSE", "A-Level"], badge: "Top Rated" },
  { name: "Dr. Michael Brown", subject: "Chemistry", rating: 4.9, students: 112, sessions: 2100, image: IMAGES.tutor2, tags: ["GCSE", "A-Level"], badge: "Expert" },
  { name: "Lisa Park", subject: "Biology", rating: 4.8, students: 89, sessions: 1650, image: IMAGES.tutor6, tags: ["GCSE", "A-Level"], badge: null },
  { name: "David Thompson", subject: "History", rating: 4.7, students: 76, sessions: 1400, image: IMAGES.tutor3, tags: ["GCSE", "A-Level"], badge: null },
];

const pricingPlans = [
  { name: "Pay As You Go", price: "35", period: "per hour", description: "Perfect for trying out tutoring", features: ["1-on-1 sessions", "Flexible scheduling", "Session recordings", "Email support", "Cancel anytime"], popular: false },
  { name: "Monthly", price: "29", period: "per hour", description: "Our most popular choice", features: ["Everything in Pay As You Go", "Progress reports", "Priority booking", "24/7 chat support", "Custom study plans", "Parent dashboard"], popular: true },
  { name: "Semester", price: "25", period: "per hour", description: "Best value for serious students", features: ["Everything in Monthly", "Exam strategy sessions", "Mock exam reviews", "Weekly parent updates", "Success guarantee", "Bonus resources"], popular: false },
];

const resources = [
  { title: "How to Ace Your GCSE Maths", category: "Study Guide", readTime: "8 min read", image: IMAGES.books, author: "Dr. Sarah Mitchell" },
  { title: "The Complete 11+ Preparation Plan", category: "Strategy", readTime: "12 min read", image: IMAGES.whiteboard, author: "Emma Williams" },
  { title: "Building Study Habits That Stick", category: "Productivity", readTime: "6 min read", image: IMAGES.studyNight, author: "James Chen" },
  { title: "A-Level Physics: Key Concepts", category: "Science", readTime: "10 min read", image: IMAGES.scienceTutor, author: "James Chen" },
];

const comparison = [
  { feature: "Personalised feedback", selfStudy: false, megaStar: true },
  { feature: "24/7 question support", selfStudy: false, megaStar: true },
  { feature: "Structured curriculum", selfStudy: "Limited", megaStar: true },
  { feature: "Exam techniques", selfStudy: "Limited", megaStar: true },
  { feature: "Progress tracking", selfStudy: false, megaStar: true },
  { feature: "Study materials included", selfStudy: false, megaStar: true },
  { feature: "AI-powered tools", selfStudy: false, megaStar: true },
  { feature: "Motivation & accountability", selfStudy: false, megaStar: true },
];

const milestones = [
  { week: "Week 1-2", title: "Assessment & Setup", desc: "Diagnostic test, goal setting, personalised learning plan created" },
  { week: "Week 3-6", title: "Foundation Building", desc: "Core concept mastery, confidence building, regular practice" },
  { week: "Week 7-10", title: "Acceleration", desc: "Advanced techniques, exam strategies, mock tests" },
  { week: "Week 11+", title: "Excellence & Mastery", desc: "Fine-tuning, exam preparation, grade improvement achieved" },
];

const examBoards = ["AQA", "Edexcel", "OCR", "WJEC", "CCEA", "Cambridge"];

const trustBadges = [
  { icon: "⭐", label: "Trustpilot 4.9/5", sub: "2000+ reviews" },
  { icon: "🛡️", label: "DBS Checked", sub: "All tutors" },
  { icon: "🏆", label: "Award Winning", sub: "EdTech 2024" },
  { icon: "🎓", label: "Qualified Teachers", sub: "Degree holders" },
];

const whyChoose = [
  { title: "Personalised Learning", desc: "Every lesson tailored to your child's unique needs", icon: "✨" },
  { title: "Expert Tutors", desc: "Top 5% of applicants—rigorously vetted", icon: "🎓" },
  { title: "Proven Results", desc: "94% of students improve by at least one grade", icon: "📈" },
  { title: "Flexible & Convenient", desc: "Learn anytime, anywhere, on any device", icon: "📱" },
  { title: "Safe & Secure", desc: "Recorded sessions, strict safeguarding", icon: "🔒" },
  { title: "Parent Updates", desc: "Weekly progress reports and insights", icon: "📊" },
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
  const [email, setEmail] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 25,
      y: (e.clientY - rect.top - rect.height / 2) / 25,
    });
  };

  return (
    <div className="mega-landing">
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="announcement-bar">
          <div className="announcement-content">
            <span className="announcement-badge">Limited Time</span>
            <span>🎉 Get 2 FREE sessions when you book this week! No credit card required. </span>
            <Link href="/sign-up">Claim offer →</Link>
          </div>
          <button onClick={() => setShowAnnouncement(false)} className="announcement-close">×</button>
        </div>
      )}

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
            <Link href="#reviews" className="nav-link">Reviews</Link>
            <Link href="/sign-in" className="nav-link">Sign in</Link>
            <Link href="/sign-up" className="nav-cta">Get started free</Link>
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
          <div className="hero-badge-group">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              500+ students learning now
            </div>
          </div>
          <h1 className="hero-title">
            <span className="title-line">Online tutoring that</span>
            <span className="title-line gradient-text">actually works</span>
          </h1>
          <p className="hero-lead">
            1-to-1 personalised lessons with expert tutors. From £25/hour. 
            94% of students improve their grades. First 2 sessions FREE.
          </p>
          <div className="hero-actions">
            <Link href="/sign-up" className="btn-primary btn-large">
              Start free trial
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button className="btn-ghost btn-large">
              <span className="play-icon-large">▶</span>
              See how it works
            </button>
          </div>
          <div className="hero-trust">
            <div className="avatar-group">
              <img src={IMAGES.parent} alt="Parent" />
              <img src={IMAGES.studentSuccess} alt="Student" />
              <img src={IMAGES.tutor} alt="Tutor" />
              <img src={IMAGES.tutor5} alt="Tutor" />
              <div className="avatar-more">+</div>
            </div>
            <div className="trust-info">
              <div className="stars">★★★★★</div>
              <span>4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
          <div className="trust-badges-mini">
            {trustBadges.map((badge, i) => (
              <div key={i} className="trust-badge-mini">
                <span>{badge.icon}</span>
                <div>
                  <strong>{badge.label}</strong>
                  <span>{badge.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" onMouseMove={handleMouseMove} onMouseLeave={() => setMousePos({ x: 0, y: 0 })}>
          <div className="main-image-3d" style={{ transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)` }}>
            <img src={IMAGES.hero} alt="Student learning" />
            <div className="image-shine"></div>
          </div>
          <div className="floating-card card-stats">
            <div className="card-icon green">📈</div>
            <div><span className="card-value">+2 grades</span><span className="card-label">average improvement</span></div>
          </div>
          <div className="floating-card card-live">
            <div className="live-header"><span className="live-dot"></span>Live session now</div>
            <div className="live-tutor">
              <img src={IMAGES.tutor} alt="Tutor" />
              <div><strong>Dr. Sarah M.</strong><span>Mathematics • GCSE</span></div>
            </div>
          </div>
          <div className="floating-card card-subjects">
            <div className="subjects-mini">
              {["📐", "📚", "⚛️", "🧪", "💻", "🌍"].map((icon, i) => (
                <span key={i} className="subject-icon-mini">{icon}</span>
              ))}
            </div>
            <span className="card-label">30+ subjects available</span>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="logo-cloud">
        <p>Trusted by students from</p>
        <div className="logo-cloud-grid">
          {examBoards.map((board) => (
            <span key={board} className="exam-board-badge">{board}</span>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-block">
            <span className="stat-number gradient-text"><AnimatedCounter value={94} suffix="%" /></span>
            <span className="stat-desc">Improve their grades</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-block">
            <span className="stat-number gradient-text"><AnimatedCounter value={2500} suffix="+" /></span>
            <span className="stat-desc">Students taught</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-block">
            <span className="stat-number gradient-text"><AnimatedCounter value={4} suffix=".9" /></span>
            <span className="stat-desc">Average rating</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-block">
            <span className="stat-number gradient-text"><AnimatedCounter value={98} suffix="%" /></span>
            <span className="stat-desc">5-star reviews</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <div className="section-header">
          <span className="eyebrow">Why MegaStar</span>
          <h2>The smarter way to learn</h2>
          <p>Everything you need to succeed, all in one place.</p>
        </div>
        <div className="why-grid">
          {whyChoose.map((item, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All Subjects Grid */}
      <section id="subjects" className="all-subjects-section">
        <div className="section-header">
          <span className="eyebrow">What we teach</span>
          <h2>30+ subjects, all levels</h2>
          <p>From Primary to A-Level, we've got you covered.</p>
        </div>
        <div className="subjects-showcase">
          <div className="subjects-grid-large">
            {allSubjects.map((subject, i) => (
              <div key={subject.name} className="subject-item" style={{ '--subject-color': subject.color } as React.CSSProperties}>
                <span className="subject-icon">{subject.icon}</span>
                <div className="subject-info">
                  <span className="subject-name">{subject.name}</span>
                  <span className="subject-count">{subject.students} students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="exam-boards">
          <p>All major exam boards supported:</p>
          <div className="exam-boards-list">
            {examBoards.map(board => <span key={board} className="board-tag">{board}</span>)}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="process-section-v2">
        <div className="section-header light">
          <span className="eyebrow">How it works</span>
          <h2>Get started in minutes</h2>
          <p>Simple, fast, and designed around you.</p>
        </div>
        <div className="process-grid-v2">
          {steps.map((step, i) => (
            <div key={i} className="process-card-v2">
              <div className="process-icon-large">{step.icon}</div>
              <div className="process-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="process-features">
            {trustFeatures.map((feature, i) => (
              <div key={i} className="trust-feature-item">
                <span className="trust-feature-icon">{feature.icon}</span>
                <div>
                  <strong>{feature.title}</strong>
                  <span>{feature.desc}</span>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Tutor Selection Quality */}
      <section className="quality-section">
        <div className="quality-grid">
          <div className="quality-content">
            <span className="eyebrow">Rigorous selection</span>
            <h2>Only the best tutors make it</h2>
            <p>Just <strong>5% of applicants</strong> pass our 5-stage screening process. We hand-pick tutors who are not just knowledgeable, but skilled at teaching.</p>
            <ul className="quality-list">
              <li><span className="check">✓</span> Application & CV review</li>
              <li><span className="check">✓</span> Qualification verification</li>
              <li><span className="check">✓</span> Live teaching demonstration</li>
              <li><span className="check">✓</span> DBS background check</li>
              <li><span className="check">✓</span> Training & onboarding</li>
            </ul>
          </div>
          <div className="quality-visual">
            <div className="quality-stat-card">
              <span className="quality-percent">5%</span>
              <span className="quality-label">Acceptance rate</span>
            </div>
            <img src={IMAGES.teacher} alt="Qualified tutor" />
          </div>
        </div>
      </section>

      {/* Meet Tutors */}
      <section id="tutors" className="tutors-section-v2">
        <div className="section-header">
          <span className="eyebrow">Our tutors</span>
          <h2>Learn from the best</h2>
          <p>Expert tutors who are passionate about helping students succeed.</p>
        </div>
        <div className="tutors-showcase">
          {tutors.map((tutor, i) => (
            <div key={i} className="tutor-card-v2">
              {tutor.badge && <span className="tutor-badge">{tutor.badge}</span>}
              <div className="tutor-img-wrap">
                <img src={tutor.image} alt={tutor.name} />
              </div>
              <div className="tutor-info-v2">
                <h3>{tutor.name}</h3>
                <p className="tutor-subject-v2">{tutor.subject}</p>
                <div className="tutor-stats-row">
                  <span className="tutor-rating-v2">★ {tutor.rating}</span>
                  <span className="tutor-sessions">{tutor.sessions.toLocaleString()}+ sessions</span>
                </div>
                <div className="tutor-tags-v2">
                  {tutor.tags.map(tag => <span key={tag} className="tutor-tag-v2">{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="section-cta">
          <Link href="/sign-up" className="btn-primary">View all 50+ tutors</Link>
        </div>
      </section>

      {/* Results/Comparison */}
      <section className="results-section">
        <div className="section-header">
          <span className="eyebrow">Proven results</span>
          <h2>Tutoring vs studying alone</h2>
          <p>See why students who get tutoring perform better.</p>
        </div>
        <div className="comparison-v2">
          <div className="comparison-side self-study">
            <h3>Self-Study</h3>
            <ul>
              {comparison.map((row, i) => (
                <li key={i} className={row.selfStudy === true ? 'yes' : row.selfStudy === false ? 'no' : 'partial'}>
                  {row.selfStudy === true ? '✓' : row.selfStudy === false ? '✗' : '○'} {row.feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="comparison-side mega-star">
            <div className="comparison-badge">Recommended</div>
            <h3>With MegaStar</h3>
            <ul>
              {comparison.map((row, i) => (
                <li key={i} className="yes">✓ {row.feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="reviews" className="testimonials-v2">
        <div className="section-header">
          <span className="eyebrow">Success stories</span>
          <h2>Real students, real results</h2>
          <p>Join thousands of students who've transformed their grades.</p>
        </div>
        <div className="testimonials-masonry">
          {testimonials.map((t, i) => (
            <div key={i} className={`testimonial-card-v2 ${i % 3 === 0 ? 'large' : ''}`}>
              <div className="testimonial-improvement">{t.improvement}</div>
              <blockquote>"{t.quote}"</blockquote>
              <div className="testimonial-author-v2">
                <img src={t.image} alt={t.author} />
                <div>
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
              <span className="testimonial-subject-tag">{t.subject}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="journey-section-v2">
        <div className="section-header light">
          <span className="eyebrow">Your journey</span>
          <h2>What to expect</h2>
          <p>A clear path from first session to exam success.</p>
        </div>
        <div className="jimeline">
          {milestones.map((m, i) => (
            <div key={i} className="jimeline-item">
              <div className="jimeline-marker">
                <span className="jimeline-dot"></span>
                {i < milestones.length - 1 && <span className="jimeline-line"></span>}
              </div>
              <div className="jimeline-content">
                <span className="jimeline-phase">{m.week}</span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Demo */}
      <section className="video-section-v2">
        <div className="video-container">
          <img src={IMAGES.videoThumb} alt="Platform demo" />
          <div className="video-overlay-v2">
            <button className="video-play-btn">
              <span>▶</span>
            </button>
            <h3>See our platform in action</h3>
            <p>Watch a 2-minute demo of how online tutoring works</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="pricing-section-v2">
        <div className="section-header">
          <span className="eyebrow">Simple pricing</span>
          <h2>Choose your plan</h2>
          <p>Flexible options to fit your budget. All plans include a free trial.</p>
        </div>
        <div className="pricing-cards-v2">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`pricing-card-v2 ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <span className="popular-tag">Most Popular</span>}
              <h3>{plan.name}</h3>
              <p className="plan-desc">{plan.description}</p>
              <div className="plan-price">
                <span className="currency">£</span>
                <span className="amount">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feat, j) => (
                  <li key={j}><span className="feat-check">✓</span> {feat}</li>
                ))}
              </ul>
              <Link href="/sign-up" className={`plan-cta ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                {plan.popular ? 'Start free trial' : 'Choose plan'}
              </Link>
            </div>
          ))}
        </div>
        <div className="pricing-trust">
          <span className="guarantee-badge">🛡️ 30-day money-back guarantee</span>
          <span className="cancel-badge">✓ Cancel anytime</span>
        </div>
      </section>

      {/* Resources */}
      <section className="resources-v2">
        <div className="section-header">
          <span className="eyebrow">Free resources</span>
          <h2>Expert study tips</h2>
          <p>Advice from our top tutors to help you succeed.</p>
        </div>
        <div className="resources-grid-v2">
          {resources.map((r, i) => (
            <article key={i} className="resource-card-v2">
              <div className="resource-img">
                <img src={r.image} alt={r.title} />
                <span className="resource-cat">{r.category}</span>
              </div>
              <div className="resource-body">
                <h3>{r.title}</h3>
                <div className="resource-meta">
                  <span>By {r.author}</span>
                  <span>{r.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-v2">
        <div className="section-header">
          <span className="eyebrow">FAQ</span>
          <h2>Common questions</h2>
          <p>Everything you need to know about getting started.</p>
        </div>
        <div className="faq-grid">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item-v2 ${activeFaq === i ? 'open' : ''}`}>
              <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span className="faq-toggle">{activeFaq === i ? '−' : '+'}</span>
              </button>
              {activeFaq === i && <div className="faq-answer-v2">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-v2">
        <div className="newsletter-content-v2">
          <div className="newsletter-text">
            <h2>Get study tips weekly</h2>
            <p>Join 10,000+ parents and students. Free exam tips, study strategies, and resources.</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" className="btn-primary">Subscribe free</button>
            </form>
            <span className="newsletter-note">No spam. Unsubscribe anytime.</span>
          </div>
          <div className="newsletter-visual">
            <img src={IMAGES.studentHappy} alt="Happy student" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="final-cta-bg">
          <div className="final-blob"></div>
        </div>
        <div className="final-cta-content">
          <h2>Ready to improve your grades?</h2>
          <p>Start with 2 FREE sessions. No credit card required.</p>
          <div className="final-cta-buttons">
            <Link href="/sign-up" className="btn-white btn-large">Claim your free sessions</Link>
          </div>
          <div className="final-cta-trust">
            <span>✓ 2 free sessions</span>
            <span>✓ No credit card</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mega-footer-v2">
        <div className="footer-top">
          <div className="footer-brand-v2">
            <div className="logo-mark"><span>M</span></div>
            <div>
              <span className="footer-brand-name">MegaStar Tutoring</span>
              <p>Personalised online tutoring that works</p>
            </div>
          </div>
          <div className="footer-columns">
            <div className="footer-col">
              <h4>Learn</h4>
              <Link href="#">Find a tutor</Link>
              <Link href="#">How it works</Link>
              <Link href="#">Pricing</Link>
              <Link href="#">Subjects</Link>
            </div>
            <div className="footer-col">
              <h4>Teach</h4>
              <Link href="#">Become a tutor</Link>
              <Link href="#">Tutor resources</Link>
              <Link href="#">Success stories</Link>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link href="#">About us</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Press</Link>
              <Link href="#">Contact</Link>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <Link href="#">Help centre</Link>
              <Link href="#">Safety</Link>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom-v2">
          <p>© 2025 MegaStar Tutoring. All rights reserved.</p>
          <div className="footer-social">
            <span>Instagram</span>
            <span>Facebook</span>
            <span>Twitter</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
