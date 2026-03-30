"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

type SessionClient = {
  id: string;
  name: string;
  billTo: string;
};

type SessionFormProps = {
  clients: SessionClient[];
};

export function SessionForm({ clients }: SessionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("Use this for manual logs or imported calendar matches.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Saving session...");
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not save the session.");
        return;
      }

      event.currentTarget.reset();
      setMessage("Session saved.");
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Add session</h2>
          <p>Log manual lessons, missed time, and Google-imported sessions in one place.</p>
        </div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Client</span>
          <select name="clientId" defaultValue="">
            <option value="">Unassigned</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.billTo}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Title</span>
          <input name="title" placeholder="Science revision" required />
        </label>
        <label className="field">
          <span>Starts at</span>
          <input name="startsAt" type="datetime-local" required />
        </label>
        <label className="field">
          <span>Ends at</span>
          <input name="endsAt" type="datetime-local" />
        </label>
        <label className="field">
          <span>Status</span>
          <select name="status" defaultValue="planned">
            <option value="planned">Planned</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="rescheduled">Rescheduled</option>
            <option value="partial">Partial</option>
          </select>
        </label>
        <label className="field">
          <span>Source</span>
          <select name="source" defaultValue="manual">
            <option value="manual">Manual</option>
            <option value="google">Google Calendar</option>
          </select>
        </label>
        <label className="field">
          <span>Amount</span>
          <input name="amountCents" type="number" min="0" step="1" placeholder="1500" required />
        </label>
        <label className="field">
          <span>Billable</span>
          <select name="billable" defaultValue="true">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Notes</span>
        <textarea name="notes" placeholder="What happened, what needs follow-up, or why it was missed." />
      </label>
      <div className="action-row">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save session"}
        </button>
      </div>
      <p className="form-feedback">{message}</p>
    </form>
  );
}

