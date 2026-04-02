import { PageIntro } from "@/components/page-intro";
import { buildTutorNotices } from "@/lib/notifications";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function AlertsPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;
  const { notices, scheduleCards } = buildTutorNotices(overview, market);
  const nextLesson = overview.upcomingSessions[0];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Reminders"
        title="A calm view of what needs attention."
        description="See the follow-ups, lesson rhythm, and calendar notes that matter right now."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.missedSessionCount}</strong>
              <span>Follow-ups</span>
            </div>
            <div className="list-card">
              <strong>{overview.upcomingSessions.length}</strong>
              <span>Upcoming lessons</span>
            </div>
            <div className="list-card">
              <strong>{overview.syncs[0] ? "Connected" : "Ready"}</strong>
              <span>Calendar</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Simple reminders</span>
        <span className="pill neutral">Calendar notes</span>
        <span className="pill neutral">Private to you</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>What needs attention</h2>
              <p>Short reminders that help you keep the week smooth.</p>
            </div>
          </div>
          <div className="notice-grid">
            {notices.map((notice) => (
              <div key={notice.title} className={`notice-card ${notice.tone}`}>
                <strong>{notice.title}</strong>
                <span>{notice.detail}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Next lesson</h2>
              <p>The next lesson is always the easiest place to begin.</p>
            </div>
          </div>
          {nextLesson ? (
            <div className="list-card">
              <strong>{nextLesson.title}</strong>
              <span>{formatShortDateTime(nextLesson.startsAt, market)}</span>
              <span>{nextLesson.notes || "No note saved yet."}</span>
            </div>
          ) : (
            <div className="empty-state">No lessons lined up yet.</div>
          )}

          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {scheduleCards.map((card) => (
              <div key={card.title} className={`notice-card ${card.tone}`}>
                <strong>{card.title}</strong>
                <span>{card.detail}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
