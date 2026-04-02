"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type InvoiceStatusActionsProps = {
  invoiceId: string;
  currentStatus: "draft" | "sent" | "paid";
};

export function InvoiceStatusActions({ invoiceId, currentStatus }: InvoiceStatusActionsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setStatus = (status: "draft" | "sent" | "paid") => {
    startTransition(async () => {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      }
    });
  };

  return (
    <div className="action-row" style={{ marginTop: 10 }}>
      <span className={`pill ${currentStatus === "paid" ? "success" : currentStatus === "sent" ? "warning" : "neutral"}`}>{currentStatus}</span>
      <button className="button button-secondary button-small" type="button" onClick={() => setStatus("draft")} disabled={pending}>
        Draft
      </button>
      <button className="button button-secondary button-small" type="button" onClick={() => setStatus("sent")} disabled={pending}>
        Sent
      </button>
      <button className="button button-secondary button-small" type="button" onClick={() => setStatus("paid")} disabled={pending}>
        Paid
      </button>
    </div>
  );
}
