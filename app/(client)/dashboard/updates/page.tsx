import { PageIntro } from "@/components/page-intro";
import { buildStudentNotices } from "@/lib/notifications";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientUpdatesPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const { notices, sessionCards } = buildStudentNotices(overview);
  const nextLesson = overview.upcomingSessions[0];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Notifications"
        title="A clear view of what’s next."
        description="See the reminders, lesson notes, and calendar updates that matter to you."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.upcomingSessions.length}</strong>
              <span>Upcoming lessons</span>
            </div>
            <div className="list-card">
              <strong>{overview.missedSessionCount}</strong>
              <span>Lessons needing a new time</span>
            </div>
            <div className="list-card">
              <strong>{overview.syncs[0] ? "Connected" : "Ready"}</strong>
              <span>Calendar</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Friendly reminders</span>
        <span className="pill neutral">Lesson notes</span>
        <span className="pill neutral">Calendar updates</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>What to know today</h2>
              <p>Short reminders from your lesson rhythm and calendar.</p>
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
              <p>The next lesson sits here so it is always easy to find.</p>
            </div>
          </div>
          {nextLesson ? (
            <div className="list-card">
              <strong>{nextLesson.title}</strong>
              <span>{formatShortDateTime(nextLesson.startsAt)}</span>
              <span>{nextLesson.notes || "A short note from your tutor will appear here."}</span>
            </div>
          ) : (
            <div className="empty-state">Your next lesson will appear here once it is booked.</div>
          )}

          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {sessionCards.map((card) => (
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
