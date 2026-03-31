import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { buildStudentMessages } from "@/lib/messaging";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientMessagesPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const { threads, replySuggestions, focusCards } = buildStudentMessages(overview);
  const nextLesson = overview.upcomingSessions[0] || overview.recentSessions[0] || null;

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Messages"
        title="A simple place for notes from your tutor."
        description="See the latest lesson note, helpful reminders, and short replies in one calm view."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.upcomingSessions.length}</strong>
              <span>Upcoming lessons</span>
            </div>
            <div className="list-card">
              <strong>{overview.recentSessions.length}</strong>
              <span>Recent notes</span>
            </div>
            <div className="list-card">
              <strong>{overview.missedSessionCount}</strong>
              <span>Needs a new time</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Short replies</span>
        <span className="pill neutral">Keep in touch</span>
        <span className="pill neutral">Easy to read</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Recent notes</h2>
              <p>The latest lessons and the small things worth keeping.</p>
            </div>
          </div>

          <div className="message-thread">
            {threads.map((thread) => (
              <div key={thread.title} className={`message-thread-item ${thread.tone}`}>
                <div className="message-thread-head">
                  <div>
                    <strong>{thread.title}</strong>
                    <span>{thread.meta}</span>
                  </div>
                  <Link href="/dashboard/sessions">View lessons</Link>
                </div>
                <p>{thread.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Quick replies</h2>
              <p>Helpful little replies for common moments.</p>
            </div>
          </div>

          <div className="reply-chip-grid">
            {replySuggestions.map((reply) => (
              <div key={reply.title} className={`reply-chip-card ${reply.tone}`}>
                <strong>{reply.title}</strong>
                <span>{reply.detail}</span>
                <em>{reply.meta}</em>
              </div>
            ))}
          </div>

          <div className="lesson-note-stack" style={{ marginTop: 18 }}>
            {focusCards.map((card) => (
              <div key={card.title} className={`notice-card ${card.tone}`}>
                <strong>{card.title}</strong>
                <span>{card.detail}</span>
                <em>{card.meta}</em>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>What to know next</h2>
            <p>Small reminders that help the week stay smooth.</p>
          </div>
        </div>

        <div className="student-message-summary">
          <div className="list-card">
            <strong>{nextLesson ? nextLesson.title : "No lesson yet"}</strong>
            <span>{nextLesson ? formatShortDateTime(nextLesson.startsAt) : "Your next lesson will appear here."}</span>
          </div>
          <div className="list-card">
            <strong>{overview.syncs[0] ? "Connected" : "Ready"}</strong>
            <span>{overview.syncs[0] ? overview.syncs[0].statusMessage : "Calendar sync is ready when you need it."}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
