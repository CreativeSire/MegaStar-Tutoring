import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientUpdatesPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);

  const updates = [
    overview.syncs[0]
      ? `Calendar last updated ${formatShortDateTime(overview.syncs[0].lastSyncedAt)}.`
      : "Calendar is ready to connect.",
    overview.missedSessionCount > 0
      ? `${overview.missedSessionCount} lesson${overview.missedSessionCount === 1 ? "" : "s"} need a follow-up.`
      : "No lesson needs a follow-up right now.",
    overview.recentSessions.length
      ? `Latest lesson: ${overview.recentSessions[0].title}.`
      : "Your latest lesson will appear here.",
  ];

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Updates</h2>
            <p>Short reminders from your lessons and calendar.</p>
          </div>
        </div>
        <div className="workspace-grid">
          {updates.map((update) => (
            <div key={update} className="list-card">
              {update}
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Recent lessons</h2>
            <p>The latest thing you covered.</p>
          </div>
        </div>
        <div className="student-timeline">
          {overview.recentSessions.length ? (
            overview.recentSessions.slice(0, 4).map((session) => (
              <div key={session.id} className="student-timeline-row">
                <div>
                  <strong>{session.title}</strong>
                  <span>{session.notes || "No note added yet."}</span>
                </div>
                <span className={`pill ${session.status === "missed" ? "danger" : session.status === "completed" ? "success" : "neutral"}`}>
                  {session.status}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-state">Updates will appear here after the first lesson.</div>
          )}
        </div>
      </section>
    </div>
  );
}
