import Link from "next/link";
import { PublicHeader } from "@/components/public-header";

const subjectList = ["Maths", "English", "Science", "11+", "GCSE", "A-level"];

const featureList = [
  {
    title: "Simple lesson planning",
    copy: "See who you&apos;re meeting, when they&apos;re meeting you, and what needs rescheduling.",
  },
  {
    title: "Clear lesson history",
    copy: "Every session stays in one neat timeline with notes, status, and next steps.",
  },
  {
    title: "Helpful AI support",
    copy: "Get gentle suggestions for free slots, missed lessons, and follow-ups.",
  },
];

const milestones = [
  ["Get started", "Create your account and add your first lesson plan"],
  ["Stay organised", "Keep sessions, calendar, and notes in one place"],
  ["Keep it moving", "Spot missed lessons and suggest the next best time"],
  ["Share progress", "Export private invoices and simple tutor reviews"],
];

export default function HomePage() {
  return (
    <div className="public-page">
      <PublicHeader />
      <main className="landing">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">MegaStar Tutoring</span>
            <h1>Beautiful tutoring tools for lessons, calendars, and progress.</h1>
            <p>
              A calm, easy-to-use web app for tutors and families who want lessons organised without the admin noise.
            </p>
            <div className="hero-actions">
              <Link href="/app" className="button button-primary">
                Open dashboard
              </Link>
              <Link href="/dashboard" className="button button-secondary">
                View student area
              </Link>
            </div>
            <div className="hero-badges" aria-label="Popular subjects">
              {subjectList.map((subject) => (
                <span key={subject} className="subject-pill">
                  {subject}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <div className="stage-card stage-main">
              <div className="stage-head">
                <span>Today</span>
                <span>Monday</span>
              </div>
              <div className="lesson-row active">
                <div>
                  <strong>Science</strong>
                  <span>4:00 pm · Nina</span>
                </div>
                <span>Ready</span>
              </div>
              <div className="lesson-row">
                <div>
                  <strong>Maths</strong>
                  <span>5:30 pm · Oliver</span>
                </div>
                <span>Booked</span>
              </div>
              <div className="lesson-row">
                <div>
                  <strong>English</strong>
                  <span>7:00 pm · Ava</span>
                </div>
                <span>Needs a reply</span>
              </div>
            </div>
            <div className="stage-card stage-side">
              <span className="stage-kicker">Next best slot</span>
              <strong>Wednesday, 3:30 pm</strong>
              <p>Perfect for a reschedule or a new lesson.</p>
              <div className="stage-meter">
                <span />
              </div>
              <small>Fast to scan. Easy to manage.</small>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>What it helps with</h2>
            <p>Everything stays simple: lessons, schedules, notes, and invoices in one place.</p>
          </div>
          <div className="feature-grid">
            {featureList.map((item) => (
              <article key={item.title} className="feature">
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>How it works</h2>
            <p>A clear flow helps tutors and families move from lesson planning to progress in a few taps.</p>
          </div>
          <div className="timeline">
            {milestones.map(([step, detail]) => (
              <div key={step} className="timeline-item">
                <div className="timeline-step">{step}</div>
                <div>{detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-band">
          <div>
            <strong>Built for tutors who want a cleaner day.</strong>
            <p>Friendly lesson planning, simple progress tracking, and private invoices without the clutter.</p>
          </div>
          <Link href="/app" className="button button-primary">
            Start building
          </Link>
        </section>
      </main>
    </div>
  );
}
