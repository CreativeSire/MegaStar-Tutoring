"use client";

import { useMemo, useState, useTransition } from "react";

type GoogleClient = {
  id: string;
  name: string;
  billTo: string;
};

type GoogleCalendarSyncProps = {
  googleClientId: string;
  clients: GoogleClient[];
};

type CalendarEvent = {
  externalEventId: string;
  clientId: string | null;
  title: string;
  startsAt: string;
  endsAt: string | null;
  billable: boolean;
  amountCents: number;
  notes: string;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: { access_token?: string }) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const GOOGLE_SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

export function GoogleCalendarSync({ googleClientId, clients }: GoogleCalendarSyncProps) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState("Connect Google to sync lessons into the log.");
  const [calendarId, setCalendarId] = useState("primary");
  const [token, setToken] = useState("");
  const [loadingScript, setLoadingScript] = useState(false);
  const clientLookup = useMemo(
    () =>
      clients.map((client) => ({
        ...client,
        nameTokens: [client.name.toLowerCase(), client.billTo.toLowerCase()],
      })),
    [clients],
  );

  function ensureScript() {
    if (window.google?.accounts?.oauth2) return Promise.resolve();
    setLoadingScript(true);
    return new Promise<void>((resolve, reject) => {
      const existing = document.getElementById("google-identity-script");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "google-identity-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setLoadingScript(false);
          resolve();
        };
        script.onerror = () => {
          setLoadingScript(false);
          reject(new Error("Could not load Google sign-in."));
        };
        document.head.appendChild(script);
        return;
      }

      const check = window.setInterval(() => {
        if (window.google?.accounts?.oauth2) {
          window.clearInterval(check);
          setLoadingScript(false);
          resolve();
        }
      }, 100);

      window.setTimeout(() => {
        window.clearInterval(check);
        setLoadingScript(false);
        reject(new Error("Google sign-in did not initialize in time."));
      }, 10000);
    });
  }

  function inferClientId(summary: string) {
    const lowerSummary = summary.toLowerCase();
    const match = clientLookup.find((client) => client.nameTokens.some((tokenText) => tokenText && lowerSummary.includes(tokenText)));
    return match?.id || null;
  }

  async function connectGoogle() {
    if (!googleClientId) {
      setStatus("Add NEXT_PUBLIC_GOOGLE_CLIENT_ID before connecting.");
      return;
    }
    await ensureScript();
    const tokenClient = window.google?.accounts?.oauth2?.initTokenClient({
      client_id: googleClientId,
      scope: GOOGLE_SCOPE,
      callback: (response) => {
        if (response.access_token) {
          setToken(response.access_token);
          setStatus("Connected. Ready to sync Calendar.");
        } else {
          setStatus("Google sign-in did not return a token.");
        }
      },
    });

    if (!tokenClient) {
      setStatus("Google sign-in is unavailable right now.");
      return;
    }

    setStatus("Opening Google sign-in...");
    tokenClient.requestAccessToken({ prompt: "consent" });
  }

  async function syncCalendar() {
    if (!token) {
      setStatus("Connect Google first.");
      return;
    }

    startTransition(async () => {
      setStatus("Fetching events...");
      const today = new Date();
      const rangeStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const rangeEnd = new Date(today.getFullYear(), today.getMonth(), 1);
      const params = new URLSearchParams({
        timeMin: rangeStart.toISOString(),
        timeMax: rangeEnd.toISOString(),
        singleEvents: "true",
        orderBy: "startTime",
        maxResults: "2500",
        fields: "items(id,summary,start,end),nextPageToken",
      });

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId || "primary")}/events?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        setStatus(`Google Calendar request failed (${response.status}).`);
        return;
      }

      const payload = (await response.json()) as {
        items?: Array<{
          id?: string;
          summary?: string;
          start?: { dateTime?: string; date?: string };
          end?: { dateTime?: string; date?: string };
        }>;
      };

      const normalizedEvents: CalendarEvent[] = (payload.items || [])
        .map((event) => {
          const startsAt = event.start?.dateTime || event.start?.date || "";
          const title = String(event.summary || "Google Calendar session").trim();
          if (!startsAt) return null;
          return {
            externalEventId: String(event.id || `${title}-${startsAt}`),
            clientId: inferClientId(title),
            title,
            startsAt,
            endsAt: event.end?.dateTime || event.end?.date || null,
            billable: true,
            amountCents: 0,
            notes: "Imported from Google Calendar.",
          };
        })
        .filter((event): event is CalendarEvent => Boolean(event));

      const importResponse = await fetch("/api/calendar/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          calendarId: calendarId || "primary",
          events: normalizedEvents,
        }),
      });

      const result = await importResponse.json().catch(() => ({}));
      if (!importResponse.ok) {
        setStatus(result?.error || "Could not save calendar events.");
        return;
      }

      setStatus(`Synced ${result.imported || 0} events into the session log.`);
    });
  }

  return (
    <section className="panel form-panel">
      <div className="section-head compact">
        <div>
          <h2>Google Calendar sync</h2>
          <p>Bring in availability and lesson history without exposing other clients.</p>
        </div>
      </div>
      <div className="form-grid">
        <label className="field">
          <span>Calendar ID</span>
          <input value={calendarId} onChange={(event) => setCalendarId(event.target.value)} placeholder="primary" />
        </label>
        <label className="field">
          <span>Google sign-in</span>
          <input
            value={googleClientId ? "Configured in environment" : "Set NEXT_PUBLIC_GOOGLE_CLIENT_ID"}
            readOnly
            placeholder="Set NEXT_PUBLIC_GOOGLE_CLIENT_ID"
          />
        </label>
      </div>
      <div className="action-row">
        <button className="button button-secondary" type="button" onClick={connectGoogle} disabled={pending || loadingScript}>
          {loadingScript ? "Loading..." : "Connect Google"}
        </button>
        <button className="button button-primary" type="button" onClick={syncCalendar} disabled={pending || !token}>
          {pending ? "Syncing..." : "Sync Calendar"}
        </button>
      </div>
      <p className="form-feedback">{status}</p>
    </section>
  );
}
