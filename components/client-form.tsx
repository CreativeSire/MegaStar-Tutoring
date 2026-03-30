"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

export function ClientForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("The record stays scoped to your workspace.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Saving client...");
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not save the client.");
        return;
      }

      event.currentTarget.reset();
      setMessage("Client saved.");
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Add client</h2>
          <p>Keep the client record private, with its own rate, schedule, and notes.</p>
        </div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Name</span>
          <input name="name" placeholder="Client A" required />
        </label>
        <label className="field">
          <span>Bill to</span>
          <input name="billTo" placeholder="Client A Family" required />
        </label>
        <label className="field">
          <span>Rate per session</span>
          <input name="rateCents" type="number" min="0" step="1" placeholder="1500" required />
        </label>
        <label className="field">
          <span>Meetings per week</span>
          <input name="meetingsPerWeek" type="number" min="0" step="1" placeholder="3" required />
        </label>
        <label className="field">
          <span>Preferred days</span>
          <input name="preferredDays" placeholder="Mon, Wed, Fri" />
        </label>
        <label className="field">
          <span>Status</span>
          <select name="status" defaultValue="active">
            <option value="active">Active</option>
            <option value="needs_attention">Needs attention</option>
            <option value="paused">Paused</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Notes</span>
        <textarea name="notes" placeholder="Reschedule rules, billing notes, or anything useful." />
      </label>
      <div className="action-row">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save client"}
        </button>
      </div>
      <p className="form-feedback">{message}</p>
    </form>
  );
}
