import { RatingForm } from "@/components/rating-form";
import { formatScore, formatShortDate } from "@/lib/format";
import { getWorkspaceOverview, listRatings } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function RatingsPage() {
  const actor = await requireActor();
  const [overview, ratings] = await Promise.all([getWorkspaceOverview(actor), listRatings(actor)]);
  const averageScore = ratings.length ? ratings.reduce((total, rating) => total + rating.score, 0) / ratings.length : 0;

  return (
    <div className="workspace-grid cols-2">
      <RatingForm
        clients={overview.clients.map((client) => ({
          id: client.id,
          name: client.name,
          billTo: client.billTo,
        }))}
      />

      <section className="panel">
        <h2>Rating summary</h2>
        <div className="workspace-grid cols-2">
          <div className="list-card">
            <strong>{ratings.length ? formatScore(averageScore) : "No ratings yet"}</strong>
            <span>average score</span>
          </div>
          <div className="list-card">
            <strong>{ratings.length}</strong>
            <span>verified reviews</span>
          </div>
        </div>
        <div className="workspace-grid" style={{ marginTop: 16 }}>
          {ratings.length ? (
            ratings.map((rating) => (
              <div key={rating.id} className="list-card">
                <strong>{rating.category}</strong>
                <span>{rating.score} / 5</span>
                <span>{rating.comment || "No comment added"}</span>
                <span className="table-subtle">{formatShortDate(rating.createdAt)}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">Leave a few verified reviews to see patterns here.</div>
          )}
        </div>
      </section>
    </div>
  );
}
