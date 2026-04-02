import { PageIntro } from "@/components/page-intro";
import { formatMoney, formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientInvoicesPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;
  const lastLesson = overview.recentSessions[0];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Payments"
        title="Your payment history."
        description="Only your own lessons and totals appear here."
        aside={
          <>
            <div className="list-card">
              <strong>{formatMoney(overview.billableTotal, market)}</strong>
              <span>Current total</span>
            </div>
            <div className="list-card">
              <strong>{overview.sessionCount}</strong>
              <span>Lessons in view</span>
            </div>
            <div className="list-card">
              <strong>{lastLesson ? formatShortDateTime(lastLesson.startsAt, market) : "—"}</strong>
              <span>Latest lesson</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">{overview.completedSessionCount} completed</span>
        <span className="pill neutral">{overview.missedSessionCount} missed</span>
        <span className="pill neutral">Private to you</span>
      </PageIntro>

      <section className="student-grid">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>What you owe</h2>
              <p>A simple count of the lessons already included.</p>
            </div>
          </div>
          <div className="student-summary">
            <div className="list-card">
            <strong>{formatMoney(overview.billableTotal, market)}</strong>
              <span>Current total</span>
            </div>
            <div className="list-card">
              <strong>{overview.sessionCount}</strong>
              <span>Total lessons</span>
            </div>
            <div className="list-card">
              <strong>{overview.completedSessionCount}</strong>
              <span>Completed lessons</span>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Lesson history</h2>
              <p>The latest lessons and what they cost.</p>
            </div>
          </div>
          <div className="student-timeline" style={{ marginTop: 16 }}>
            {overview.recentSessions.length ? (
              overview.recentSessions.map((session: (typeof overview.recentSessions)[number]) => (
                <div key={session.id} className="student-timeline-row">
                  <div>
                    <strong>{session.title}</strong>
                    <span>{formatShortDateTime(session.startsAt, market)}</span>
                  </div>
                    <span>{session.billable ? formatMoney(session.amountCents, market) : "Not billed"}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Payment history will appear after the first lesson.</div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
