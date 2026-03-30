"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

type RatingClient = {
  id: string;
  name: string;
  billTo: string;
};

type RatingFormProps = {
  clients: RatingClient[];
};

export function RatingForm({ clients }: RatingFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("This stays internal until you choose to expose it.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Saving feedback...");
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not save the rating.");
        return;
      }

      event.currentTarget.reset();
      setMessage("Feedback saved.");
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Record feedback</h2>
          <p>Track tutor quality with verified ratings instead of public guessing.</p>
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
          <span>Score</span>
          <input name="score" type="number" min="1" max="5" step="1" placeholder="5" required />
        </label>
        <label className="field">
          <span>Category</span>
          <select name="category" defaultValue="overall">
            <option value="overall">Overall</option>
            <option value="punctuality">Punctuality</option>
            <option value="communication">Communication</option>
            <option value="teaching">Teaching</option>
            <option value="responsiveness">Responsiveness</option>
          </select>
        </label>
        <label className="field">
          <span>Comment</span>
          <input name="comment" placeholder="Clear explanations and on-time every week." />
        </label>
      </div>
      <div className="action-row">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save feedback"}
        </button>
      </div>
      <p className="form-feedback">{message}</p>
    </form>
  );
}

