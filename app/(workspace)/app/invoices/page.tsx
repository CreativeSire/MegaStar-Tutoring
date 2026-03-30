import { formatMoney, formatShortDateTime } from "@/lib/format";
import { getInvoiceDrafts } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function InvoicesPage() {
  const actor = await requireActor();
  const invoices = await getInvoiceDrafts(actor);

  return (
    <div className="workspace-grid cols-2">
      <section className="panel">
        <h2>Invoice drafts</h2>
        <div className="workspace-grid">
          {invoices.length ? (
            invoices.map((invoice) => (
              <div key={invoice.client.id} className="list-card">
                <strong>{invoice.client.name}</strong>
                <span>{invoice.fileName}</span>
                <span>{invoice.sessionCount} billable session(s)</span>
                <span>{formatMoney(invoice.totalCents)}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">Add a client and a few sessions before building invoices.</div>
          )}
        </div>
      </section>

      <section className="panel">
        <h2>Private export rules</h2>
        <div className="workspace-grid">
          <div className="list-card">
            <strong>One client only</strong>
            <span>Each export stays private to the selected client.</span>
          </div>
          <div className="list-card">
            <strong>Correct totals</strong>
            <span>Only billable sessions in the chosen period are counted.</span>
          </div>
          <div className="list-card">
            <strong>Workbook name</strong>
            <span>Files are named from the month and year automatically.</span>
          </div>
          <div className="list-card">
            <strong>Latest update</strong>
            <span>{invoices[0]?.lastSession ? formatShortDateTime(invoices[0].lastSession.startsAt) : "No sessions yet"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
