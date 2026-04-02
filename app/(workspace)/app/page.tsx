import Link from "next/link";
import { formatMoney, formatShortDateTime, formatScore } from "@/lib/format";
import { getWorkspaceOverview, isAppDatabaseReady } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function DashboardPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);
  const databaseReady = isAppDatabaseReady();
  const market = overview.preferences.market;

  const actionItems = [
    overview.missedSessionCount > 0
      ? `${overview.missedSessionCount} lesson${overview.missedSessionCount === 1 ? "" : "s"} need a follow-up`
      : "No lessons need attention right now",
    overview.scheduleRequests.length > 0
      ? `${overview.scheduleRequests.length} time change${overview.scheduleRequests.length === 1 ? "" : "s"} are waiting`
      : "No new time changes are waiting",
    overview.activeSessionCount > 0
      ? `${overview.activeSessionCount} lesson${overview.activeSessionCount === 1 ? "" : "s"} are lined up`
      : "Add lessons to start planning the week",
    overview.ratingAverage > 0
      ? `Your tutor score is sitting at ${formatScore(overview.ratingAverage, market)}`
      : "Ratings will appear once students leave feedback",
  ];

  return (
    <div className="workspace-grid">
      <section className="workspace-grid cols-3">
        <article className="panel">
          <div className="stat-value">{overview.clientCount}</div>
          <div className="stat-label">Students</div>
        </article>
        <article className="panel">
          <div className="stat-value">{overview.sessionCount}</div>
          <div className="stat-label">Lessons</div>
        </article>
        <article className="panel">
          <div className="stat-value">{formatMoney(overview.billableTotal, market)}</div>
          <div className="stat-label">Total due</div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Today&apos;s lessons</h2>
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
                overview.upcomingSessions.map((session: (typeof overview.upcomingSessions)[number]) => {
                  const client = overview.clients.find((item) => item.id === session.clientId);
                  return (
                    <tr key={session.id}>
                      <td>{formatShortDateTime(session.startsAt, market)}</td>
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
                  <td colSpan={3}>No lessons yet. Add one from the Lessons page.</td>
                </tr>
              )}
            </tbody>
          </table>
        </article>

        <article className="panel">
          <h2>What needs attention</h2>
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
          <h2>Students to keep an eye on</h2>
          <div className="workspace-grid">
            {overview.recentClients.length ? (
              overview.recentClients.map((client) => (
                <div key={client.id} className="client-card">
                  <strong>{client.name}</strong>
                  <span>{client.preferredDays || "No preferred days saved"}</span>
                  <span>{formatMoney(client.rateCents, market)} per session</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Start by adding a student profile.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>Recent lessons</h2>
          <div className="workspace-grid">
            {overview.recentSessions.length ? (
              overview.recentSessions.map((session: (typeof overview.recentSessions)[number]) => (
                <div key={session.id} className="list-card">
                  <strong>{session.title}</strong>
                  <div className="table-subtle">{formatShortDateTime(session.startsAt, market)}</div>
                  <div className="table-subtle">
                    {session.billable ? formatMoney(session.amountCents, market) : "Not billable"}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">Your lesson history will fill as you add lessons.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>Setup</h2>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>{databaseReady ? "Data is saved" : "Demo mode"}</strong>
              <span>{databaseReady ? "Real data will persist in Neon." : "Set DATABASE_URL to turn on the live database."}</span>
            </div>
            <div className="list-card">
              <strong>{overview.preferences.onboardingCompletedAt ? "Setup complete" : "Setup waiting"}</strong>
              <span>
                {overview.preferences.onboardingCompletedAt
                  ? `${overview.preferences.preferredDays || "No days chosen"} · ${overview.preferences.lessonLengthMinutes} min lessons`
                  : "Open Start here to set the weekly rhythm."}
              </span>
            </div>
            <div className="list-card">
              <strong>{overview.syncs[0] ? "Calendar connected" : "Calendar not connected"}</strong>
              <span>{overview.syncs[0] ? overview.syncs[0].statusMessage : "Connect Google Calendar from the Calendar page."}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="action-row">
        <Link className="button button-primary" href="/app/clients">
          Add students
        </Link>
        <Link className="button button-secondary" href="/classroom">
          Open classroom
        </Link>
        <Link className="button button-secondary" href="/app/calendar">
          Open calendar
        </Link>
        <Link className="button button-secondary" href="/app/notes">
          Lesson notes
        </Link>
        <Link className="button button-secondary" href="/app/messages">
          Messages
        </Link>
        <Link className="button button-secondary" href="/app/alerts">
          View reminders
        </Link>
        <Link className="button button-secondary" href="/app/invoices">
          View invoices
        </Link>
        <Link className="button button-secondary" href="/app/library">
          Lesson library
        </Link>
        <Link className="button button-secondary" href="/app/compliance">
          Review trail
        </Link>
      </section>
    </div>
  );
}
