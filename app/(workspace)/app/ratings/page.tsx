import { RatingForm } from "@/components/rating-form";
import { PageIntro } from "@/components/page-intro";
import { formatScore, formatShortDate } from "@/lib/format";
import { getWorkspaceOverview, listRatings } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function RatingsPage() {
  const actor = await requireActor();
  const [overview, ratings] = await Promise.all([getWorkspaceOverview(actor), listRatings(actor)]);
  const market = overview.preferences.market;
  const averageScore = ratings.length ? ratings.reduce((total, rating) => total + rating.score, 0) / ratings.length : 0;
  const verifiedRatings = ratings.filter((rating) => rating.sessionId);
  const categoryMap = ratings.reduce<Record<string, { total: number; count: number }>>((accumulator, rating) => {
    const entry = accumulator[rating.category] || { total: 0, count: 0 };
    entry.total += rating.score;
    entry.count += 1;
    accumulator[rating.category] = entry;
    return accumulator;
  }, {});
  const categorySummary = Object.entries(categoryMap)
    .map(([category, value]) => ({
      category,
      average: value.total / value.count,
      count: value.count,
    }))
    .sort((left, right) => right.average - left.average);

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Reviews"
        title="Tutor feedback, kept private and useful."
        description="Track what students appreciate most so each lesson feels clearer, kinder, and easier to follow."
        aside={
          <>
            <div className="list-card">
              <strong>{ratings.length ? formatScore(averageScore, market) : "No reviews yet"}</strong>
              <span>Average score</span>
            </div>
            <div className="list-card">
              <strong>{ratings.length}</strong>
              <span>Saved reviews</span>
            </div>
            <div className="list-card">
              <strong>{verifiedRatings.length}</strong>
              <span>Lesson-linked reviews</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">{overview.clients.length} students</span>
        <span className="pill neutral">{ratings.length} reviews</span>
        <span className="pill neutral">{verifiedRatings.length} lesson-linked</span>
        <span className="pill neutral">Private feedback</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <RatingForm
          clients={overview.clients.map((client) => ({
            id: client.id,
            name: client.name,
            billTo: client.billTo,
          }))}
          sessions={overview.sessions
            .filter((session) => session.status === "completed")
            .map((session) => ({
              id: session.id,
              title: session.title,
              startsAt: new Date(session.startsAt).toISOString(),
              clientId: session.clientId,
              clientName: overview.clients.find((client) => client.id === session.clientId)?.name || session.title,
            }))}
        />

        <section className="panel">
          <div className="section-head compact">
            <div>
              <h2>Review summary</h2>
              <p>A quick read on how lessons are landing.</p>
            </div>
          </div>

          <div className="workspace-grid cols-2">
            <div className="list-card">
              <strong>{ratings.length ? formatScore(averageScore, market) : "—"}</strong>
              <span>Average score</span>
            </div>
            <div className="list-card">
              <strong>{verifiedRatings.length}</strong>
              <span>Lesson-linked reviews</span>
            </div>
          </div>

          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {categorySummary.length ? (
              categorySummary.map((item) => (
                <div key={item.category} className="list-card">
                  <div className="audit-row">
                    <strong>{item.category}</strong>
              <span>{formatScore(item.average, market)} · {item.count}</span>
                  </div>
                  <div className="table-subtle">Average from the latest private reviews.</div>
                </div>
              ))
            ) : (
              <div className="empty-state">Leave a few verified reviews to see patterns here.</div>
            )}
          </div>

          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {ratings.length ? (
              ratings.map((rating) => (
                <div key={rating.id} className="list-card">
                  <div className="audit-row">
                    <strong>{rating.category}</strong>
                    <span>{rating.score} / 5</span>
                  </div>
                  <span className="pill success">{rating.sessionId ? "Verified" : "Unverified"}</span>
                  <div className="table-subtle">
                    {overview.sessions.find((session) => session.id === rating.sessionId)?.title || "No lesson linked"}
                  </div>
                  <span>{rating.comment || "No comment added"}</span>
              <span className="table-subtle">{formatShortDate(rating.createdAt, market)}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Reviews will show up after a lesson is marked complete.</div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
