import { PageIntro } from "@/components/page-intro";

const reviewGuides = [
  {
    title: "Punctuality",
    detail: "Did the lesson start on time and flow well?",
  },
  {
    title: "Clarity",
    detail: "Were things explained in a way that felt easy to follow?",
  },
  {
    title: "Support",
    detail: "Did the lesson feel helpful and encouraging?",
  },
];

export default function ClientReviewPage() {
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

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>What to think about</h2>
            <p>A few small things make the review more useful.</p>
          </div>
        </div>
        <div className="workspace-grid cols-3">
          {reviewGuides.map((item) => (
            <div key={item.title} className="list-card">
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
        <div className="list-card" style={{ marginTop: 16 }}>
          Your review helps keep lessons clear, helpful, and on track.
        </div>
      </section>
    </div>
  );
}
