import { SessionForm } from "@/components/session-form";
import { formatMoney, formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview, listSessions } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function SessionsPage() {
  const actor = await requireActor();
  const [overview, sessions] = await Promise.all([getWorkspaceOverview(actor), listSessions(actor)]);

  return (
    <div className="workspace-grid cols-2">
      <SessionForm
        clients={overview.clients.map((client) => ({
          id: client.id,
          name: client.name,
          billTo: client.billTo,
        }))}
      />

      <section className="panel">
        <h2>Session log</h2>
        <table className="table">
          <thead>
            <tr>
              <th>When</th>
              <th>Client</th>
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
                <td colSpan={4}>No session records yet. Add the first lesson on the left.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
