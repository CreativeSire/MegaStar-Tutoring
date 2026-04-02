"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ScheduleRequestActionsProps = {
  requestId: string;
};

export function ScheduleRequestActions({ requestId }: ScheduleRequestActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<"accept" | "decline" | null>(null);
  const [statusMessage, setStatusMessage] = useState("Review the request and choose the best next step.");
  const [pending, startTransition] = useTransition();

  const submitAction = (action: "accept" | "decline") => {
    startTransition(async () => {
      setPendingAction(action);
      setStatusMessage(action === "accept" ? "Accepting the request..." : "Declining the request...");
      const response = await fetch(`/api/schedule-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatusMessage(action === "accept" ? "Request accepted and session linked." : "Request declined.");
        router.refresh();
      } else {
        setStatusMessage(payload?.error || "Unable to update the request right now.");
      }

      setPendingAction(null);
    });
  };

  return (
    <div className="schedule-request-actions">
      <div className="action-row">
        <button className="button button-primary" type="button" onClick={() => submitAction("accept")} disabled={pending}>
          {pendingAction === "accept" ? "Saving..." : "Accept"}
        </button>
        <button className="button button-secondary" type="button" onClick={() => submitAction("decline")} disabled={pending}>
          {pendingAction === "decline" ? "Saving..." : "Decline"}
        </button>
      </div>
      <p className="form-feedback">{statusMessage}</p>
    </div>
  );
}
