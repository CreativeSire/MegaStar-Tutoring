export default function InvoicesPage() {
  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <h2>Invoice history</h2>
        <table className="table">
          <tbody>
            <tr><td>Client A - March</td><td>Ready</td></tr>
            <tr><td>Client B - February</td><td>Sent</td></tr>
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>Invoice builder</h2>
        <p className="stat-label">Choose one client, pull their sessions, and export a private invoice only for them.</p>
        <div className="action-row">
          <span className="pill success">Excel export</span>
          <span className="pill neutral">Private output</span>
        </div>
      </section>
    </div>
  );
}
