import { GoogleCalendarSync } from "@/components/google-calendar-sync";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview, listSyncs } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function CalendarPage() {
  const actor = await requireActor();
  const [overview, syncs] = await Promise.all([getWorkspaceOverview(actor), listSyncs(actor)]);

  return (
    <div className="workspace-grid">
      <GoogleCalendarSync
        googleClientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}
        clients={overview.clients.map((client) => ({
          id: client.id,
          name: client.name,
          billTo: client.billTo,
        }))}
      />

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Upcoming sessions</h2>
          <div className="workspace-grid">
            {overview.upcomingSessions.length ? (
              overview.upcomingSessions.map((session) => {
                const client = overview.clients.find((item) => item.id === session.clientId);
                return (
                  <div key={session.id} className="list-card">
                    <strong>{client?.name || session.title}</strong>
                    <span>{formatShortDateTime(session.startsAt)}</span>
                    <span>{session.notes || "No notes saved"}</span>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">Use the calendar to plan the next week of lessons.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>Sync history</h2>
          <div className="workspace-grid">
            {syncs.length ? (
              syncs.map((sync) => (
                <div key={sync.id} className="list-card">
                  <strong>{sync.calendarId}</strong>
                  <span>{formatShortDateTime(sync.lastSyncedAt)}</span>
                  <span>{sync.eventsImported} event(s) imported</span>
                  <span>{sync.statusMessage}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">No syncs yet. Connect Google Calendar to start importing.</div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
