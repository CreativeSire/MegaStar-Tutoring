import { PageIntro } from "@/components/page-intro";
import { formatMoney, formatShortDateTime } from "@/lib/format";
import { getInvoiceDrafts, getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function InvoicesPage() {
  const actor = await requireActor();
  const [overview, invoices] = await Promise.all([getWorkspaceOverview(actor), getInvoiceDrafts(actor)]);
  const latestInvoice = invoices[0];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Payments"
        title="Private invoice exports."
        description="Each export belongs to one student, one month, and one clean total."
        aside={
          <>
            <div className="list-card">
              <strong>{formatMoney(overview.billableTotal)}</strong>
              <span>Current total</span>
            </div>
            <div className="list-card">
              <strong>{invoices.length}</strong>
              <span>Draft exports</span>
            </div>
            <div className="list-card">
              <strong>{overview.sessionCount}</strong>
              <span>Lessons saved</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">{overview.clients.length} students</span>
        <span className="pill neutral">Month-based files</span>
        <span className="pill neutral">Kept private</span>
      </PageIntro>

      <section className="workspace-grid cols-3">
        <article className="panel">
          <div className="stat-value">{formatMoney(overview.billableTotal)}</div>
          <div className="stat-label">Ready to export</div>
        </article>
        <article className="panel">
          <div className="stat-value">{invoices.length}</div>
          <div className="stat-label">Drafts prepared</div>
        </article>
        <article className="panel">
          <div className="stat-value">{latestInvoice ? formatShortDateTime(latestInvoice.lastSession.startsAt) : "—"}</div>
          <div className="stat-label">Latest lesson included</div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Invoice drafts</h2>
          <p className="stat-label">A tidy list of exports waiting for the month to close.</p>
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
              <div className="empty-state">Add a student and a few lessons before building invoices.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>How exports stay private</h2>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>One student only</strong>
              <span>Each file stays tied to the selected student.</span>
            </div>
            <div className="list-card">
              <strong>Correct totals</strong>
              <span>Only lessons in the chosen period are counted.</span>
            </div>
            <div className="list-card">
              <strong>Automatic name</strong>
              <span>The file name follows the month and year.</span>
            </div>
            <div className="list-card">
              <strong>Latest update</strong>
              <span>{latestInvoice ? formatShortDateTime(latestInvoice.lastSession.startsAt) : "No lessons yet"}</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
