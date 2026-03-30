import Link from "next/link";
import { formatMoney, formatShortDateTime, formatScore } from "@/lib/format";
import { getWorkspaceOverview, isAppDatabaseReady } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function DashboardPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);
  const databaseReady = isAppDatabaseReady();

  const actionItems = [
    overview.missedSessionCount > 0
      ? `${overview.missedSessionCount} missed session${overview.missedSessionCount === 1 ? "" : "s"} need a follow-up`
      : "No missed sessions are waiting right now",
    overview.activeSessionCount > 0
      ? `${overview.activeSessionCount} planned session${overview.activeSessionCount === 1 ? "" : "s"} are lined up`
      : "Add sessions to start tracking the week",
    overview.ratingAverage > 0
      ? `Tutor score is sitting at ${formatScore(overview.ratingAverage)}`
      : "Rating history will appear once clients leave verified feedback",
  ];

  return (
    <div className="workspace-grid">
      <section className="workspace-grid cols-3">
        <article className="panel">
          <div className="stat-value">{overview.clientCount}</div>
          <div className="stat-label">Private clients</div>
        </article>
        <article className="panel">
          <div className="stat-value">{overview.sessionCount}</div>
          <div className="stat-label">Tracked sessions</div>
        </article>
        <article className="panel">
          <div className="stat-value">{formatMoney(overview.billableTotal)}</div>
          <div className="stat-label">Billable total</div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Today&apos;s plan</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Client</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {overview.upcomingSessions.length ? (
                overview.upcomingSessions.map((session) => {
                  const client = overview.clients.find((item) => item.id === session.clientId);
                  return (
                    <tr key={session.id}>
                      <td>{formatShortDateTime(session.startsAt)}</td>
                      <td>
                        <strong>{client?.name || session.title}</strong>
                        <div className="table-subtle">{session.notes || "No notes yet"}</div>
                      </td>
                      <td>
                        <span className={`pill ${session.status === "missed" ? "danger" : session.status === "completed" ? "success" : "neutral"}`}>
                          {session.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>No planned sessions yet. Add one from the Sessions page.</td>
                </tr>
              )}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <h2>Action queue</h2>
          <div className="workspace-grid">
            {actionItems.map((item) => (
              <div key={item} className="list-card">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="workspace-grid cols-3">
        <article className="panel">
          <h2>Clients that need a glance</h2>
          <div className="workspace-grid">
            {overview.recentClients.length ? (
              overview.recentClients.map((client) => (
                <div key={client.id} className="client-card">
                  <strong>{client.name}</strong>
                  <span>{client.preferredDays || "No preferred days saved"}</span>
                  <span>{formatMoney(client.rateCents)} per session</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Start by adding a client profile.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>Recent sessions</h2>
          <div className="workspace-grid">
            {overview.recentSessions.length ? (
              overview.recentSessions.map((session) => (
                <div key={session.id} className="list-card">
                  <strong>{session.title}</strong>
                  <div className="table-subtle">{formatShortDateTime(session.startsAt)}</div>
                  <div className="table-subtle">
                    {session.billable ? formatMoney(session.amountCents) : "Not billable"}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">The session log will fill as you add lessons.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>Workspace health</h2>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>{databaseReady ? "Database ready" : "Local demo mode"}</strong>
              <span>{databaseReady ? "Real data will persist in Neon." : "Set DATABASE_URL to turn on the live database."}</span>
            </div>
            <div className="list-card">
              <strong>{overview.syncs[0] ? "Google sync active" : "Calendar not synced"}</strong>
              <span>{overview.syncs[0] ? overview.syncs[0].statusMessage : "Connect Google Calendar from the Calendar page."}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="action-row">
        <Link className="button button-primary" href="/app/clients">
          Manage clients
        </Link>
        <Link className="button button-secondary" href="/app/calendar">
          Open calendar sync
        </Link>
        <Link className="button button-secondary" href="/app/invoices">
          Review invoices
        </Link>
      </section>
    </div>
  );
}
