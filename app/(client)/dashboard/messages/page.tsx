import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

const quickReplies = [
  "Thanks, I&apos;ll take a look.",
  "Could we move this lesson to another time?",
  "That works for me.",
];

export default async function ClientMessagesPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Messages</h2>
            <p>Simple notes from your tutor.</p>
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
      </section>

      <section className="panel">
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
      </section>
    </div>
  );
}
