import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { formatMoney, formatScore, formatShortDateTime } from "@/lib/format";
import { getInvoiceDrafts, getWorkspaceOverview, listAvailabilityBlocks } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function AiPage() {
  const actor = await requireActor();
  const [overview, availabilityBlocks, invoiceDrafts] = await Promise.all([
    getWorkspaceOverview(actor),
    listAvailabilityBlocks(actor),
    getInvoiceDrafts(actor),
  ]);
  const market = overview.preferences.market;
  const pendingRequests = overview.scheduleRequests.filter((request) => request.status === "pending");
  const pendingModeration = overview.ratings.filter((rating) => rating.moderationStatus === "pending");

  const suggestions = [
    pendingRequests.length
      ? `Resolve ${pendingRequests.length} schedule request${pendingRequests.length === 1 ? "" : "s"} before the week fills up.`
      : "No schedule requests are waiting right now.",
    availabilityBlocks.length
      ? `You have ${availabilityBlocks.length} teaching block${availabilityBlocks.length === 1 ? "" : "s"} on the board.`
      : "Add a few availability blocks so the planner can suggest real open windows.",
    invoiceDrafts.length
      ? `${invoiceDrafts.length} invoice draft${invoiceDrafts.length === 1 ? "" : "s"} is ready to export.`
      : "Build an invoice from the lesson trail when the month is ready.",
    pendingModeration.length
      ? `${pendingModeration.length} review${pendingModeration.length === 1 ? "" : "s"} needs moderation.`
      : "Reviews are up to date right now.",
  ];

  const bestNextMove = suggestions.find((item) => !item.startsWith("No ")) || suggestions[0];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Helper"
        title="A quiet nudge for the week ahead."
        description="See the next useful move without sorting through everything yourself."
        aside={
          <>
            <div className="list-card">
              <strong>{pendingRequests.length}</strong>
              <span>Follow-ups</span>
            </div>
            <div className="list-card">
              <strong>{availabilityBlocks.length}</strong>
              <span>Availability blocks</span>
            </div>
            <div className="list-card">
              <strong>{formatScore(overview.ratingAverage || 0, market)}</strong>
              <span>Current rating</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Smart suggestions</span>
        <span className="pill neutral">Billing prompts</span>
        <span className="pill neutral">Reschedule help</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Best next move</h2>
              <p>The first thing worth checking today.</p>
            </div>
          </div>
          <div className="list-card">
            <strong>{bestNextMove}</strong>
            <span>Keep this in view while you plan the day.</span>
          </div>
          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {suggestions.map((item) => (
              <div key={item} className="list-card">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>What the app sees</h2>
              <p>A simple read on the current lesson rhythm.</p>
            </div>
          </div>
          <div className="workspace-grid cols-2">
            <div className="list-card">
              <strong>{overview.activeSessionCount}</strong>
              <span>Lessons lined up</span>
            </div>
            <div className="list-card">
              <strong>{overview.completedSessionCount}</strong>
              <span>Lessons completed</span>
            </div>
            <div className="list-card">
              <strong>{overview.billableTotal > 0 ? formatMoney(overview.billableTotal, market) : "—"}</strong>
              <span>Lesson value</span>
            </div>
            <div className="list-card">
              <strong>{overview.clients.length}</strong>
              <span>Students to watch</span>
            </div>
          </div>
          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {overview.upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="list-card">
                <strong>{session.title}</strong>
                <span>{formatShortDateTime(session.startsAt, market)}</span>
                <span>{session.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Patterns</h2>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>{availabilityBlocks.length}</strong>
              <span>Blocks on the board</span>
            </div>
            <div className="list-card">
              <strong>{pendingModeration.length}</strong>
              <span>Reviews to moderate</span>
            </div>
            <div className="list-card">
              <strong>{invoiceDrafts.length}</strong>
              <span>Invoice drafts</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>Quick links</h2>
          <div className="workspace-grid">
            <Link href="/app/calendar" className="button button-secondary">
              Open planner
            </Link>
            <Link href="/app/invoices" className="button button-secondary">
              Review invoices
            </Link>
            <Link href="/app/ratings" className="button button-secondary">
              Moderate reviews
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
