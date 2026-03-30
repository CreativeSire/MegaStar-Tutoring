import { formatMoney, formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientInvoicesPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);

  return (
    <section className="panel">
      <div className="section-head compact">
        <div>
          <h2>Payments</h2>
          <p>Only your own billing history appears here.</p>
        </div>
      </div>
      <div className="student-summary">
        <div className="list-card">
          <strong>{formatMoney(overview.billableTotal)}</strong>
          <span>Current total</span>
        </div>
        <div className="list-card">
          <strong>{overview.sessionCount}</strong>
          <span>Total lessons</span>
        </div>
      </div>
      <div className="student-timeline" style={{ marginTop: 16 }}>
        {overview.recentSessions.length ? (
          overview.recentSessions.map((session) => (
            <div key={session.id} className="student-timeline-row">
              <div>
                <strong>{session.title}</strong>
                <span>{formatShortDateTime(session.startsAt)}</span>
              </div>
              <span>{session.billable ? formatMoney(session.amountCents) : "Not billed"}</span>
            </div>
          ))
        ) : (
          <div className="empty-state">Payment history will appear after the first lesson.</div>
        )}
      </div>
    </section>
  );
}
