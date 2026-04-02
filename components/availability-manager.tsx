"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

type AvailabilityBlock = {
  id: string;
  dayOfWeek: number;
  startMinute: number;
  endMinute: number;
  label: string;
  notes: string;
  active: boolean;
};

type AvailabilityManagerProps = {
  blocks: AvailabilityBlock[];
};

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toTimeInput(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function AvailabilityManager({ blocks }: AvailabilityManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("Shape the weekly planner around the blocks you actually want to teach.");
  const [selectedDay, setSelectedDay] = useState(1);
  const [startMinute, setStartMinute] = useState("16:00");
  const [endMinute, setEndMinute] = useState("18:00");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Saving block...");
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not save the block.");
        return;
      }

      event.currentTarget.reset();
      setSelectedDay(1);
      setStartMinute("16:00");
      setEndMinute("18:00");
      setMessage("Availability updated.");
      router.refresh();
    });
  }

  async function deleteBlock(availabilityBlockId: string) {
    startTransition(async () => {
      const response = await fetch(`/api/availability/${availabilityBlockId}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("Availability block removed.");
        router.refresh();
      } else {
        setMessage("Could not remove the block.");
      }
    });
  }

  return (
    <section className="panel form-panel">
      <div className="section-head compact">
        <div>
          <h2>Weekly availability</h2>
          <p>Plan the live room around real teaching windows.</p>
        </div>
      </div>
      <form className="form-stack" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field">
            <span>Day</span>
            <select name="dayOfWeek" value={selectedDay} onChange={(event) => setSelectedDay(Number(event.target.value))}>
              {days.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Start time</span>
            <input
              name="startMinute"
              type="time"
              value={startMinute}
              onChange={(event) => setStartMinute(event.target.value)}
            />
          </label>
          <label className="field">
            <span>End time</span>
            <input name="endMinute" type="time" value={endMinute} onChange={(event) => setEndMinute(event.target.value)} />
          </label>
          <label className="field">
            <span>Label</span>
            <input name="label" placeholder="After school block" defaultValue="Available" />
          </label>
        </div>
        <label className="field">
          <span>Notes</span>
          <textarea name="notes" placeholder="Optional context for this block." />
        </label>
        <label className="field">
          <span>Status</span>
          <select name="active" defaultValue="true">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
        <div className="action-row">
          <button className="button button-primary" type="submit" disabled={pending}>
            {pending ? "Saving..." : "Add block"}
          </button>
        </div>
      </form>
      <p className="form-feedback">{message}</p>

      <div className="classroom-list" style={{ marginTop: 16 }}>
        {blocks.length ? (
          blocks.map((block) => (
            <div key={block.id} className="classroom-person-card">
              <div className="audit-row">
                <strong>{days[block.dayOfWeek] || "Day"}</strong>
                <span>{block.active ? "Active" : "Paused"}</span>
              </div>
              <span>
                {toTimeInput(block.startMinute)} - {toTimeInput(block.endMinute)}
              </span>
              <span>{block.label}</span>
              {block.notes ? <span className="table-subtle">{block.notes}</span> : null}
              <div className="action-row" style={{ marginTop: 8 }}>
                <button className="button button-secondary button-small" type="button" onClick={() => deleteBlock(block.id)} disabled={pending}>
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">Add your first teaching window to start shaping the week.</div>
        )}
      </div>
    </section>
  );
}
