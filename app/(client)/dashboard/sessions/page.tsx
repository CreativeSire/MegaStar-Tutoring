import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientSessionsPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);

  return (
    <section className="panel">
      <div className="section-head compact">
        <div>
          <h2>Lessons</h2>
          <p>Completed, planned, and rescheduled lessons stay in one tidy list.</p>
        </div>
      </div>
      <div className="student-timeline">
        {overview.sessions.length ? (
          overview.sessions.slice(0, 8).map((session) => (
            <div key={session.id} className="student-timeline-row">
              <div>
                <strong>{session.title}</strong>
                <span>{formatShortDateTime(session.startsAt)}</span>
              </div>
              <span className={`pill ${session.status === "missed" ? "danger" : session.status === "completed" ? "success" : "neutral"}`}>
                {session.status}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-state">Your lessons will show up here.</div>
        )}
      </div>
    </section>
  );
}
