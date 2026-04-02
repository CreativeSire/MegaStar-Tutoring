"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";

type RatingClient = {
  id: string;
  name: string;
  billTo: string;
};

type RatingSession = {
  id: string;
  title: string;
  startsAt: string;
  clientId: string | null;
  clientName: string;
};

type RatingFormProps = {
  clients: RatingClient[];
  sessions: RatingSession[];
};

export function RatingForm({ clients, sessions }: RatingFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [message, setMessage] = useState("Choose a finished lesson so the review stays verified.");

  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) || null,
    [sessions, selectedSessionId],
  );
  const linkedClientId = selectedSession?.clientId || "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Saving review...");
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not save the review.");
        return;
      }

      event.currentTarget.reset();
      setMessage("Review saved.");
      setSelectedSessionId("");
      setSelectedClientId("");
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Leave a review</h2>
          <p>Keep tutor feedback clear, private, and tied to a real lesson.</p>
        </div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Lesson</span>
          <select
            name="sessionId"
            value={selectedSessionId}
            onChange={(event) => setSelectedSessionId(event.target.value)}
          >
            <option value="">Choose a completed lesson</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title} - {session.clientName}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Student</span>
          <select
            name="clientId"
            value={linkedClientId || selectedClientId}
            onChange={(event) => setSelectedClientId(event.target.value)}
            disabled={Boolean(linkedClientId)}
          >
            <option value="">Unassigned</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.billTo}
              </option>
            ))}
          </select>
          <span className="field-hint">
            {linkedClientId ? "Linked to the selected lesson." : "Pick a student or choose a lesson to link it automatically."}
          </span>
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
          {pending ? "Saving..." : "Save verified review"}
        </button>
      </div>
      <p className="form-feedback">{message}</p>
    </form>
  );
}
