"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition, type FormEvent } from "react";
import { listMarketProfiles } from "@/lib/market";

type WorkspacePreferences = {
  market: string;
  preferredDays: string;
  lessonLengthMinutes: number;
  primaryGoal: string;
  onboardingCompletedAt: string | null;
};

type WorkspacePreferencesFormProps = {
  preferences: WorkspacePreferences;
};

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const marketOptions = listMarketProfiles();

export function WorkspacePreferencesForm({ preferences }: WorkspacePreferencesFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const initialDays = useMemo(
    () => preferences.preferredDays.split(",").map((item) => item.trim()).filter(Boolean),
    [preferences.preferredDays],
  );
  const [selectedDays, setSelectedDays] = useState<string[]>(initialDays);
  const [message, setMessage] = useState(
    preferences.onboardingCompletedAt ? "Your setup is already saved. You can fine-tune it anytime." : "Set the rhythm once and keep moving.",
  );

  useEffect(() => {
    setSelectedDays(initialDays);
  }, [initialDays]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      setMessage("Saving your setup...");
      const response = await fetch("/api/workspace/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(result?.error || "Could not save the setup.");
        return;
      }

      setMessage("Setup saved.");
      router.refresh();
    });
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="section-head compact">
        <div>
          <h2>Your setup</h2>
          <p>Keep the weekly rhythm simple so lessons, time changes, and the classroom all stay aligned.</p>
        </div>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Market</span>
          <select name="market" defaultValue={preferences.market || "uk"}>
            {marketOptions.map((market) => (
              <option key={market.key} value={market.key}>
                {market.label} · {market.currency}
              </option>
            ))}
          </select>
          <small className="table-subtle">Pick the region that matches how you bill and format lesson dates.</small>
        </label>

        <label className="field">
          <span>Preferred days</span>
          <div className="day-chips">
            {dayOptions.map((day) => {
              const selected = selectedDays.includes(day);
              return (
                <label key={day} className={`day-chip ${selected ? "is-selected" : ""}`}>
                  <input
                    type="checkbox"
                    value={day}
                    checked={selected}
                    onChange={(event) => {
                      setSelectedDays((current) =>
                        event.currentTarget.checked ? [...current, day] : current.filter((item) => item !== day),
                      );
                    }}
                  />
                  <span>{day}</span>
                </label>
              );
            })}
            <input type="hidden" name="preferredDays" value={selectedDays.join(", ")} readOnly />
          </div>
        </label>

        <label className="field">
          <span>Lesson length</span>
          <select name="lessonLengthMinutes" defaultValue={String(preferences.lessonLengthMinutes || 60)}>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>Main goal</span>
        <textarea name="primaryGoal" defaultValue={preferences.primaryGoal} placeholder="What should this workspace help you achieve?" />
      </label>

      <div className="action-row">
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save setup"}
        </button>
      </div>
      <p className="form-feedback">{message}</p>
    </form>
  );
}
