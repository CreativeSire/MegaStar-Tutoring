"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DownloadButton } from "@/components/download-button";
import { formatMonthYear } from "@/lib/format";

type InvoiceClient = {
  id: string;
  name: string;
  billTo: string;
};

type InvoiceBuilderFormProps = {
  clients: InvoiceClient[];
  market: string;
};

function toDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

export function InvoiceBuilderForm({ clients, market }: InvoiceBuilderFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("Build a private export for one student and one billing period.");
  const [downloadName, setDownloadName] = useState("");
  const [exportContent, setExportContent] = useState("");
  const today = useMemo(() => new Date(), []);
  const startOfMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth(), 1), [today]);
  const endOfMonth = useMemo(() => new Date(today.getFullYear(), today.getMonth() + 1, 0), [today]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Building invoice...");
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not build the invoice.");
        return;
      }

      setDownloadName(result.fileName || "invoice.csv");
      setExportContent(result.exportContent || "");
      setMessage(`Invoice ready for ${result.invoice?.clientNameSnapshot || "student"}.`);
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Build invoice</h2>
          <p>Create a clean export from one student and one date range.</p>
        </div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Student</span>
          <select name="clientId" defaultValue={clients[0]?.id || ""} required>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.billTo}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Period start</span>
          <input name="periodStart" type="date" defaultValue={toDateInput(startOfMonth)} required />
        </label>
        <label className="field">
          <span>Period end</span>
          <input name="periodEnd" type="date" defaultValue={toDateInput(endOfMonth)} required />
        </label>
        <label className="field">
          <span>Export format</span>
          <select name="exportFormat" defaultValue="csv">
            <option value="csv">CSV</option>
            <option value="xlsx">Spreadsheet</option>
            <option value="pdf">PDF-ready text</option>
          </select>
        </label>
      </div>
      <div className="action-row">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Building..." : "Build export"}
        </button>
        {exportContent && downloadName ? <DownloadButton label="Download export" filename={downloadName} content={exportContent} /> : null}
      </div>
      <p className="form-feedback">{message}</p>
      <p className="table-subtle">The month label is {formatMonthYear(today, market)} for quick context.</p>
    </form>
  );
}
