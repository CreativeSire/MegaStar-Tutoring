import Link from "next/link";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

const starterSteps = [
  { title: "Check your first lesson", detail: "See the next time you're due to meet." },
  { title: "Save the weekly rhythm", detail: "Keep your lessons in a simple pattern." },
  { title: "Send a time change", detail: "If a lesson moves, ask for a new slot." },
  { title: "Read the latest note", detail: "Your tutor's message appears after lessons." },
  { title: "Ask for a new time", detail: "Use this if a lesson needs to move." },
];

export default async function ClientStartPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Start here</h2>
            <p>Everything you need for a smooth first week.</p>
          </div>
        </div>
        <div className="workspace-grid">
          {starterSteps.map((step, index) => (
            <div key={step.title} className="student-action-row">
              <span className="student-action-dot" />
              <div>
                <strong>{index + 1}. {step.title}</strong>
                <div className="table-subtle">{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Your lesson snapshot</h2>
            <p>A quick look at what&apos;s already in place.</p>
          </div>
        </div>
        <div className="student-pills">
          <div className="student-pill">
            <strong>{overview.sessionCount}</strong>
            <span>Lessons planned</span>
          </div>
          <div className="student-pill">
            <strong>{overview.completedSessionCount}</strong>
            <span>Lessons done</span>
          </div>
          <div className="student-pill">
            <strong>{overview.missedSessionCount}</strong>
            <span>Need a follow-up</span>
          </div>
          <div className="student-pill">
            <strong>{overview.clients.length}</strong>
            <span>Lesson profiles</span>
          </div>
        </div>
        <div className="workspace-grid cols-2" style={{ marginTop: 16 }}>
          <div className="list-card">
            <strong>{overview.preferences.preferredDays || "Not set"}</strong>
            <span>Weekly rhythm</span>
          </div>
          <div className="list-card">
            <strong>{overview.preferences.lessonLengthMinutes} min</strong>
            <span>Lesson length</span>
          </div>
        </div>
        <div className="action-row">
          <Link className="button button-primary" href="/dashboard/sessions">
            View lessons
          </Link>
          <Link className="button button-secondary" href="/dashboard/reschedule">
            Change a time
          </Link>
        </div>
      </section>
    </div>
  );
}

