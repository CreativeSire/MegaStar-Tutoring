"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type RatingModerationActionsProps = {
  ratingId: string;
  currentStatus: string;
};

export function RatingModerationActions({ ratingId, currentStatus }: RatingModerationActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const updateStatus = (moderationStatus: "approved" | "pending" | "hidden") => {
    startTransition(async () => {
      const response = await fetch(`/api/ratings/${ratingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moderationStatus }),
      });

      if (response.ok) {
        router.refresh();
      }
    });
  };

  return (
    <div className="action-row" style={{ marginTop: 10 }}>
      <span className={`pill ${currentStatus === "approved" ? "success" : currentStatus === "hidden" ? "danger" : "warning"}`}>
        {currentStatus}
      </span>
      <button className="button button-secondary button-small" type="button" onClick={() => updateStatus("approved")} disabled={pending}>
        Approve
      </button>
      <button className="button button-secondary button-small" type="button" onClick={() => updateStatus("pending")} disabled={pending}>
        Pending
      </button>
      <button className="button button-secondary button-small" type="button" onClick={() => updateStatus("hidden")} disabled={pending}>
        Hide
      </button>
    </div>
  );
}
