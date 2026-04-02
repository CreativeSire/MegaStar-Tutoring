import { ClientReviewForm } from "@/components/client-review-form";
import { PageIntro } from "@/components/page-intro";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

export default async function ClientReviewPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Review"
        title="Share a quick note about your tutor."
        description="Helpful feedback keeps lessons clear, steady, and easy to improve."
        aside={
          <>
            <div className="list-card">
              <strong>After a lesson</strong>
              <span>Leave feedback once the session is complete.</span>
            </div>
            <div className="list-card">
              <strong>Private by default</strong>
              <span>Your note stays tied to this account.</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Short and simple</span>
        <span className="pill neutral">Helpful to both sides</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <ClientReviewForm
          clients={overview.clients.map((client) => ({
            id: client.id,
            name: client.name,
            billTo: client.billTo,
          }))}
          sessions={overview.sessions
            .filter((session) => session.status === "completed" || session.status === "partial")
            .map((session) => ({
              id: session.id,
              title: session.title,
              startsAt: session.startsAt.toISOString(),
              clientId: session.clientId,
              clientName: overview.clients.find((client) => client.id === session.clientId)?.name || session.title,
            }))}
        />

        <section className="panel">
          <div className="section-head compact">
            <div>
              <h2>What to think about</h2>
              <p>A few small things make the review more useful.</p>
            </div>
          </div>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>Clarity</strong>
              <span>Was the lesson easy to follow?</span>
            </div>
            <div className="list-card">
              <strong>Pace</strong>
              <span>Did the lesson feel too fast or too slow?</span>
            </div>
            <div className="list-card">
              <strong>Support</strong>
              <span>Did you feel looked after and encouraged?</span>
            </div>
          </div>
          <div className="list-card" style={{ marginTop: 16 }}>
            Your review helps keep lessons clear, helpful, and on track.
          </div>
        </section>
      </section>
    </div>
  );
}
