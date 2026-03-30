type ClientDetailPageProps = {
  params: Promise<{ clientId: string }>;
};

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { clientId } = await params;

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <h2>Client profile</h2>
        <p className="stat-label">Private record for client {clientId}.</p>
        <div className="action-row">
          <span className="pill neutral">Rate saved</span>
          <span className="pill neutral">Schedule linked</span>
          <span className="pill neutral">Invoices private</span>
        </div>
      </section>
      <section className="panel">
        <h2>Notes</h2>
        <p>Track frequency, preferred days, billing rules, session feedback, and any reschedule preferences here.</p>
      </section>
    </div>
  );
}
