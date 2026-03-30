import { PageIntro } from "@/components/page-intro";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

const quickReplies = [
  "Thanks, I'll take a look.",
  "Could we move this lesson to another time?",
  "That works for me.",
];

export default async function ClientMessagesPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const latestSession = overview.recentSessions[0];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Messages"
        title="Simple notes from your tutor."
        description="Keep recent updates and quick replies together so it feels easy to stay in touch."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.recentSessions.length}</strong>
              <span>Recent lessons</span>
            </div>
            <div className="list-card">
              <strong>{latestSession ? formatShortDateTime(latestSession.startsAt) : "—"}</strong>
              <span>Latest note</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Short replies</span>
        <span className="pill neutral">Stay in touch</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Recent notes</h2>
              <p>The latest lessons and any message from your tutor.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {overview.recentSessions.length ? (
              overview.recentSessions.slice(0, 4).map((session) => (
                <div key={session.id} className="list-card">
                  <strong>{session.title}</strong>
                  <span>{formatShortDateTime(session.startsAt)}</span>
                  <span>{session.notes || "A short message from your tutor will appear here."}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Messages will appear after your first lesson.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Quick replies</h2>
              <p>Helpful one-tap responses.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {quickReplies.map((reply) => (
              <div key={reply} className="list-card">
                {reply}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
