"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

type ClientReviewFormProps = {
  clients: { id: string; name: string; billTo: string }[];
  sessions: { id: string; title: string; startsAt: string; clientId: string | null; clientName: string }[];
};

export function ClientReviewForm({ clients, sessions }: ClientReviewFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("Share a short note after a lesson so the loop stays useful.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Submitting feedback...");
      const response = await fetch("/api/client/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not submit the feedback.");
        return;
      }

      event.currentTarget.reset();
      setMessage("Feedback shared.");
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Client feedback</h2>
          <p>Leave a note that helps the next lesson feel smoother.</p>
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
          <span>Lesson</span>
          <select name="sessionId" defaultValue="">
            <option value="">Optional</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title} — {session.clientName}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Score</span>
          <input name="score" type="number" min="1" max="5" step="1" defaultValue="5" required />
        </label>
        <label className="field">
          <span>Category</span>
          <select name="category" defaultValue="overall">
            <option value="overall">Overall</option>
            <option value="clarity">Clarity</option>
            <option value="support">Support</option>
            <option value="pace">Pace</option>
            <option value="communication">Communication</option>
          </select>
        </label>
      </div>
      <label className="field">
        <span>Comment</span>
        <textarea name="comment" placeholder="What worked well, what could be better?" />
      </label>
      <div className="action-row">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Submitting..." : "Send feedback"}
        </button>
      </div>
      <p className="form-feedback">{message}</p>
    </form>
  );
}
