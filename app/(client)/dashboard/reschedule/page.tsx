import Link from "next/link";
import { ScheduleRequestForm } from "@/components/schedule-request-form";
import { PageIntro } from "@/components/page-intro";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

function toLocalDatetimeInput(value: Date) {
  const timezoneOffset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default async function ClientReschedulePage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const market = overview.preferences.market;
  const now = new Date();
  const nextLesson = overview.upcomingSessions[0] || overview.recentSessions[0] || null;
  const nextLessonTitle = nextLesson?.title || "Change a lesson time";
  const initialRequestedStartsAt = nextLesson
    ? toLocalDatetimeInput(new Date(nextLesson.startsAt.getTime() + 7 * 86400000))
    : toLocalDatetimeInput(new Date(now.getTime() + 2 * 86400000));

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Change a time"
        title="Move a lesson without the fuss."
        description="Pick a new slot, leave a short note, and keep everything easy to review."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.scheduleRequests.length}</strong>
              <span>Requests sent</span>
            </div>
            <div className="list-card">
              <strong>{overview.upcomingSessions.length}</strong>
              <span>Lessons lined up</span>
            </div>
            <div className="list-card">
              <strong>{overview.syncs[0] ? "Connected" : "Ready"}</strong>
              <span>Calendar</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Simple request</span>
        <span className="pill neutral">Private to your tutor</span>
        <span className="pill neutral">Quick to review</span>
      </PageIntro>

      <section className="workspace-grid cols-2">
        <ScheduleRequestForm
          clients={overview.clients.map((client) => ({
            id: client.id,
            name: client.name,
            billTo: client.billTo,
          }))}
          initialLessonTitle={nextLessonTitle}
          initialRequestedStartsAt={initialRequestedStartsAt}
        />

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Requests waiting</h2>
              <p>Every change request in one calm list.</p>
            </div>
          </div>

          <div className="workspace-grid">
            {overview.scheduleRequests.length ? (
              overview.scheduleRequests.map((request) => {
                const client = overview.clients.find((item) => item.id === request.clientId);
                return (
                  <div key={request.id} className="list-card">
                    <strong>{request.lessonTitle}</strong>
                    <span>{client?.name || "Unassigned student"}</span>
                    <span>{formatShortDateTime(request.requestedStartsAt, market)}</span>
                    <span>{request.reason}</span>
                    <span>{request.details || "No extra note added."}</span>
                    <span className={`pill ${request.status === "pending" ? "warning" : request.status === "accepted" ? "success" : "neutral"}`}>
                      {request.status}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">No change requests yet. Send one when a lesson needs a new time.</div>
            )}
          </div>
        </article>
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Good times to offer</h2>
              <p>These are easy backup slots to suggest.</p>
            </div>
          </div>
          <div className="workspace-grid cols-2">
            {[
              "Monday after 4:00 pm",
              "Wednesday before 6:00 pm",
              "Thursday after 5:30 pm",
              "Saturday morning",
            ].map((slot) => (
              <div key={slot} className="list-card">
                {slot}
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Next lesson</h2>
              <p>The lesson you may want to move first.</p>
            </div>
          </div>
          {nextLesson ? (
            <div className="list-card">
              <strong>{nextLesson.title}</strong>
                    <span>{formatShortDateTime(nextLesson.startsAt, market)}</span>
              <span>{nextLesson.notes || "A short note from your tutor will appear here."}</span>
            </div>
          ) : (
            <div className="empty-state">Your next lesson will appear here when one is booked.</div>
          )}
          <div className="action-row" style={{ marginTop: 18 }}>
            <Link className="button button-primary" href="/classroom">
              Open classroom
            </Link>
            <Link className="button button-secondary" href="/dashboard/plan">
              Weekly plan
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
