import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientPlanPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);

  const planItems = (overview.upcomingSessions.length ? overview.upcomingSessions : overview.recentSessions).slice(0, 5);

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Weekly plan</h2>
            <p>Your lessons laid out clearly for the week.</p>
          </div>
        </div>
        <div className="student-timeline">
          {planItems.length ? (
            planItems.map((session) => (
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
            <div className="empty-state">Your weekly plan will appear here.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Plan details</h2>
            <p>A few simple facts that help you stay on track.</p>
          </div>
        </div>
        <div className="workspace-grid">
          <div className="list-card">
            <strong>{overview.clientCount}</strong>
            <span>Lesson profiles</span>
          </div>
          <div className="list-card">
            <strong>{overview.activeSessionCount}</strong>
            <span>Upcoming lessons</span>
          </div>
          <div className="list-card">
            <strong>{overview.syncs[0] ? "Connected" : "Ready"}</strong>
            <span>{overview.syncs[0] ? overview.syncs[0].statusMessage : "Calendar sync is ready."}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
