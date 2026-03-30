import Link from "next/link";
import { PublicHeader } from "@/components/public-header";

const featureList = [
  {
    title: "Private client scheduling",
    copy: "Keep every client separate, with calendar sync, reschedules, and attendance tracking built in.",
  },
  {
    title: "Private invoice export",
    copy: "Generate one-client-at-a-time invoices with the right totals and no cross-client leakage.",
  },
  {
    title: "AI workspace assistant",
    copy: "Get suggested actions, schedule gaps, billing prompts, and daily priorities without extra admin work.",
  },
];

const milestones = [
  ["Sprint 1", "Foundation, auth, and shell"],
  ["Sprint 2", "Clients, scheduling, and Google Calendar sync"],
  ["Sprint 3", "Session logs, missed-session detection, and invoices"],
  ["Sprint 4", "Ratings, AI helper, and client portal"],
];

export default function HomePage() {
  return (
    <div className="public-page">
      <PublicHeader />
      <main className="landing">
        <section className="hero">
          <div>
            <span className="eyebrow">MegaStar Tutoring</span>
            <h1>One tutor platform for scheduling, billing, ratings, and AI.</h1>
            <p>
              A clean web app for tutors who manage multiple clients, plan availability from the calendar, and export
              private invoices without mixing anyone else&apos;s data.
            </p>
            <div className="hero-actions">
              <Link href="/app" className="button button-primary">
                Open tutor app
              </Link>
              <Link href="/dashboard" className="button button-secondary">
                See client portal
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-title">
              <span>Today&apos;s workspace</span>
              <span>Live on Vercel</span>
            </div>
            <div className="visual-grid">
              <div className="visual-card">
                <div className="metric">12</div>
                <div className="metric-label">active sessions this week</div>
              </div>
              <div className="visual-card">
                <div className="metric">4</div>
                <div className="metric-label">clients need attention</div>
              </div>
              <div className="visual-card large">
                <div className="metric">AI + calendar + invoices</div>
                <div className="metric-label">
                  A single workflow for missed session detection, reschedule suggestions, tutor ratings, and private
                  exports.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>Core value</h2>
            <p>The product starts as a tutor operating system, then grows into a client portal and broader platform.</p>
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
            <h2>Build sequence</h2>
            <p>A focused rollout keeps the app stable while each layer is added in the right order.</p>
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
            <strong>Built for tutors who want to stand out.</strong>
            <p>Private scheduling, Upwork-style tutor ratings, AI help, and invoicing that never exposes other clients.</p>
          </div>
          <Link href="/app" className="button button-primary">
            Start building
          </Link>
        </section>
      </main>
    </div>
  );
}
