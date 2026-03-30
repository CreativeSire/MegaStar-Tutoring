export default function RatingsPage() {
  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <h2>Tutor rating summary</h2>
        <div className="stat-value">4.9 / 5</div>
        <p className="stat-label">Based on verified session reviews.</p>
      </section>
      <section className="panel">
        <h2>Recent reviews</h2>
        <p>Clients can rate punctuality, communication, clarity, and professionalism after completed lessons.</p>
      </section>
    </div>
  );
}
