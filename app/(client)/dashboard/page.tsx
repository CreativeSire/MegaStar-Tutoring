import Link from "next/link";
import { formatMoney, formatShortDateTime, formatScore } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireClientActor } from "@/lib/current-actor";

const quickNotes = [
  "Check the next lesson time",
  "Review your recent notes",
  "Ask for a new slot if needed",
];

export default async function ClientDashboardPage() {
  const actor = await requireClientActor();
  const overview = await getWorkspaceOverview(actor);
  const studentName = overview.profile.displayName;
  const nextLesson = overview.upcomingSessions[0] || overview.recentSessions[0] || null;
  const nextLessonList = overview.upcomingSessions.slice(0, 3);
  const lessonCount = overview.activeSessionCount || overview.sessionCount;
  const calendarStatus = overview.syncs[0]?.statusMessage || "Calendar ready";

  return (
    <div className="student-dashboard">
      <section className="student-hero panel">
        <div className="student-hero-copy">
          <span className="eyebrow">Student area</span>
          <h2>Hello, {studentName}</h2>
          <p>
            Your next lesson, the week ahead, and a few quick notes in one clear view.
          </p>
          <div className="student-hero-actions">
            <Link href="/dashboard/sessions" className="button button-primary">
              View lessons
            </Link>
            <Link href="/dashboard/reschedule" className="button button-secondary">
              Change a time
            </Link>
          </div>
          <div className="student-hero-meta">
            <div>
              <strong>{lessonCount}</strong>
              <span>Lessons planned</span>
            </div>
            <div>
              <strong>{overview.completedSessionCount}</strong>
              <span>Done</span>
            </div>
            <div>
              <strong>{formatScore(overview.ratingAverage || 0)}</strong>
              <span>Tutor rating</span>
            </div>
          </div>
        </div>

        <div className="student-next-lesson">
          <span className="stage-kicker">Next lesson</span>
          {nextLesson ? (
            <>
              <strong>{nextLesson.title}</strong>
              <div>{formatShortDateTime(nextLesson.startsAt)}</div>
              <div>{nextLesson.notes || "A note from your tutor will appear here."}</div>
              <div className="student-next-row">
                <span>{nextLesson.status}</span>
                <span>{nextLesson.billable ? formatMoney(nextLesson.amountCents) : "Included"}</span>
              </div>
            </>
          ) : (
            <>
              <strong>No lesson booked yet</strong>
              <div>Add your first lesson to see it here.</div>
            </>
          )}
          <div className="student-next-list">
            {nextLessonList.map((session) => (
              <div key={session.id} className="student-next-item">
                <span>{formatShortDateTime(session.startsAt)}</span>
                <strong>{session.title}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="action-row">
        <Link className="button button-primary" href="/dashboard/start">
          Start here
        </Link>
        <Link className="button button-secondary" href="/dashboard/plan">
          Weekly plan
        </Link>
        <Link className="button button-secondary" href="/dashboard/updates">
          Notifications
        </Link>
      </section>

      <section className="student-pills">
        <div className="student-pill">
          <strong>{lessonCount}</strong>
          <span>Lessons planned</span>
        </div>
        <div className="student-pill">
          <strong>{overview.missedSessionCount}</strong>
          <span>Missed lessons</span>
        </div>
        <div className="student-pill">
          <strong>{formatScore(overview.ratingAverage || 0)}</strong>
          <span>Tutor rating</span>
        </div>
        <div className="student-pill">
          <strong>{formatMoney(overview.billableTotal)}</strong>
          <span>Payments this month</span>
        </div>
      </section>

      <section className="student-grid">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>This week</h2>
              <p>Your lessons lined up for the week.</p>
            </div>
          </div>
          <div className="student-timeline">
            {(overview.upcomingSessions.length ? overview.upcomingSessions : overview.recentSessions).slice(0, 4).map((session) => (
              <div key={session.id} className="student-timeline-row">
                <div>
                  <strong>{session.title}</strong>
                  <span>{formatShortDateTime(session.startsAt)}</span>
                </div>
                <span className={`pill ${session.status === "missed" ? "danger" : session.status === "completed" ? "success" : "neutral"}`}>
                  {session.status}
                </span>
              </div>
            ))}
            {!overview.upcomingSessions.length && !overview.recentSessions.length ? (
              <div className="empty-state">Your lessons will show up here.</div>
            ) : null}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>What to do next</h2>
              <p>Simple next steps.</p>
            </div>
          </div>
          <div className="student-actions">
            {quickNotes.map((note) => (
              <div key={note} className="student-action-row">
                <span className="student-action-dot" />
                <div>{note}</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="student-grid">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Recent notes</h2>
              <p>Small reminders from recent lessons.</p>
            </div>
          </div>
          <div className="student-notes">
            {overview.recentSessions.length ? (
              overview.recentSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="list-card">
                  <strong>{session.title}</strong>
                  <span>{session.notes || "No note added yet."}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">Notes from lessons will appear here.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Summary</h2>
              <p>A simple snapshot of the account.</p>
            </div>
          </div>
          <div className="student-summary">
            <div className="list-card">
              <strong>{overview.clientCount}</strong>
              <span>Lesson profiles</span>
            </div>
            <div className="list-card">
              <strong>{overview.completedSessionCount}</strong>
              <span>Completed lessons</span>
            </div>
            <div className="list-card">
              <strong>{overview.syncs[0] ? "Connected" : "Ready"}</strong>
              <span>{overview.syncs[0] ? calendarStatus : "Calendar sync is ready."}</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
