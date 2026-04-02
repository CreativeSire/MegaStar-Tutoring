import { SessionForm } from "@/components/session-form";
import { SessionActions } from "@/components/session-actions";
import { formatMoney, formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview, listSessions } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

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

export default async function SessionsPage() {
  const actor = await requireActor();
  const [overview, sessions] = await Promise.all([getWorkspaceOverview(actor), listSessions(actor)]);
  const market = overview.preferences.market;
  const plannedCount = sessions.filter((session: (typeof sessions)[number]) => session.status === "planned").length;
  const completedCount = sessions.filter((session: (typeof sessions)[number]) => session.status === "completed").length;
  const missedCount = sessions.filter((session: (typeof sessions)[number]) => session.status === "missed").length;

  return (
    <div className="workspace-grid">
      <section className="workspace-grid cols-3">
        <article className="panel">
          <div className="stat-value">{plannedCount}</div>
          <div className="stat-label">Planned lessons</div>
        </article>
        <article className="panel">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed lessons</div>
        </article>
        <article className="panel">
          <div className="stat-value">{missedCount}</div>
          <div className="stat-label">Need a follow-up</div>
        </article>
      </section>

      <div className="workspace-grid cols-2">
        <SessionForm
          clients={overview.clients.map((client) => ({
            id: client.id,
            name: client.name,
            billTo: client.billTo,
          }))}
        />

        <section className="panel">
          <h2>Lesson log</h2>
          <p className="stat-label">Everything in one tidy list.</p>
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Student</th>
                <th>Status</th>
                <th>Billable</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length ? (
                sessions.map((session: (typeof sessions)[number]) => {
                  const client = overview.clients.find((item) => item.id === session.clientId);
                return (
                  <tr key={session.id}>
                    <td>{formatShortDateTime(session.startsAt, market)}</td>
                    <td>
                      <strong>{client?.name || session.title}</strong>
                      <div className="table-subtle">{session.source}</div>
                    </td>
                    <td>
                      <span className={`room-status-chip ${getSessionStatusTone(session.status)}`}>
                        {getSessionStatusLabel(session.status)}
                      </span>
                      <SessionActions sessionId={session.id} currentStatus={session.status} />
                    </td>
                    <td>
                      <div>{session.billable ? "Yes" : "No"}</div>
                      <div className="table-subtle">{formatMoney(session.amountCents, market)}</div>
                    </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>No lesson records yet. Add the first lesson on the left.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
