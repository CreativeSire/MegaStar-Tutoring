import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { formatMoney, formatScore, formatShortDate, formatShortDateTime } from "@/lib/format";
import { getClientById, getInvoiceDrafts, getWorkspaceOverview, listAvailabilityBlocks, listRatings, listSessions } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

type ClientDetailPageProps = {
  params: Promise<{ clientId: string }>;
};

function minutesToLabel(minutes: number) {
  const total = Math.max(0, Math.min(24 * 60, Math.floor(minutes)));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  const suffix = hours >= 12 ? "pm" : "am";
  const normalized = hours % 12 || 12;
  return `${normalized}:${String(mins).padStart(2, "0")} ${suffix}`;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { clientId } = await params;
  const actor = await requireActor();
  const client = await getClientById(actor, clientId);
  if (!client) {
    notFound();
  }

  const [overview, sessions, ratings, availabilityBlocks, drafts] = await Promise.all([
    getWorkspaceOverview(actor),
    listSessions(actor),
    listRatings(actor),
    listAvailabilityBlocks(actor),
    getInvoiceDrafts(actor),
  ]);

  const clientSessions = sessions.filter((session) => session.clientId === client.id);
  const clientRatings = ratings.filter((rating) => rating.clientId === client.id);
  const clientDraft = drafts.find((draft) => draft.client.id === client.id) || null;
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
              <strong>{formatMoney(client.rateCents, overview.preferences.market)}</strong>
              <span>Per lesson</span>
            </div>
            <div className="list-card">
              <strong>{client.meetingsPerWeek}</strong>
              <span>Lessons each week</span>
            </div>
            <div className="list-card">
              <strong>{clientRatings.length ? formatScore(averageScore, overview.preferences.market) : "No reviews yet"}</strong>
              <span>Verified feedback</span>
            </div>
          </>
        }
      >
        <span className={`pill ${client.status === "active" ? "success" : client.status === "needs_attention" ? "warning" : "neutral"}`}>
          {client.status}
        </span>
        <span className="pill neutral">{client.preferredDays || "No preferred days saved"}</span>
        <span className="pill neutral">Added {formatShortDate(client.createdAt, overview.preferences.market)}</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Recent lessons</h2>
          <div className="workspace-grid">
            {clientSessions.length ? (
              clientSessions.map((session) => (
                <div key={session.id} className="list-card">
                  <strong>{session.title}</strong>
                  <span>{formatShortDateTime(session.startsAt, overview.preferences.market)}</span>
                  <span>{session.billable ? formatMoney(session.amountCents, overview.preferences.market) : "Not billed"}</span>
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
            <div className="list-card">
              <strong>Preferred windows</strong>
              <span>{client.preferredDays || "No preferred days saved yet."}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Review summary</h2>
          <div className="workspace-grid cols-2">
            <div className="list-card">
              <strong>{clientRatings.length ? formatScore(averageScore, overview.preferences.market) : "No ratings yet"}</strong>
              <span>Verified feedback</span>
            </div>
            <div className="list-card">
              <strong>{clientRatings.length}</strong>
              <span>Total reviews</span>
            </div>
          </div>
          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {clientRatings.length ? (
              clientRatings.map((rating) => (
                <div key={rating.id} className="list-card">
                  <strong>{rating.category}</strong>
                  <span>{rating.score} / 5</span>
                  <span>{rating.comment || "No comment added"}</span>
                  <span className="table-subtle">{formatShortDate(rating.createdAt, overview.preferences.market)}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">No review history yet.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>Operational snapshot</h2>
          <div className="workspace-grid cols-2">
            <div className="list-card">
              <strong>{overview.missedSessionCount}</strong>
              <span>Missed lessons across the full app</span>
            </div>
            <div className="list-card">
              <strong>{formatMoney(overview.billableTotal, overview.preferences.market)}</strong>
              <span>Billable total across the full app</span>
            </div>
            <div className="list-card">
              <strong>{availabilityBlocks.length}</strong>
              <span>Availability blocks in workspace</span>
            </div>
            <div className="list-card">
              <strong>{clientDraft ? clientDraft.totalCents : 0}</strong>
              <span>Latest draft total</span>
            </div>
          </div>

          <div className="workspace-grid" style={{ marginTop: 16 }}>
            <div className="list-card">
              <strong>Billing plan</strong>
              <span>{clientDraft ? clientDraft.fileName : "No draft export yet"}</span>
            </div>
            <div className="list-card">
              <strong>Availability</strong>
              <span>
                {availabilityBlocks.length
                  ? availabilityBlocks
                      .slice(0, 3)
                      .map((block) => `${block.label} · ${minutesToLabel(block.startMinute)} - ${minutesToLabel(block.endMinute)}`)
                      .join(" • ")
                  : "No availability blocks yet"}
              </span>
            </div>
          </div>
        </article>
      </section>

      <section className="action-row">
        <Link href="/app/invoices" className="button button-primary">
          Build invoice
        </Link>
        <Link href="/app/ratings" className="button button-secondary">
          Client feedback
        </Link>
        <Link href="/classroom" className="button button-secondary">
          Open classroom
        </Link>
      </section>
    </div>
  );
}
