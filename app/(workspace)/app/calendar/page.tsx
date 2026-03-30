import { GoogleCalendarSync } from "@/components/google-calendar-sync";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview, listSyncs } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function CalendarPage() {
  const actor = await requireActor();
  const [overview, syncs] = await Promise.all([getWorkspaceOverview(actor), listSyncs(actor)]);
  const nextLessons = overview.upcomingSessions.slice(0, 4);
  const openSlots = ["Monday after 4:00 pm", "Wednesday before 6:00 pm", "Thursday after 5:30 pm", "Saturday morning"];

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

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Week at a glance</h2>
            <p>Keep the next few lessons easy to see.</p>
          </div>
        </div>
        <div className="workspace-grid cols-2">
          {nextLessons.length ? (
            nextLessons.map((session) => {
              const client = overview.clients.find((item) => item.id === session.clientId);
              return (
                <div key={session.id} className="list-card">
                  <strong>{client?.name || session.title}</strong>
                  <span>{formatShortDateTime(session.startsAt)}</span>
                  <span>{session.notes || "No notes saved yet."}</span>
                </div>
              );
            })
          ) : (
            <div className="empty-state">Your week will appear here once lessons are added.</div>
          )}
        </div>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Open slots</h2>
          <p className="stat-label">Good times to offer when someone needs a new slot.</p>
          <div className="workspace-grid">
            {openSlots.map((slot) => (
              <div key={slot} className="list-card">
                {slot}
              </div>
            ))}
          </div>
        </article>

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
      </section>

      <section className="panel">
        <h2>Sync history</h2>
        <div className="workspace-grid cols-2">
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
      </section>
    </div>
  );
}
