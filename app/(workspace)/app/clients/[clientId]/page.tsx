import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
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
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Student profile"
        title={client.name}
        description={client.billTo}
        aside={
          <>
            <div className="list-card">
              <strong>{formatMoney(client.rateCents)}</strong>
              <span>Per lesson</span>
            </div>
            <div className="list-card">
              <strong>{client.meetingsPerWeek}</strong>
              <span>Lessons each week</span>
            </div>
            <div className="list-card">
              <strong>{clientRatings.length ? formatScore(averageScore) : "No reviews yet"}</strong>
              <span>Verified feedback</span>
            </div>
          </>
        }
      >
        <span className={`pill ${client.status === "active" ? "success" : client.status === "needs_attention" ? "warning" : "neutral"}`}>
          {client.status}
        </span>
        <span className="pill neutral">{client.preferredDays || "No preferred days saved"}</span>
        <span className="pill neutral">Added {formatShortDate(client.createdAt)}</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Recent lessons</h2>
          <div className="workspace-grid">
            {clientSessions.length ? (
              clientSessions.map((session) => (
                <div key={session.id} className="list-card">
                  <strong>{session.title}</strong>
                  <span>{formatShortDateTime(session.startsAt)}</span>
                  <span>{session.billable ? formatMoney(session.amountCents) : "Not billed"}</span>
                  <span className={`pill ${session.status === "missed" ? "danger" : session.status === "completed" ? "success" : "neutral"}`}>
                    {session.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">No lessons are tied to this student yet.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>Student notes</h2>
          <p className="stat-label">Frequency, reschedule rules, and anything else worth keeping close.</p>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>Bill to</strong>
              <span>{client.billTo}</span>
            </div>
            <div className="list-card">
              <strong>Current rhythm</strong>
              <span>{client.meetingsPerWeek} sessions each week</span>
            </div>
            <div className="list-card">
              <strong>Notes</strong>
              <span>{client.notes || "No private notes saved yet."}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Review summary</h2>
          <div className="workspace-grid cols-2">
            <div className="list-card">
              <strong>{clientRatings.length ? formatScore(averageScore) : "No ratings yet"}</strong>
              <span>Verified feedback</span>
            </div>
            <div className="list-card">
              <strong>{clientRatings.length}</strong>
              <span>Total reviews</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>Overall view</h2>
          <div className="workspace-grid cols-2">
            <div className="list-card">
              <strong>{overview.missedSessionCount}</strong>
              <span>Missed lessons across the full app</span>
            </div>
            <div className="list-card">
              <strong>{formatMoney(overview.billableTotal)}</strong>
              <span>Billable total across the full app</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
