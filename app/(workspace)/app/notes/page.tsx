import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { buildTutorLessonNotes } from "@/lib/messaging";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function NotesPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);
  const { latestSession, noteCards, focusCards, quickPrompts } = buildTutorLessonNotes(overview);

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Lesson notes"
        title="Keep each lesson clear and easy to come back to."
        description="Recent notes, gentle follow-ups, and quick prompts stay together in one calm place."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.recentSessions.length}</strong>
              <span>Recent notes</span>
            </div>
            <div className="list-card">
              <strong>{overview.completedSessionCount}</strong>
              <span>Completed lessons</span>
            </div>
            <div className="list-card">
              <strong>{overview.missedSessionCount}</strong>
              <span>Needs follow-up</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Easy to scan</span>
        <span className="pill neutral">Private to you</span>
        <span className="pill neutral">Built from lessons</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Latest note</h2>
              <p>The last lesson is the fastest place to pick up the thread.</p>
            </div>
          </div>

          {latestSession ? (
            <div className="lesson-note-feature">
              <div className="lesson-note-feature-head">
                <div>
                  <span className="eyebrow">Most recent</span>
                  <h3>{latestSession.title}</h3>
                </div>
                <span className={`pill ${latestSession.status === "missed" ? "danger" : latestSession.status === "completed" ? "success" : "neutral"}`}>
                  {latestSession.status}
                </span>
              </div>
              <p>{latestSession.notes || "No note added yet."}</p>
              <div className="lesson-note-feature-meta">
                <span>{overview.clients.find((client) => client.id === latestSession.clientId)?.name || "Unassigned"}</span>
                <span>{latestSession.startsAt.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</span>
              </div>
              {latestSession.clientId ? (
                <Link className="button button-secondary" href={`/app/clients/${latestSession.clientId}`}>
                  Open student
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="empty-state">Your latest lesson note will appear here once a session is saved.</div>
          )}

          <div className="lesson-note-stack">
            {focusCards.map((card) => (
              <div key={card.title} className={`notice-card ${card.tone}`}>
                <strong>{card.title}</strong>
                <span>{card.detail}</span>
                <em>{card.meta}</em>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Quick prompts</h2>
              <p>Short notes that keep the lesson flow simple.</p>
            </div>
          </div>

          <div className="reply-chip-grid">
            {quickPrompts.map((prompt) => (
              <div key={prompt.title} className={`reply-chip-card ${prompt.tone}`}>
                <strong>{prompt.title}</strong>
                <span>{prompt.detail}</span>
                <em>{prompt.meta}</em>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Recent lesson notes</h2>
            <p>Everything recent in one easy-to-scan list.</p>
          </div>
        </div>

        <div className="lesson-note-list">
          {noteCards.length ? (
            noteCards.map((card) => (
              <article key={`${card.title}-${card.meta}`} className={`lesson-note-row ${card.tone}`}>
                <div className="lesson-note-row-copy">
                  <strong>{card.title}</strong>
                  <span>{card.detail}</span>
                  <em>{card.meta}</em>
                </div>
                {card.href ? (
                  <Link href={card.href}>{card.linkLabel || "Open student"}</Link>
                ) : null}
              </article>
            ))
          ) : (
            <div className="empty-state">Lesson notes will appear here once you add a few sessions.</div>
          )}
        </div>
      </section>
    </div>
  );
}
