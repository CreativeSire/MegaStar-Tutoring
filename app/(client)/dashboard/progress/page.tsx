import { formatMoney, formatScore } from "@/lib/format";
import { PageIntro } from "@/components/page-intro";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientProgressPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;
  const completedLessons = overview.completedSessionCount;
  const plannedLessons = overview.sessionCount;

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Progress"
        title="A clear view of how lessons are going."
        description="Track the main signals at a glance, then open the recent lessons list when you want detail."
        aside={
          <>
            <div className="list-card">
              <strong>{plannedLessons}</strong>
              <span>Lessons planned</span>
            </div>
            <div className="list-card">
              <strong>{completedLessons}</strong>
              <span>Lessons done</span>
            </div>
            <div className="list-card">
              <strong>{formatScore(overview.ratingAverage || 0, market)}</strong>
              <span>Tutor rating</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Steady view</span>
        <span className="pill neutral">Easy to compare</span>
        <span className="pill neutral">Private to you</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <section className="panel">
          <div className="section-head compact">
            <div>
              <h2>Your progress</h2>
              <p>A clear view of how lessons are going.</p>
            </div>
          </div>

          <div className="student-pills">
            <div className="student-pill">
              <strong>{plannedLessons}</strong>
              <span>Lessons planned</span>
            </div>
            <div className="student-pill">
              <strong>{completedLessons}</strong>
              <span>Lessons done</span>
            </div>
            <div className="student-pill">
              <strong>{formatScore(overview.ratingAverage || 0, market)}</strong>
              <span>Tutor rating</span>
            </div>
            <div className="student-pill">
              <strong>{formatMoney(overview.billableTotal, market)}</strong>
              <span>Payments this month</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="section-head compact">
            <div>
              <h2>Recent lessons</h2>
              <p>What has already been covered.</p>
            </div>
          </div>
          <div className="student-timeline">
            {overview.recentSessions.length ? (
              overview.recentSessions.slice(0, 4).map((session: (typeof overview.recentSessions)[number]) => (
                <div key={session.id} className="student-timeline-row">
                  <div>
                    <strong>{session.title}</strong>
                    <span>{session.notes || "No note added yet."}</span>
                  </div>
                  <span className={`pill ${session.status === "missed" ? "danger" : session.status === "completed" ? "success" : "neutral"}`}>
                    {session.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">Your lesson history will appear here.</div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
