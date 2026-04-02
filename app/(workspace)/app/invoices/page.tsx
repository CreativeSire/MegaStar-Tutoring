import { InvoiceBuilderForm } from "@/components/invoice-builder-form";
import { InvoiceStatusActions } from "@/components/invoice-status-actions";
import { PageIntro } from "@/components/page-intro";
import { DownloadButton } from "@/components/download-button";
import { buildInvoiceExportContent, getInvoiceDrafts, getWorkspaceOverview, listInvoices, parseInvoiceLineItems } from "@/lib/repository";
import { formatMoney, formatShortDateTime } from "@/lib/format";
import { requireActor } from "@/lib/current-actor";

function toPseudoSession(lineItem: ReturnType<typeof parseInvoiceLineItems>[number]) {
  return {
    id: lineItem.sessionId || lineItem.title || "line-item",
    ownerUserId: "",
    clientId: null,
    title: lineItem.title || "Lesson",
    startsAt: new Date(lineItem.startsAt || Date.now()),
    endsAt: null,
    status: "completed" as const,
    source: "manual" as const,
    billable: true,
    amountCents: lineItem.amountCents || 0,
    notes: lineItem.notes || "",
    externalEventId: null,
    createdAt: new Date(lineItem.startsAt || Date.now()),
  };
}

export default async function InvoicesPage() {
  const actor = await requireActor();
  const [overview, drafts, invoices] = await Promise.all([getWorkspaceOverview(actor), getInvoiceDrafts(actor), listInvoices(actor)]);
  const market = overview.preferences.market;
  const latestInvoice = invoices[0];

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Payments"
        title="Invoice exports with a real handoff."
        description="Build a private export, review the line items, and keep a clean monthly trail."
        aside={
          <>
            <div className="list-card">
              <strong>{formatMoney(overview.billableTotal, market)}</strong>
              <span>Current total</span>
            </div>
            <div className="list-card">
              <strong>{drafts.length}</strong>
              <span>Draft exports</span>
            </div>
            <div className="list-card">
              <strong>{invoices.length}</strong>
              <span>Saved invoices</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">{overview.clients.length} students</span>
        <span className="pill neutral">Month-based files</span>
        <span className="pill neutral">Private exports</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <InvoiceBuilderForm clients={overview.clients.map((client) => ({ id: client.id, name: client.name, billTo: client.billTo }))} market={market} />

        <section className="panel">
          <div className="section-head compact">
            <div>
              <h2>Saved invoices</h2>
              <p>Each export keeps the lesson trail in one neat place.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {invoices.length ? (
              invoices.map((invoice) => {
                const client = overview.clients.find((entry) => entry.id === invoice.clientId);
                const lineItems = parseInvoiceLineItems(invoice.lineItemsJson);
                const exportContent = buildInvoiceExportContent(
                  invoice,
                  client || null,
                  lineItems.map(toPseudoSession),
                  market,
                );
                return (
                  <div key={invoice.id} className="list-card">
                    <div className="audit-row">
                      <strong>{invoice.invoiceNumber || invoice.fileName}</strong>
                      <span className={`pill ${invoice.status === "paid" ? "success" : invoice.status === "sent" ? "warning" : "neutral"}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <span>{client?.name || invoice.clientNameSnapshot || "Student"}</span>
                    <span>{invoice.fileName}</span>
                    <span>{formatShortDateTime(invoice.periodStart, market)} - {formatShortDateTime(invoice.periodEnd, market)}</span>
                    <span>{formatMoney(invoice.totalCents, market)}</span>
                    <span>{lineItems.length} line item(s)</span>
                    <InvoiceStatusActions invoiceId={invoice.id} currentStatus={invoice.status} />
                    <div className="action-row" style={{ marginTop: 10 }}>
                      <DownloadButton label="Download export" filename={invoice.fileName} content={exportContent} />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">No saved invoices yet. Build one on the left.</div>
            )}
          </div>
        </section>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Invoice drafts</h2>
          <p className="stat-label">Drafts are grouped by student and updated from the lesson log.</p>
          <div className="workspace-grid">
            {drafts.length ? (
              drafts.map((invoice) => (
                <div key={invoice.client.id} className="list-card">
                  <strong>{invoice.client.name}</strong>
                  <span>{invoice.fileName}</span>
                  <span>{invoice.sessionCount} billable session(s)</span>
                  <span>{formatMoney(invoice.totalCents, market)}</span>
                  <span>{invoice.lastSession ? formatShortDateTime(invoice.lastSession.startsAt, market) : "No lesson yet"}</span>
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
              <strong>Automatic naming</strong>
              <span>The file name follows the month, student, and format.</span>
            </div>
            <div className="list-card">
              <strong>Latest update</strong>
              <span>{latestInvoice?.createdAt ? formatShortDateTime(latestInvoice.createdAt, market) : "No invoices yet"}</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
