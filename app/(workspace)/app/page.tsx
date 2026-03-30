const stats = [
  { label: "Active clients", value: "8" },
  { label: "Sessions this week", value: "12" },
  { label: "Missed sessions", value: "2" },
];

const actions = [
  "Review clients who need rescheduling",
  "Sync Google Calendar updates",
  "Prepare this month&apos;s private invoices",
];

export default function DashboardPage() {
  return (
    <div className="workspace-grid">
      <section className="workspace-grid cols-3">
        {stats.map((item) => (
          <article key={item.label} className="panel">
            <div className="stat-value">{item.value}</div>
            <div className="stat-label">{item.label}</div>
          </article>
        ))}
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Today</h2>
          <table className="table">
            <tbody>
              <tr>
                <td>09:00</td>
                <td>Client A - Science</td>
                <td><span className="pill success">Completed</span></td>
              </tr>
              <tr>
                <td>13:00</td>
                <td>Client B - Maths</td>
                <td><span className="pill warning">Needs reschedule</span></td>
              </tr>
              <tr>
                <td>16:30</td>
                <td>Client C - English</td>
                <td><span className="pill neutral">Planned</span></td>
              </tr>
            </tbody>
          </table>
        </article>

        <article className="panel">
          <h2>Action queue</h2>
          <div className="workspace-grid">
            {actions.map((action) => (
              <div key={action} className="panel" style={{ padding: "16px", boxShadow: "none" }}>
                {action}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
