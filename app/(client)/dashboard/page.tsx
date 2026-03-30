export default function ClientDashboardPage() {
  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <h2>Upcoming lessons</h2>
        <p className="stat-label">Your next lesson appears here with time, subject, and status.</p>
      </section>
      <section className="panel">
        <h2>Billing</h2>
        <p className="stat-label">Invoices, payments, and session history stay private to your account.</p>
      </section>
    </div>
  );
}
