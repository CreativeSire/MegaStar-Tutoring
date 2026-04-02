"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

type ScheduleClient = {
  id: string;
  name: string;
  billTo: string;
};

type ScheduleRequestFormProps = {
  clients: ScheduleClient[];
  initialLessonTitle: string;
  initialRequestedStartsAt: string;
};

const reasonChoices = ["School event", "Travel day", "Illness", "Need a different time"];

export function ScheduleRequestForm({ clients, initialLessonTitle, initialRequestedStartsAt }: ScheduleRequestFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("Send a calm request when a lesson needs a new slot.");

  if (!clients.length) {
    return (
      <section className="panel form-panel">
        <div className="section-head compact">
          <div>
            <h2>Ask for a new time</h2>
            <p>Add a student first so a request has somewhere to land.</p>
          </div>
        </div>
        <div className="empty-state">Once a student profile is ready, you can send a time change from here.</div>
      </section>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Sending request...");
      const response = await fetch("/api/schedule-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not send the request.");
        return;
      }

      event.currentTarget.reset();
      setMessage("Request sent.");
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Ask for a new time</h2>
          <p>Keep the request simple and easy to review.</p>
        </div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Student</span>
          <select name="clientId" defaultValue={clients[0]?.id || ""} required>
            <option value="">Choose a student</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} — {client.billTo}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Lesson name</span>
          <input name="lessonTitle" defaultValue={initialLessonTitle} placeholder="Math catch-up" required />
        </label>
        <label className="field">
          <span>New time</span>
          <input name="requestedStartsAt" type="datetime-local" defaultValue={initialRequestedStartsAt} required />
        </label>
        <label className="field">
          <span>Reason</span>
          <select name="reason" defaultValue={reasonChoices[0]} required>
            {reasonChoices.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Short note</span>
        <textarea name="details" placeholder="A small note for the tutor or family." />
      </label>
      <div className="action-row">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Sending..." : "Send request"}
        </button>
      </div>
      <p className="form-feedback">{message}</p>
    </form>
  );
}
