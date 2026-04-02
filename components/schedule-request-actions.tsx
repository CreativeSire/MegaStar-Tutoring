"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ScheduleRequestActionsProps = {
  requestId: string;
};

export function ScheduleRequestActions({ requestId }: ScheduleRequestActionsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<"accept" | "decline" | null>(null);
  const [pending, startTransition] = useTransition();

  const submitAction = (action: "accept" | "decline") => {
    startTransition(async () => {
      setPendingAction(action);
      const response = await fetch(`/api/schedule-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        router.refresh();
      }

      setPendingAction(null);
    });
  };

  return (
    <div className="action-row" style={{ marginTop: 12 }}>
      <button className="button button-primary" type="button" onClick={() => submitAction("accept")} disabled={pending}>
        {pendingAction === "accept" ? "Saving..." : "Accept"}
      </button>
      <button className="button button-secondary" type="button" onClick={() => submitAction("decline")} disabled={pending}>
        {pendingAction === "decline" ? "Saving..." : "Decline"}
      </button>
    </div>
  );
}
