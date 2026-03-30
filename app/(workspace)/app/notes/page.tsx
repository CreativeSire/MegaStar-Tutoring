import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function NotesPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);

  return (
    <section className="panel">
      <div className="section-head compact">
        <div>
          <h2>Lesson notes</h2>
          <p>Keep the useful details from each lesson in one calm place.</p>
        </div>
      </div>

      <div className="workspace-grid cols-2">
        {overview.recentSessions.length ? (
          overview.recentSessions.map((session) => (
            <article key={session.id} className="list-card">
              <strong>{session.title}</strong>
              <span>{formatShortDateTime(session.startsAt)}</span>
              <span>{session.notes || "No note added yet."}</span>
              <span className="table-subtle">{session.billable ? "Included in payment" : "No payment needed"}</span>
            </article>
          ))
        ) : (
          <div className="empty-state">Lesson notes will appear here once you add a few sessions.</div>
        )}
      </div>
    </section>
  );
}
