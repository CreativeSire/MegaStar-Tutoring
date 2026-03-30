export default function CalendarPage() {
  return (
    <section className="panel">
      <h2>Weekly planner</h2>
      <div className="workspace-grid cols-3">
        {["Monday", "Wednesday", "Friday"].map((day) => (
          <article key={day} className="panel" style={{ boxShadow: "none" }}>
            <h3>{day}</h3>
            <p className="stat-label">Free slots, booked sessions, and reschedule opportunities appear here.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
