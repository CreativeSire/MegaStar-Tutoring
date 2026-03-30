import Link from "next/link";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

const quickReplies = [
  "Thanks, that works for me.",
  "I&apos;ll share a new time soon.",
  "Let&apos;s keep the same lesson plan.",
];

export default async function MessagesPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Messages</h2>
            <p>A simple view of recent lesson conversations.</p>
          </div>
        </div>

        <div className="workspace-grid">
          {overview.clients.length ? (
            overview.clients.slice(0, 5).map((client) => {
              const lastSession = overview.sessions.find((session) => session.clientId === client.id);
              return (
                <div key={client.id} className="list-card">
                  <div className="audit-row">
                    <strong>{client.name}</strong>
                    <Link href={`/app/clients/${client.id}`}>View student</Link>
                  </div>
                  <span>{client.billTo}</span>
                  <span>{lastSession ? formatShortDateTime(lastSession.startsAt) : "No lesson yet"}</span>
                  <span>{lastSession?.notes || "A short reply can go here after each lesson."}</span>
                </div>
              );
            })
          ) : (
            <div className="empty-state">Add a student profile to begin messages.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Quick replies</h2>
            <p>Short messages that keep things clear.</p>
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
