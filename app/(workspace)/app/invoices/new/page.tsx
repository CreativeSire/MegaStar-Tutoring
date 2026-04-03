import Link from "next/link";
import { InvoiceBuilderForm } from "@/components/invoice-builder-form";
import { PageIntro } from "@/components/page-intro";
import { formatMoney } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function NewInvoicePage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="New invoice"
        title="Build a private export from the lesson trail."
        description="Choose a student, set the period, and export a clean record without leaving the page."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.clients.length}</strong>
              <span>Students ready</span>
            </div>
            <div className="list-card">
              <strong>{formatMoney(overview.billableTotal, market)}</strong>
              <span>Total lesson value</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Private export</span>
        <span className="pill neutral">One student</span>
        <span className="pill neutral">Saved trail</span>
        <Link href="/app/invoices" className="button button-secondary">
          Back to invoices
        </Link>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <InvoiceBuilderForm
          clients={overview.clients.map((client) => ({
            id: client.id,
            name: client.name,
            billTo: client.billTo,
          }))}
          market={market}
        />

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>What happens next</h2>
              <p>A small guide for the export flow.</p>
            </div>
          </div>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>Pick the student</strong>
              <span>Use one client profile per export.</span>
            </div>
            <div className="list-card">
              <strong>Choose the period</strong>
              <span>Only lessons in the selected range are counted.</span>
            </div>
            <div className="list-card">
              <strong>Export and save</strong>
              <span>The saved file lands back in the invoice list.</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
