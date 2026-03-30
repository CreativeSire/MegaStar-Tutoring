"use client";

import Link from "next/link";
import { PublicHeader } from "@/components/public-header";
import { useEffect, useRef, useState } from "react";

// Premium Unsplash Image URLs (high-quality, curated)
const IMAGES = {
  heroStudent: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
  tutorSession: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
  onlineLearning: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
  studentSuccess: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  mathTutor: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
  scienceLab: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
  englishLit: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
  examPrep: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80",
  happyStudent: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80",
  tutorProfile: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&q=80",
  studyGroup: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
  classroom: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
};

const subjectList = [
  { name: "Mathematics", icon: "📐", color: "#1f6feb" },
  { name: "English", icon: "📚", color: "#10b981" },
  { name: "Science", icon: "🔬", color: "#8b5cf6" },
  { name: "11+ Prep", icon: "🎯", color: "#f59e0b" },
  { name: "GCSE", icon: "📝", color: "#ef4444" },
  { name: "A-Level", icon: "🎓", color: "#06b6d4" },
  { name: "Physics", icon: "⚛️", color: "#6366f1" },
  { name: "Chemistry", icon: "🧪", color: "#84cc16" },
  { name: "Biology", icon: "🧬", color: "#ec4899" },
  { name: "French", icon: "🇫🇷", color: "#3b82f6" },
  { name: "Spanish", icon: "🇪🇸", color: "#f97316" },
  { name: "Computer Science", icon: "💻", color: "#14b8a6" },
];

const features = [
  {
    title: "AI-Powered Scheduling",
    description: "Smart calendar that finds optimal lesson times, detects conflicts, and suggests reschedules automatically.",
    icon: "🤖",
  },
  {
    title: "Progress Tracking",
    description: "Visual dashboards show improvement over time with detailed session notes and milestone achievements.",
    icon: "📊",
  },
  {
    title: "Private Work Logs",
    description: "Every session documented with attendance, topics covered, homework assigned, and next steps.",
    icon: "📋",
  },
  {
    title: "Auto Invoicing",
    description: "Generate professional invoices instantly with custom rates, session history, and payment tracking.",
    icon: "💳",
  },
  {
    title: "Rating System",
    description: "Upwork-style tutor ratings with verified reviews, helping you choose the perfect match.",
    icon: "⭐",
  },
  {
    title: "Secure Platform",
    description: "End-to-end encryption, GDPR compliant, and strict privacy controls for your peace of mind.",
    icon: "🔒",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Book Your Free Trial",
    description: "Schedule a complimentary 30-minute session. We'll match you with the perfect tutor based on your goals, learning style, and schedule.",
    image: IMAGES.heroStudent,
  },
  {
    step: "02",
    title: "Experience Personalised Learning",
    description: "Your tutor creates a custom learning plan tailored to your needs. Interactive sessions with real-time progress tracking and AI-enhanced tools.",
    image: IMAGES.tutorSession,
  },
  {
    step: "03",
    title: "Watch Your Grades Soar",
    description: "Track improvements with detailed reports. Our students see an average 2-grade improvement within one academic term.",
    image: IMAGES.studentSuccess,
  },
];

const stats = [
  { value: "94%", label: "Student Success Rate", suffix: "" },
  { value: "50+", label: "Expert Tutors", suffix: "" },
  { value: "10K+", label: "Lessons Delivered", suffix: "" },
  { value: "4.9", label: "Average Rating", suffix: "/5" },
];

const testimonials = [
  {
    quote: "My daughter went from a C to an A* in GCSE Maths in just 3 months. The personalised attention and structured approach made all the difference.",
    author: "Sarah Mitchell",
    role: "Parent of Year 11 Student",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    quote: "The AI scheduling feature saves me hours every week. I can focus entirely on teaching while the platform handles all the admin work.",
    author: "Dr. James Chen",
    role: "Physics Tutor",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
  },
  {
    quote: "Finally, a platform that understands what tutors actually need. The invoice generation alone has transformed my business operations.",
    author: "Emma Thompson",
    role: "English Literature Tutor",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
];

const tutorQualities = [
  {
    title: "Rigorous Vetting",
    description: "Only 8% of tutor applicants pass our 5-stage selection process including background checks and teaching assessments.",
    icon: "✓",
  },
  {
    title: "Subject Experts",
    description: "All tutors hold degrees in their teaching subjects from top UK universities. Many have PGCE qualifications.",
    icon: "🎓",
  },
  {
    title: "Teaching Experience",
    description: "Minimum 2 years of tutoring experience required. Many are former teachers and university lecturers.",
    icon: "👨‍🏫",
  },
  {
    title: "Personality Match",
    description: "We match students with tutors based on learning style, personality, and specific academic goals.",
    icon: "🤝",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "£35",
    period: "/hour",
    description: "Perfect for occasional support and homework help",
    features: [
      "1-to-1 online tutoring",
      "All core subjects",
      "Session recordings",
      "Progress reports",
      "Cancel anytime",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Academic",
    price: "£45",
    period: "/hour",
    description: "Ideal for students aiming for top grades",
    features: [
      "Everything in Starter",
      "Exam preparation focus",
      "Personalised study plan",
      "24/7 messaging support",
      "Parent dashboard access",
      "Mock exam marking",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Elite",
    price: "£65",
    period: "/hour",
    description: "Comprehensive support for ambitious students",
    features: [
      "Everything in Academic",
      "Premium tutor matching",
      "Oxbridge preparation",
      "University admissions support",
      "Priority scheduling",
      "Dedicated account manager",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

const faqs = [
  {
    question: "How does the free trial work?",
    answer: "Your first 30-minute session is completely free with no obligation. It's a chance to meet your tutor, discuss your goals, and experience our platform. If you're not satisfied, we'll match you with a different tutor or there's no charge.",
  },
  {
    question: "What subjects and levels do you cover?",
    answer: "We cover all core subjects from KS2 through A-Level including Maths, English, Science (Physics, Chemistry, Biology), Modern Languages, and Computer Science. We also support 11+ entrance exam preparation and university admissions.",
  },
  {
    question: "How are tutors selected and vetted?",
    answer: "Our rigorous process includes application screening, qualification verification, background checks, teaching demonstration, and reference checks. Only 8% of applicants become MegaStar tutors. All tutors are regularly reviewed based on student outcomes.",
  },
  {
    question: "Can I change my tutor if it's not a good fit?",
    answer: "Absolutely. We understand that the tutor-student relationship is crucial. If you're not completely satisfied, you can switch to a different tutor at any time with no additional fees or questions asked.",
  },
  {
    question: "What technology do I need for online lessons?",
    answer: "All you need is a computer, tablet, or smartphone with a stable internet connection, webcam, and microphone. Our platform works in any modern browser with no downloads required. We recommend headphones for the best experience.",
  },
  {
    question: "How does billing work?",
    answer: "Lessons are billed after each session or monthly, depending on your preference. You'll receive detailed invoices via email and can manage payments through your parent/student dashboard. We accept all major credit cards and bank transfers.",
  },
];

// Animated Counter Component
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
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

  return (
    <span ref={ref}>
      {value.includes(".") ? count + ".9" : count}
      {suffix}
    </span>
  );
}

// FAQ Accordion Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className="faq-icon">{isOpen ? "−" : "+"}</span>
      </button>
      <div className="faq-answer" style={{ maxHeight: isOpen ? "500px" : "0" }}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="public-page">
      <PublicHeader />
      
      <main className="landing">
        {/* Hero Section */}
        <section className="hero-v2">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="pulse-dot"></span>
              Trusted by 500+ families across the UK
            </div>
            <h1>
              Personalised Online Tutoring
              <span className="gradient-text"> That Actually Works</span>
            </h1>
            <p className="hero-subtitle">
              AI-powered scheduling, expert tutors, and proven results. 
              Join 500+ students who&apos;ve improved their grades with MegaStar Tutoring.
            </p>
            <div className="hero-actions-v2">
              <Link href="/sign-up" className="button button-primary button-large">
                Start Your Free Trial
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="#how-it-works" className="button button-outline button-large">
                See How It Works
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                <img src={IMAGES.happyStudent} alt="Student" />
                <img src={IMAGES.tutorProfile} alt="Tutor" />
                <img src={IMAGES.heroStudent} alt="Student" />
              </div>
              <div className="trust-text">
                <div className="trust-stars">⭐⭐⭐⭐⭐</div>
                <span>4.9/5 from 200+ reviews</span>
              </div>
            </div>
          </div>
          <div className="hero-visual-v2">
            <div className="visual-card-main">
              <img src={IMAGES.onlineLearning} alt="Student learning online" />
              <div className="visual-overlay">
                <div className="live-indicator">
                  <span className="live-dot"></span>
                  Live Session
                </div>
              </div>
            </div>
            <div className="floating-card card-progress">
              <div className="progress-circle">
                <svg viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f6feb" strokeWidth="3" strokeDasharray="85, 100"/>
                </svg>
                <span>85%</span>
              </div>
              <div>
                <strong>Maths Progress</strong>
                <span>+12% this month</span>
              </div>
            </div>
            <div className="floating-card card-tutor">
              <img src={IMAGES.tutorProfile} alt="Tutor" />
              <div>
                <strong>Dr. Sarah M.</strong>
                <span>Physics Specialist</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="stat-value-v2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="stat-label-v2">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Subjects Section */}
        <section className="subjects-section">
          <div className="section-header centered">
            <span className="section-eyebrow">Comprehensive Coverage</span>
            <h2>Expert Tutoring in Every Subject</h2>
            <p>From primary school to A-Levels, we&apos;ve got every subject covered with specialist tutors who know exactly how to help you succeed.</p>
          </div>
          <div className="subjects-grid">
            {subjectList.map((subject, i) => (
              <div 
                key={subject.name} 
                className="subject-card"
                style={{ 
                  animationDelay: `${i * 0.05}s`,
                  borderColor: `${subject.color}20`,
                }}
              >
                <span className="subject-icon" style={{ background: `${subject.color}15`, color: subject.color }}>
                  {subject.icon}
                </span>
                <span className="subject-name">{subject.name}</span>
              </div>
            ))}
          </div>
          <div className="subjects-cta">
            <Link href="/sign-up" className="button button-primary">
              Find Your Perfect Subject Match
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header centered">
            <span className="section-eyebrow">Platform Features</span>
            <h2>Everything You Need to Succeed</h2>
            <p>Our platform combines cutting-edge AI technology with human expertise to deliver the best tutoring experience possible.</p>
          </div>
          <div className="features-grid-v2">
            {features.map((feature, i) => (
              <div key={feature.title} className="feature-card-v2" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon-v2">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="section-header centered">
            <span className="section-eyebrow">Simple Process</span>
            <h2>Three Steps to Academic Success</h2>
            <p>Getting started is easy. We&apos;ve streamlined the process so you can focus on what matters - learning.</p>
          </div>
          <div className="steps-container">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="step-card" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <div className="step-image">
                    <img src={step.image} alt={step.title} />
                  </div>
                  <div className="step-text">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tutor Quality Section */}
        <section className="tutor-quality-section">
          <div className="quality-layout">
            <div className="quality-content">
              <span className="section-eyebrow">Elite Tutors</span>
              <h2>Only the Best Make the Cut</h2>
              <p>We accept just 8% of tutor applicants. Every MegaStar tutor is rigorously vetted, thoroughly trained, and continuously evaluated to ensure exceptional teaching quality.</p>
              <div className="quality-features">
                {tutorQualities.map((quality, i) => (
                  <div key={quality.title} className="quality-item" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="quality-icon">{quality.icon}</div>
                    <div>
                      <h4>{quality.title}</h4>
                      <p>{quality.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="quality-visual">
              <img src={IMAGES.studyGroup} alt="Students studying together" />
              <div className="quality-badge">
                <span className="badge-number">8%</span>
                <span className="badge-text">Acceptance Rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="section-header centered">
            <span className="section-eyebrow">Success Stories</span>
            <h2>Loved by Students and Parents</h2>
            <p>Don&apos;t just take our word for it. Here&apos;s what families and tutors say about working with MegaStar.</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="testimonial-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="testimonial-stars">
                  {"⭐".repeat(testimonial.rating)}
                </div>
                <blockquote>&ldquo;{testimonial.quote}&rdquo;</blockquote>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.author} />
                  <div>
                    <strong>{testimonial.author}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="trust-badges">
            <div className="trust-badge">
              <span className="badge-icon">✓</span>
              <span>DBS Checked</span>
            </div>
            <div className="trust-badge">
              <span className="badge-icon">✓</span>
              <span>GDPR Compliant</span>
            </div>
            <div className="trust-badge">
              <span className="badge-icon">✓</span>
              <span>Qualified Teachers</span>
            </div>
            <div className="trust-badge">
              <span className="badge-icon">✓</span>
              <span>Money Back Guarantee</span>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <div className="section-header centered">
            <span className="section-eyebrow">Transparent Pricing</span>
            <h2>Simple, Fair Pricing for Every Budget</h2>
            <p>No hidden fees, no long-term contracts. Pay only for the lessons you need.</p>
          </div>
          <div className="pricing-grid">
            {pricingTiers.map((tier, i) => (
              <div 
                key={tier.name} 
                className={`pricing-card ${tier.popular ? "popular" : ""}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {tier.popular && <div className="popular-badge">Most Popular</div>}
                <h3>{tier.name}</h3>
                <div className="pricing-price">
                  <span className="currency">{tier.price}</span>
                  <span className="period">{tier.period}</span>
                </div>
                <p className="pricing-description">{tier.description}</p>
                <ul className="pricing-features">
                  {tier.features.map((feature) => (
                    <li key={feature}>
                      <span className="check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={tier.name === "Elite" ? "/contact" : "/sign-up"} 
                  className={`button ${tier.popular ? "button-primary" : "button-outline"} button-full`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-header centered">
            <span className="section-eyebrow">Common Questions</span>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about MegaStar Tutoring.</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section-v2">
          <div className="cta-content">
            <h2>Ready to Transform Your Grades?</h2>
            <p>Join 500+ students who&apos;ve achieved their academic goals with MegaStar Tutoring. Your first session is completely free.</p>
            <div className="cta-buttons">
              <Link href="/sign-up" className="button button-primary button-large">
                Start Free Trial
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/sign-in" className="button button-white button-large">
                Tutor Login
              </Link>
            </div>
            <div className="cta-guarantee">
              <span>🛡️</span>
              <span>30-day money-back guarantee • No credit card required</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="brand-lockup">
                <div className="brand-mark">M</div>
                <div>
                  <div className="brand-name">MegaStar Tutoring</div>
                  <div className="brand-tagline">Excellence in Education</div>
                </div>
              </div>
              <p>AI-powered tutoring platform helping students achieve academic excellence through personalised, expert-led online lessons.</p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="Instagram">📷</a>
                <a href="#" aria-label="LinkedIn">💼</a>
              </div>
            </div>
            <div className="footer-links">
              <h4>For Students</h4>
              <Link href="#">Find a Tutor</Link>
              <Link href="#">Subjects</Link>
              <Link href="#">Pricing</Link>
              <Link href="#">Success Stories</Link>
            </div>
            <div className="footer-links">
              <h4>For Tutors</h4>
              <Link href="#">Become a Tutor</Link>
              <Link href="#">Tutor Resources</Link>
              <Link href="#">Platform Guide</Link>
              <Link href="#">Support</Link>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <Link href="#">About Us</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Contact</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 MegaStar Tutoring. All rights reserved.</p>
            <div className="footer-legal">
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Cookie Policy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
