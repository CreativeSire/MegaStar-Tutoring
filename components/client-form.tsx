"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

export function ClientForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("Keep the profile simple and private.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Saving student...");
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not save the student.");
        return;
      }

      event.currentTarget.reset();
      setMessage("Student saved.");
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Add student</h2>
          <p>Keep each profile private, with its own rate, rhythm, and notes.</p>
        </div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Student name</span>
          <input name="name" placeholder="Student A" required />
        </label>
        <label className="field">
          <span>Billing name</span>
          <input name="billTo" placeholder="Student A Family" required />
        </label>
        <label className="field">
          <span>Rate per lesson</span>
          <input name="rateCents" type="number" min="0" step="1" placeholder="1500" required />
        </label>
        <label className="field">
          <span>Lessons each week</span>
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
        <textarea name="notes" placeholder="Rhythm notes, lesson preferences, or anything useful." />
      </label>
      <div className="action-row">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save student"}
        </button>
      </div>
      <p className="form-feedback">{message}</p>
    </form>
  );
}
