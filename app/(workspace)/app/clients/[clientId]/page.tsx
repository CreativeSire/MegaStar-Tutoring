import { notFound } from "next/navigation";
import { formatMoney, formatScore, formatShortDate, formatShortDateTime } from "@/lib/format";
import { getClientById, getWorkspaceOverview, listRatings, listSessions } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

type ClientDetailPageProps = {
  params: Promise<{ clientId: string }>;
};

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { clientId } = await params;
  const actor = await requireActor();
  const client = await getClientById(actor, clientId);
  if (!client) {
    notFound();
  }

  const [overview, sessions, ratings] = await Promise.all([
    getWorkspaceOverview(actor),
    listSessions(actor),
    listRatings(actor),
  ]);

  const clientSessions = sessions.filter((session) => session.clientId === client.id);
  const clientRatings = ratings.filter((rating) => rating.clientId === client.id);
  const averageScore = clientRatings.length
    ? clientRatings.reduce((total, rating) => total + rating.score, 0) / clientRatings.length
    : 0;

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <h2>{client.name}</h2>
        <p className="stat-label">{client.billTo}</p>
        <div className="workspace-grid cols-2">
          <div className="list-card">
            <strong>{formatMoney(client.rateCents)}</strong>
            <span>per session</span>
          </div>
          <div className="list-card">
            <strong>{client.meetingsPerWeek}</strong>
            <span>weekly sessions</span>
          </div>
          <div className="list-card">
            <strong>{client.status}</strong>
            <span>current status</span>
          </div>
          <div className="list-card">
            <strong>{clientRatings.length ? formatScore(averageScore) : "No ratings yet"}</strong>
            <span>verified feedback</span>
          </div>
        </div>
        <div className="action-row">
          <span className="pill neutral">{client.preferredDays || "No preferred days saved"}</span>
          <span className="pill neutral">Created {formatShortDate(client.createdAt)}</span>
        </div>
        <p className="stat-label">{client.notes || "No private notes saved yet."}</p>
      </section>

      <section className="panel">
        <h2>Recent sessions</h2>
        <div className="workspace-grid">
          {clientSessions.length ? (
            clientSessions.map((session) => (
              <div key={session.id} className="list-card">
                <strong>{session.title}</strong>
                <span>{formatShortDateTime(session.startsAt)}</span>
                <span>{session.billable ? formatMoney(session.amountCents) : "Not billable"}</span>
                <span className={`pill ${session.status === "missed" ? "danger" : session.status === "completed" ? "success" : "neutral"}`}>
                  {session.status}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-state">No sessions are tied to this client yet.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Client notes</h2>
        <p className="stat-label">Track frequency, reschedule rules, billing edges, and any special handling here.</p>
      </section>

      <section className="panel">
        <h2>Workspace snapshot</h2>
        <div className="workspace-grid cols-2">
          <div className="list-card">
            <strong>{overview.missedSessionCount}</strong>
            <span>missed sessions across the workspace</span>
          </div>
          <div className="list-card">
            <strong>{formatMoney(overview.billableTotal)}</strong>
            <span>billable total across all clients</span>
          </div>
        </div>
      </section>
    </div>
  );
}
