import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function AlertsPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);

  const alerts = [
    overview.missedSessionCount > 0
      ? `${overview.missedSessionCount} lesson${overview.missedSessionCount === 1 ? "" : "s"} need a follow-up.`
      : "No lessons need a follow-up right now.",
    overview.syncs[0]
      ? `Calendar is connected and last updated ${formatShortDateTime(overview.syncs[0].lastSyncedAt)}.`
      : "Calendar is ready to connect.",
    overview.ratingAverage > 0
      ? `Tutor rating is ${overview.ratingAverage.toFixed(1)} out of 5.`
      : "Ratings will appear after lessons are reviewed.",
  ];

  return (
    <section className="panel">
      <div className="section-head compact">
        <div>
          <h2>Alerts</h2>
          <p>Things worth checking today.</p>
        </div>
      </div>
      <div className="workspace-grid cols-2">
        {alerts.map((alert) => (
          <article key={alert} className="list-card">
            {alert}
          </article>
        ))}
        <article className="list-card">
          <strong>Upcoming lessons</strong>
          <span>{overview.upcomingSessions.length ? `${overview.upcomingSessions.length} lesson${overview.upcomingSessions.length === 1 ? "" : "s"} lined up` : "No lessons lined up yet."}</span>
        </article>
        <article className="list-card">
          <strong>Student count</strong>
          <span>{overview.clientCount} profile{overview.clientCount === 1 ? "" : "s"} ready</span>
        </article>
      </div>
    </section>
  );
}
