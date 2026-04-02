import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

function getSessionStatusLabel(status: string) {
  if (status === "partial") {
    return "Live";
  }

  return status;
}

function getSessionStatusTone(status: string) {
  if (status === "completed") {
    return "room-status-chip-saved";
  }
  if (status === "missed") {
    return "room-status-chip-active";
  }
  if (status === "partial") {
    return "room-status-chip-live room-status-chip-pulse";
  }
  if (status === "rescheduled") {
    return "room-status-chip-sync";
  }
  return "room-status-chip-present";
}

export default async function ClientSessionsPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;

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
          overview.sessions.slice(0, 8).map((session: (typeof overview.sessions)[number]) => (
            <div key={session.id} className="student-timeline-row">
              <div>
                <strong>{session.title}</strong>
              <span>{formatShortDateTime(session.startsAt, market)}</span>
              </div>
              <span className={`room-status-chip ${getSessionStatusTone(session.status)}`}>
                {getSessionStatusLabel(session.status)}
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
