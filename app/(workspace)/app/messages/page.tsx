import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { buildTutorMessages } from "@/lib/messaging";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function MessagesPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;
  const { threads, replySuggestions, focusCards } = buildTutorMessages(overview, market);

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Messages"
        title="Keep each conversation short, clear, and easy to follow."
        description="Recent lesson replies, gentle reminders, and quick responses all sit together here."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.clients.length}</strong>
              <span>Students</span>
            </div>
            <div className="list-card">
              <strong>{overview.upcomingSessions.length}</strong>
              <span>Upcoming lessons</span>
            </div>
            <div className="list-card">
              <strong>{overview.missedSessionCount}</strong>
              <span>Needs attention</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Friendly replies</span>
        <span className="pill neutral">Lesson updates</span>
        <span className="pill neutral">Private to you</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Recent conversations</h2>
              <p>The latest note from each student, in a calmer view.</p>
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
                  {thread.href ? <Link href={thread.href}>{thread.linkLabel || "Open student"}</Link> : null}
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
              <p>Short replies that keep things moving without extra fuss.</p>
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
    </div>
  );
}
