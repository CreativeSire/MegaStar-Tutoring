import Link from "next/link";
import { GoogleCalendarSync } from "@/components/google-calendar-sync";
import { ScheduleRequestActions } from "@/components/schedule-request-actions";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview, listSyncs } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

function getRequestTone(status: string) {
  if (status === "pending") {
    return "warning";
  }
  if (status === "accepted") {
    return "success";
  }
  return "neutral";
}

export default async function CalendarPage() {
  const actor = await requireActor();
  const [overview, syncs] = await Promise.all([getWorkspaceOverview(actor), listSyncs(actor)]);
  const market = overview.preferences.market;
  const nextLessons = overview.upcomingSessions.slice(0, 4);
  const pendingRequests = overview.scheduleRequests.filter((request) => request.status === "pending");
  const acceptedRequests = overview.scheduleRequests.filter((request) => request.status === "accepted");
  const declinedRequests = overview.scheduleRequests.filter((request) => request.status === "declined");
  const preferredDays = overview.preferences.preferredDays
    .split(",")
    .map((day) => day.trim())
    .filter(Boolean);
  const openSlots = preferredDays.length
    ? preferredDays.map((day) => `${day} · ${overview.preferences.lessonLengthMinutes}-minute lesson`)
    : ["Monday after 4:00 pm", "Wednesday before 6:00 pm", "Thursday after 5:30 pm", "Saturday morning"];

  return (
    <div className="workspace-grid">
      <section className="workspace-grid cols-4">
        <article className="panel">
          <div className="stat-value">{pendingRequests.length}</div>
          <div className="stat-label">Pending requests</div>
        </article>
        <article className="panel">
          <div className="stat-value">{acceptedRequests.length}</div>
          <div className="stat-label">Accepted requests</div>
        </article>
        <article className="panel">
          <div className="stat-value">{declinedRequests.length}</div>
          <div className="stat-label">Declined requests</div>
        </article>
        <article className="panel">
          <div className="stat-value">{overview.syncs[0] ? "Connected" : "Ready"}</div>
          <div className="stat-label">Calendar</div>
        </article>
      </section>

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
            nextLessons.map((session: (typeof nextLessons)[number]) => {
              const client = overview.clients.find((item) => item.id === session.clientId);
              return (
                <div key={session.id} className="list-card">
                  <strong>{client?.name || session.title}</strong>
                  <span>{formatShortDateTime(session.startsAt, market)}</span>
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
          <p className="stat-label">
            Good times to offer when someone needs a new slot.
            {overview.preferences.primaryGoal ? ` Focus: ${overview.preferences.primaryGoal}.` : null}
          </p>
          <div className="workspace-grid">
            {openSlots.map((slot) => (
              <div key={slot} className="list-card">
                {slot}
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h2>Requests waiting</h2>
          <p className="stat-label">Review, accept, or decline the changes in a few taps.</p>
          <div className="workspace-grid">
            {overview.scheduleRequests.length ? (
              overview.scheduleRequests.map((request) => {
                const client = overview.clients.find((item) => item.id === request.clientId);
                return (
                  <div key={request.id} className="list-card">
                    <div className="classroom-room-status" style={{ marginBottom: 10 }}>
                      <span className={`room-status-chip ${request.status === "pending" ? "room-status-chip-live room-status-chip-pulse" : request.status === "accepted" ? "room-status-chip-saved" : "room-status-chip-sync"}`}>
                        {request.status}
                      </span>
                      <span className="room-status-chip room-status-chip-present">{request.linkedSessionId ? "Linked" : "Unlinked"}</span>
                    </div>
                    <strong>{request.lessonTitle}</strong>
                    <span>{client?.name || "Unassigned student"}</span>
                    <span>{formatShortDateTime(request.requestedStartsAt, market)}</span>
                    <span>{request.reason}</span>
                    {request.details ? <span>{request.details}</span> : null}
                    <span className={`pill ${getRequestTone(request.status)}`}>{request.status}</span>
                    {request.status === "pending" ? <ScheduleRequestActions requestId={request.id} /> : null}
                  </div>
                );
              })
            ) : (
              <div className="empty-state">No change requests yet. They will appear here when lessons need a new slot.</div>
            )}
          </div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Upcoming sessions</h2>
          <div className="workspace-grid">
            {overview.upcomingSessions.length ? (
              overview.upcomingSessions.map((session: (typeof overview.upcomingSessions)[number]) => {
                const client = overview.clients.find((item) => item.id === session.clientId);
                return (
                  <div key={session.id} className="list-card">
                    <strong>{client?.name || session.title}</strong>
                    <span>{formatShortDateTime(session.startsAt, market)}</span>
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
          <h2>Calendar snapshot</h2>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>{overview.scheduleRequests.length}</strong>
              <span>Requests waiting</span>
            </div>
            <div className="list-card">
              <strong>{overview.syncs[0] ? "Connected" : "Ready"}</strong>
              <span>{overview.syncs[0] ? "Calendar is linked." : "Connect Google Calendar when you want live updates."}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="action-row">
        <Link href="/classroom" className="button button-primary">
          Open classroom
        </Link>
        <Link href="/app/library" className="button button-secondary">
          Lesson library
        </Link>
        <Link href="/app/compliance" className="button button-secondary">
          Review trail
        </Link>
      </section>

      <section className="panel">
        <h2>Sync history</h2>
        <div className="workspace-grid cols-2">
          {syncs.length ? (
            syncs.map((sync) => (
              <div key={sync.id} className="list-card">
                <strong>{sync.calendarId}</strong>
                <span>{formatShortDateTime(sync.lastSyncedAt, market)}</span>
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
