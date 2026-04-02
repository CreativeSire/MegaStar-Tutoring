import { PageIntro } from "@/components/page-intro";
import { DownloadButton } from "@/components/download-button";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { listAuditEvents } from "@/lib/security-controls";
import { requireWorkspaceActor } from "@/lib/current-actor";

export default async function CompliancePage() {
  const actor = await requireWorkspaceActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;
  const auditEvents = await listAuditEvents(actor, 40);

  const complianceChecks = [
    {
      title: "Role access",
      detail: "Tutor, client, and admin areas stay separated.",
    },
    {
      title: "Lesson trail",
      detail: "Sessions, notes, and reviews keep a tidy history.",
    },
    {
      title: "Download trail",
      detail: "Lesson packs and board snapshots can be saved when needed.",
    },
    {
      title: "Calendar sync",
      detail: "Imported events are tracked from the calendar page.",
    },
  ];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Review trail"
        title="Keep the important details easy to review."
        description="See the recent actions, the checks that matter, and the parts that need attention."
      />

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>What is being tracked</h2>
              <p>Simple notes for the people who need to review the record later.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {complianceChecks.map((item) => (
              <div key={item.title} className="list-card">
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Recent actions</h2>
              <p>The latest changes from the app.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {auditEvents.length ? (
              auditEvents.map((entry) => (
                <div key={entry.id} className="list-card">
                  <strong>{entry.action}</strong>
                  <span>{entry.route}</span>
                <span>{formatShortDateTime(entry.createdAt, market)}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Actions will appear here once people start using the app.</div>
            )}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>What the audit trail contains</h2>
            <p>Enough detail to review what happened without clutter.</p>
          </div>
        </div>
        <div className="workspace-grid cols-3">
          {[
            "Who made the change",
            "What page or action it came from",
            "When it happened",
            "What the result was",
            "Whether the action was allowed",
            "Whether anything needs follow-up",
          ].map((item) => (
            <div key={item} className="list-card">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Saved lesson records</h2>
            <p>Lesson notes, board snapshots, and follow-up files are kept here.</p>
          </div>
        </div>
        <div className="workspace-grid cols-2">
          {overview.archives.length ? (
            overview.archives.map((archive) => (
              <article key={archive.id} className="list-card">
                <strong>{archive.title}</strong>
                <span>{archive.summary}</span>
                <span>{archive.boardLabel}</span>
                  <span>{formatShortDateTime(archive.createdAt, market)}</span>
                <DownloadButton label="Download record" filename={archive.fileName} content={archive.snapshotJson} />
              </article>
            ))
          ) : (
            <div className="empty-state">Saved lesson records will appear here after a lesson is stored.</div>
          )}
        </div>
      </section>
    </div>
  );
}
