import Link from "next/link";
import { formatMoney, formatScore } from "@/lib/format";
import { getMarketProfile } from "@/lib/market";
import { WorkspacePreferencesForm } from "@/components/workspace-preferences-form";
import { getWorkspaceOverview, isAppDatabaseReady } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

const setupChecks = [
  { label: "Add the first student", detail: "Create a private profile for each student." },
  { label: "Set the weekly rhythm", detail: "Choose how often you meet and which days matter most." },
  { label: "Connect the calendar", detail: "Bring lessons into one place so time stays clear." },
  { label: "Try a time change", detail: "Send one request so the flow stays easy to use." },
  { label: "Write the first note", detail: "Keep each lesson easy to follow." },
];

export default async function StartPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);
  const databaseReady = isAppDatabaseReady();
  const hasCalendar = Boolean(overview.syncs[0]);
  const hasStudents = overview.clients.length > 0;
  const hasLessons = overview.sessions.length > 0;
  const marketProfile = getMarketProfile(overview.preferences.market);
  const market = overview.preferences.market;
  const onboardingPreferences = {
    market: overview.preferences.market,
    preferredDays: overview.preferences.preferredDays,
    lessonLengthMinutes: overview.preferences.lessonLengthMinutes,
    primaryGoal: overview.preferences.primaryGoal,
    onboardingCompletedAt: overview.preferences.onboardingCompletedAt?.toISOString() ?? null,
  };

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Start here</h2>
            <p>A simple place to get the tutoring space ready.</p>
          </div>
        </div>

        <div className="workspace-grid">
          <div className="list-card">
            <strong>{actor.role === "admin" ? "You have full access" : "Your view is ready"}</strong>
            <span>Keep everything private and easy to follow.</span>
          </div>
          <div className="list-card">
            <strong>{databaseReady ? "Data is saving" : "Local preview"}</strong>
            <span>{databaseReady ? "Real records are stored for you." : "Add DATABASE_URL for live storage."}</span>
          </div>
          <div className="list-card">
            <strong>{marketProfile.label}</strong>
            <span>{marketProfile.currency} · Market profile</span>
          </div>
          <div className="list-card">
            <strong>{hasCalendar ? "Calendar connected" : "Calendar ready"}</strong>
            <span>{hasCalendar ? overview.syncs[0]?.statusMessage : "Connect Google Calendar when you want it."}</span>
          </div>
          <div className="list-card">
            <strong>{hasStudents ? `${overview.clientCount} student profile${overview.clientCount === 1 ? "" : "s"}` : "No student profiles yet"}</strong>
            <span>{hasLessons ? `${overview.sessionCount} lesson${overview.sessionCount === 1 ? "" : "s"} recorded` : "Lessons will appear after you add them."}</span>
          </div>
        </div>
      </section>

      <WorkspacePreferencesForm preferences={onboardingPreferences} />

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Next steps</h2>
            <p>Follow these once and the rest becomes easy.</p>
          </div>
        </div>
        <div className="student-actions">
          {setupChecks.map((item, index) => (
            <div key={item.label} className="student-action-row">
              <span className="student-action-dot" />
              <div>
                <strong>{index + 1}. {item.label}</strong>
                <div className="table-subtle">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="workspace-grid cols-2" style={{ marginTop: 16 }}>
          <div className="list-card">
            <strong>{formatMoney(overview.billableTotal, market)}</strong>
            <span>Current payment total</span>
          </div>
          <div className="list-card">
            <strong>{formatScore(overview.ratingAverage || 0, market)}</strong>
            <span>Average tutor rating</span>
          </div>
          <div className="list-card">
            <strong>{overview.preferences.lessonLengthMinutes} min</strong>
            <span>Lesson length</span>
          </div>
          <div className="list-card">
            <strong>{overview.preferences.preferredDays || "Not set"}</strong>
            <span>Preferred days</span>
          </div>
        </div>

        <div className="action-row" style={{ marginTop: 18 }}>
          <Link className="button button-primary" href="/app/clients">
            Add a student
          </Link>
          <Link className="button button-secondary" href="/app/calendar">
            Open calendar
          </Link>
        </div>
      </section>
    </div>
  );
}
