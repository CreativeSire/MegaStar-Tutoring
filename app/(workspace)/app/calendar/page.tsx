import Link from "next/link";
import { AvailabilityManager } from "@/components/availability-manager";
import { GoogleCalendarSync } from "@/components/google-calendar-sync";
import { ScheduleRequestActions } from "@/components/schedule-request-actions";
import { PageIntro } from "@/components/page-intro";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview, listSyncs } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function minutesToLabel(minutes: number) {
  const total = Math.max(0, Math.min(24 * 60, Math.floor(minutes)));
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  const suffix = hours >= 12 ? "pm" : "am";
  const normalized = hours % 12 || 12;
  return `${normalized}:${String(mins).padStart(2, "0")} ${suffix}`;
}

function timeWindow(startMinute: number, endMinute: number) {
  return `${minutesToLabel(startMinute)} – ${minutesToLabel(endMinute)}`;
}

function getSessionDay(session: { startsAt: Date | string }) {
  return new Date(session.startsAt).getDay();
}

export default async function CalendarPage() {
  const actor = await requireActor();
  const [overview, syncs] = await Promise.all([getWorkspaceOverview(actor), listSyncs(actor)]);
  const market = overview.preferences.market;
  const activeBlocks = overview.availabilityBlocks.filter((block) => block.active);
  const upcomingSessions = overview.upcomingSessions.slice(0, 8);
  const pendingRequests = overview.scheduleRequests.filter((request) => request.status === "pending");

  const dayPlanner = weekdayLabels.map((label, dayOfWeek) => {
    const blocks = activeBlocks.filter((block) => block.dayOfWeek === dayOfWeek);
    const sessions = overview.sessions.filter((session) => getSessionDay(session) === dayOfWeek).slice(0, 4);
    return { label, dayOfWeek, blocks, sessions };
  });

  const conflictCards = overview.sessions
    .filter((session) => session.status === "planned" || session.status === "partial")
    .map((session) => {
      const starts = new Date(session.startsAt);
      const startMinute = starts.getHours() * 60 + starts.getMinutes();
      const duration = session.endsAt ? Math.max(15, Math.round((new Date(session.endsAt).getTime() - starts.getTime()) / 60000)) : overview.preferences.lessonLengthMinutes;
      const endMinute = startMinute + duration;
      const matchingBlock = activeBlocks.find(
        (block) => block.dayOfWeek === starts.getDay() && block.startMinute <= startMinute && block.endMinute >= endMinute,
      );
      return {
        id: session.id,
        title: session.title,
        clientName: overview.clients.find((client) => client.id === session.clientId)?.name || "Unassigned student",
        startsAt: session.startsAt,
        conflict: matchingBlock ? null : "Outside availability",
        suggestion: matchingBlock ? null : `Try ${weekdayLabels[starts.getDay()]} ${timeWindow(startMinute, Math.min(startMinute + duration, startMinute + 120))}.`,
      };
    })
    .filter((entry) => entry.conflict);

  const suggestions = activeBlocks.length
    ? activeBlocks.slice(0, 4).map((block) => `${weekdayLabels[block.dayOfWeek]} ${timeWindow(block.startMinute, block.endMinute)} · ${block.label}`)
    : overview.preferences.preferredDays
        .split(",")
        .map((day) => day.trim())
        .filter(Boolean)
        .map((day) => `${day} · ${overview.preferences.lessonLengthMinutes}-minute lessons`);

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Planner"
        title="Weekly planner and availability"
        description="Set teaching windows, catch conflicts early, and keep the live room aligned with the calendar."
        aside={
          <>
            <div className="list-card">
              <strong>{pendingRequests.length}</strong>
              <span>Pending requests</span>
            </div>
            <div className="list-card">
              <strong>{activeBlocks.length}</strong>
              <span>Availability blocks</span>
            </div>
            <div className="list-card">
              <strong>{conflictCards.length}</strong>
              <span>Conflicts found</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">{overview.syncs[0] ? "Calendar connected" : "Calendar ready"}</span>
        <span className="pill neutral">{overview.upcomingSessions.length} upcoming lessons</span>
        <span className="pill neutral">Live room aware</span>
      </PageIntro>

      <section className="workspace-grid cols-4">
        <article className="panel">
          <div className="stat-value">{pendingRequests.length}</div>
          <div className="stat-label">Pending requests</div>
        </article>
        <article className="panel">
          <div className="stat-value">{activeBlocks.length}</div>
          <div className="stat-label">Availability blocks</div>
        </article>
        <article className="panel">
          <div className="stat-value">{conflictCards.length}</div>
          <div className="stat-label">Conflicts found</div>
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

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Week at a glance</h2>
              <p>Availability blocks and lessons share the same rhythm.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {dayPlanner.map((day) => (
              <div key={day.dayOfWeek} className="list-card">
                <div className="audit-row">
                  <strong>{day.label}</strong>
                  <span>{day.blocks.length} block(s)</span>
                </div>
                <div className="table-subtle">
                  {day.blocks.length
                    ? day.blocks.map((block) => `${timeWindow(block.startMinute, block.endMinute)} · ${block.label}`).join(" • ")
                    : "No block set"}
                </div>
                <div className="table-subtle" style={{ marginTop: 8 }}>
                  {day.sessions.length
                    ? day.sessions
                        .map((session) => `${formatShortDateTime(session.startsAt, market)} · ${session.title}`)
                        .join(" • ")
                    : "No lessons on the board yet"}
                </div>
              </div>
            ))}
          </div>
        </article>

        <AvailabilityManager blocks={overview.availabilityBlocks} />
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Open slots and suggestions</h2>
          <p className="stat-label">Use these first when a reschedule comes in.</p>
          <div className="workspace-grid">
            {suggestions.length ? (
              suggestions.map((slot) => (
                <div key={slot} className="list-card">
                  {slot}
                </div>
              ))
            ) : (
              <div className="empty-state">Add availability blocks to unlock suggested teaching windows.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <h2>Conflicts and requests</h2>
          <div className="workspace-grid">
            {conflictCards.length ? (
              conflictCards.map((conflict) => (
                <div key={conflict.id} className="list-card tone-warm">
                  <div className="audit-row">
                    <strong>{conflict.title}</strong>
                    <span className="pill warning">Conflict</span>
                  </div>
                  <span>{conflict.clientName}</span>
                  <span>{formatShortDateTime(conflict.startsAt, market)}</span>
                  <span>{conflict.conflict}</span>
                  {conflict.suggestion ? <span className="table-subtle">{conflict.suggestion}</span> : null}
                </div>
              ))
            ) : (
              <div className="empty-state">No planner conflicts right now. Your blocks and sessions line up cleanly.</div>
            )}
          </div>

          <div className="workspace-grid" style={{ marginTop: 16 }}>
            {overview.scheduleRequests.length ? (
              overview.scheduleRequests.map((request) => {
                const client = overview.clients.find((item) => item.id === request.clientId);
                return (
                  <div key={request.id} className="list-card">
                    <div className="classroom-room-status" style={{ marginBottom: 10 }}>
                      <span
                        className={`room-status-chip ${
                          request.status === "pending"
                            ? "room-status-chip-live room-status-chip-pulse"
                            : request.status === "accepted"
                              ? "room-status-chip-saved"
                              : "room-status-chip-sync"
                        }`}
                      >
                        {request.status}
                      </span>
                      <span className="room-status-chip room-status-chip-present">{request.linkedSessionId ? "Linked" : "Unlinked"}</span>
                    </div>
                    <strong>{request.lessonTitle}</strong>
                    <span>{client?.name || "Unassigned student"}</span>
                    <span>{formatShortDateTime(request.requestedStartsAt, market)}</span>
                    <span>{request.reason}</span>
                    {request.details ? <span>{request.details}</span> : null}
                    {request.status === "pending" ? <ScheduleRequestActions requestId={request.id} /> : null}
                  </div>
                );
              })
            ) : (
              <div className="empty-state">No change requests yet. They appear here when a lesson needs a new slot.</div>
            )}
          </div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <h2>Upcoming lessons</h2>
          <div className="workspace-grid">
            {upcomingSessions.length ? (
              upcomingSessions.map((session) => {
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

      <section className="action-row">
        <Link href="/classroom" className="button button-primary">
          Open classroom
        </Link>
        <Link href="/app/library" className="button button-secondary">
          Lesson library
        </Link>
        <Link href="/app/invoices" className="button button-secondary">
          Invoice exports
        </Link>
      </section>
    </div>
  );
}
