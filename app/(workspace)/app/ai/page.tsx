import { formatMoney, formatScore } from "@/lib/format";
import { PageIntro } from "@/components/page-intro";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function AiPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);

  const suggestions = [
    overview.missedSessionCount > 0
      ? `Follow up on ${overview.missedSessionCount} missed session${overview.missedSessionCount === 1 ? "" : "s"} before they slip.`
      : "No missed sessions are waiting right now.",
    overview.clients.length
      ? `You have ${overview.clients.length} student profile${overview.clients.length === 1 ? "" : "s"} ready for smarter planning.`
      : "Start with a student profile so the scheduler can learn the pattern.",
    overview.billableTotal > 0
      ? `There is ${formatMoney(overview.billableTotal)} in lesson time ready to arrange.`
      : "Once lessons land, billing can be shaped from the same record.",
    overview.ratingAverage > 0
      ? `Tutor score is ${formatScore(overview.ratingAverage)} — keep the verified reviews coming.`
      : "Ask for a review after each completed lesson to build a strong profile.",
  ];

  const bestNextMove = suggestions.find((item) => !item.startsWith("No ")) || suggestions[0];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Helper"
        title="A quiet nudge for the week ahead."
        description="See the next useful move without sorting through everything yourself."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.missedSessionCount}</strong>
              <span>Follow-ups</span>
            </div>
            <div className="list-card">
              <strong>{overview.clients.length}</strong>
              <span>Student profiles</span>
            </div>
            <div className="list-card">
              <strong>{formatScore(overview.ratingAverage || 0)}</strong>
              <span>Current rating</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Smart suggestions</span>
        <span className="pill neutral">Billing prompts</span>
        <span className="pill neutral">Reschedule help</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Best next move</h2>
              <p>The first thing worth checking today.</p>
            </div>
          </div>
          <div className="list-card">
            <strong>{bestNextMove}</strong>
            <span>Keep this in view while you plan the day.</span>
          </div>
          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {suggestions.map((item) => (
              <div key={item} className="list-card">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>What the app sees</h2>
              <p>A simple read on the current lesson rhythm.</p>
            </div>
          </div>
          <div className="workspace-grid cols-2">
            <div className="list-card">
              <strong>{overview.activeSessionCount}</strong>
              <span>Lessons lined up</span>
            </div>
            <div className="list-card">
              <strong>{overview.completedSessionCount}</strong>
              <span>Lessons completed</span>
            </div>
            <div className="list-card">
              <strong>{overview.billableTotal > 0 ? formatMoney(overview.billableTotal) : "—"}</strong>
              <span>Lesson value</span>
            </div>
            <div className="list-card">
              <strong>{overview.clients.length}</strong>
              <span>Students to watch</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
