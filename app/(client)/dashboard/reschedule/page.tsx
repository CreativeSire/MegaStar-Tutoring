import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

const reasonChoices = ["School event", "Travel day", "Illness", "Need a different time"];

export default async function ClientReschedulePage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const nextLesson = overview.upcomingSessions[0] || overview.recentSessions[0] || null;

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Change a time</h2>
            <p>Ask for a better slot when a lesson needs to move.</p>
          </div>
        </div>
        <div className="workspace-grid">
          {nextLesson ? (
            <div className="list-card">
              <strong>{nextLesson.title}</strong>
              <span>{formatShortDateTime(nextLesson.startsAt)}</span>
              <span>{nextLesson.notes || "A short note from your tutor will appear here."}</span>
            </div>
          ) : (
            <div className="empty-state">Your next lesson will appear here when one is booked.</div>
          )}
          <div className="list-card">
            <strong>Tell us what changed</strong>
            <span>Pick a reason and share the time that works better.</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Good reasons</h2>
            <p>Choose the closest match.</p>
          </div>
        </div>
        <div className="workspace-grid cols-2">
          {reasonChoices.map((reason) => (
            <div key={reason} className="list-card">
              {reason}
            </div>
          ))}
        </div>
        <div className="action-row" style={{ marginTop: 18 }}>
          <button className="button button-primary" type="button">
            Send request
          </button>
          <button className="button button-secondary" type="button">
            Keep this time
          </button>
        </div>
      </section>
    </div>
  );
}
