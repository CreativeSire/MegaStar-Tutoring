import { formatMoney, formatScore } from "@/lib/format";
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
      ? `You have ${overview.clients.length} client profile${overview.clients.length === 1 ? "" : "s"} ready for smarter planning.`
      : "Start with a client profile so the scheduler can infer patterns.",
    overview.billableTotal > 0
      ? `There is ${formatMoney(overview.billableTotal)} in billable work ready to organize.`
      : "Once sessions land, the billing assistant can draft invoices automatically.",
    overview.ratingAverage > 0
      ? `Tutor score is ${formatScore(overview.ratingAverage)} — keep the verified reviews coming.`
      : "Ask for verified ratings after each completed lesson to build a strong tutor profile.",
  ];

  return (
    <section className="panel">
      <h2>AI assistant</h2>
      <p className="stat-label">A smart layer for reschedules, billing prompts, and daily priorities.</p>
      <div className="workspace-grid">
        {suggestions.map((item) => (
          <article key={item} className="list-card">
            {item}
          </article>
        ))}
      </div>
    </section>
  );
}
