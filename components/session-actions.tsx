"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type SessionActionsProps = {
  sessionId: string;
  currentStatus: string;
};

export function SessionActions({ sessionId, currentStatus }: SessionActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const statusLabel = currentStatus === "partial" ? "Live" : currentStatus;

  const submitAction = (status: "completed" | "missed" | "rescheduled" | "partial" | "planned") => {
    startTransition(async () => {
      setPendingAction(status);
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          notes: status === "completed" ? "Lesson marked complete from the lesson log." : "",
        }),
      });

      if (response.ok) {
        router.refresh();
      }

      setPendingAction(null);
    });
  };

  if (currentStatus === "completed") {
    return <span className="room-status-chip room-status-chip-saved">Saved to lesson trail</span>;
  }

  return (
    <div className="action-row" style={{ marginTop: 8 }}>
      {currentStatus === "partial" ? <span className="room-status-chip room-status-chip-live">{statusLabel}</span> : null}
      <button className="button button-primary button-small" type="button" onClick={() => submitAction("completed")} disabled={pending}>
        {pendingAction === "completed" ? "Saving..." : "Mark complete"}
      </button>
      <button className="button button-secondary button-small" type="button" onClick={() => submitAction("missed")} disabled={pending}>
        {pendingAction === "missed" ? "Saving..." : "Mark missed"}
      </button>
    </div>
  );
}
