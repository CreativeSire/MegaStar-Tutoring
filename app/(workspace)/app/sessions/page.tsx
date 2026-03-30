import { SessionForm } from "@/components/session-form";
import { formatMoney, formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview, listSessions } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function SessionsPage() {
  const actor = await requireActor();
  const [overview, sessions] = await Promise.all([getWorkspaceOverview(actor), listSessions(actor)]);
  const plannedCount = sessions.filter((session) => session.status === "planned").length;
  const completedCount = sessions.filter((session) => session.status === "completed").length;
  const missedCount = sessions.filter((session) => session.status === "missed").length;

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
                sessions.map((session) => {
                  const client = overview.clients.find((item) => item.id === session.clientId);
                  return (
                    <tr key={session.id}>
                      <td>{formatShortDateTime(session.startsAt)}</td>
                      <td>
                        <strong>{client?.name || session.title}</strong>
                        <div className="table-subtle">{session.source}</div>
                      </td>
                      <td>
                        <span className={`pill ${session.status === "missed" ? "danger" : session.status === "completed" ? "success" : "neutral"}`}>
                          {session.status}
                        </span>
                      </td>
                      <td>
                        <div>{session.billable ? "Yes" : "No"}</div>
                        <div className="table-subtle">{formatMoney(session.amountCents)}</div>
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
