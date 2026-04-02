import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { DownloadButton } from "@/components/download-button";
import { buildClassroomViewModel } from "@/lib/classroom";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireWorkspaceActor } from "@/lib/current-actor";

export default async function LibraryPage() {
  const actor = await requireWorkspaceActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;
  const classroom = buildClassroomViewModel(overview, actor.role || "tutor", market);
  const latestArchive = overview.archives[0] || null;
  const archiveCount = overview.archives.length;
  const recentSessionCount = Math.min(overview.recentSessions.length, 6);

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Lesson library"
        title="A calmer place for lesson records."
        description="Archive the best parts of a lesson, keep the board notes tidy, and pull down the right pack without hunting through the app."
      >
        <Link href="/classroom" className="button button-secondary">
          Open classroom
        </Link>
        <Link href="/app/compliance" className="button button-secondary">
          Review trail
        </Link>
      </PageIntro>

      <section
        className="workspace-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}
      >
        <article className="panel">
          <div className="stat-value">{archiveCount}</div>
          <div className="stat-label">Saved lesson records</div>
        </article>
        <article className="panel">
          <div className="stat-value">{classroom.materials.length}</div>
          <div className="stat-label">Ready-to-download materials</div>
        </article>
        <article className="panel">
          <div className="stat-value">{recentSessionCount}</div>
          <div className="stat-label">Recent lesson packs</div>
        </article>
        <article className="panel">
          <div className="stat-value">{latestArchive ? formatShortDateTime(latestArchive.createdAt, market) : "Ready now"}</div>
          <div className="stat-label">Latest archive</div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Saved lesson records</h2>
              <p>Board snapshots and lesson notes in one download-friendly view.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {overview.archives.length ? (
              overview.archives.slice(0, 4).map((archive) => (
                <article key={archive.id} className="classroom-material-card">
                  <div>
                    <span className="material-kicker">{archive.boardLabel}</span>
                    <strong>{archive.title}</strong>
                    <p>{archive.summary}</p>
                  </div>
                  <div className="material-meta">
                    <span>{formatShortDateTime(archive.createdAt, market)}</span>
                    <DownloadButton
                      label="Download record"
                      filename={archive.fileName}
                      content={[archive.title, "", archive.summary, "", archive.snapshotJson].join("\n")}
                      className="button button-secondary button-small"
                    />
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">Save the first lesson record from the classroom and it will appear here.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Lesson materials</h2>
              <p>Summary notes, board prompts, and the reusable pack.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {classroom.materials.map((material) => (
              <article key={material.id} className="classroom-material-card">
                <div>
                  <span className="material-kicker">{material.kind}</span>
                  <strong>{material.title}</strong>
                  <p>{material.summary}</p>
                </div>
                <div className="material-meta">
                  <span>{material.updatedAt}</span>
                  <DownloadButton label="Download" filename={material.fileName} content={material.body} className="button button-secondary button-small" />
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Recent lesson packs</h2>
            <p>Quick saves from the latest sessions.</p>
          </div>
        </div>
        <div className="workspace-grid cols-3">
          {(overview.recentSessions.length ? overview.recentSessions : overview.upcomingSessions).slice(0, 6).map(
            (session: (typeof overview.recentSessions)[number]) => {
              const client = overview.clients.find((entry) => entry.id === session.clientId);
                const packText = [
                  `Student: ${client?.name || "Unassigned"}`,
                  `Lesson: ${session.title}`,
                  `When: ${formatShortDateTime(session.startsAt, market)}`,
                  `Status: ${session.status}`,
                  session.notes ? `Notes: ${session.notes}` : "Notes: None yet",
                ].join("\n");

              return (
                <div key={session.id} className="list-card">
                  <strong>{client?.name || session.title}</strong>
                  <span>{session.title}</span>
                  <span>{formatShortDateTime(session.startsAt, market)}</span>
                  <DownloadButton
                    label="Save pack"
                    filename={`${(client?.name || session.title).toLowerCase().replace(/\s+/g, "-")}-lesson-pack.txt`}
                    content={packText}
                    className="button button-secondary button-small"
                  />
                </div>
              );
            },
          )}
        </div>
      </section>
    </div>
  );
}
