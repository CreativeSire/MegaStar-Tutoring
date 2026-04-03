import { PageIntro } from "@/components/page-intro";
import { formatShortDateTime } from "@/lib/format";
import { getWorkspaceOverview, isAppDatabaseReady, listInvoices } from "@/lib/repository";
import { listAuditEvents } from "@/lib/security-controls";
import { requireActor } from "@/lib/current-actor";

export default async function InsightsPage() {
  const actor = await requireActor();
  const [overview, invoices] = await Promise.all([getWorkspaceOverview(actor), listInvoices(actor)]);
  const market = overview.preferences.market;
  const auditTrail = await listAuditEvents(actor, 8);
  const databaseReady = isAppDatabaseReady();
  const livekitReady = Boolean(process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL);
  const clerkReady = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

  const healthCards = [
    {
      title: "Storage",
      detail: databaseReady ? "Live records are being stored." : "Running in demo memory mode.",
      meta: databaseReady ? "Production ready" : "Needs DATABASE_URL",
      tone: databaseReady ? "good" : "warm",
    },
    {
      title: "Auth",
      detail: clerkReady ? "Auth keys are configured." : "Clerk is still in fallback mode.",
      meta: clerkReady ? "Signed in" : "Needs production keys",
      tone: clerkReady ? "good" : "alert",
    },
    {
      title: "Classroom",
      detail: livekitReady ? "LiveKit room wiring is available." : "LiveKit still needs env setup.",
      meta: livekitReady ? "Meeting ready" : "Needs room URL",
      tone: livekitReady ? "good" : "warm",
    },
  ] as const;

  const activityCards = [
    {
      title: "Active lessons",
      value: overview.activeSessionCount,
      detail: "Lessons currently in play.",
    },
    {
      title: "Follow-ups",
      value: overview.missedSessionCount,
      detail: "Lessons needing a quick check-in.",
    },
    {
      title: "Invoice drafts",
      value: invoices.length,
      detail: "Exports ready to review.",
    },
    {
      title: "Audit events",
      value: auditTrail.length,
      detail: "Recent changes in the review trail.",
    },
  ] as const;

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Insights"
        title="Health, activity, and readiness in one calm view."
        description="A place to confirm the app is wired, the data is flowing, and the live classroom is ready when you need it."
        aside={
          <>
            <div className="list-card">
              <strong>{databaseReady ? "Live" : "Demo"}</strong>
              <span>Storage mode</span>
            </div>
            <div className="list-card">
              <strong>{overview.clients.length}</strong>
              <span>Students</span>
            </div>
            <div className="list-card">
              <strong>{auditTrail.length}</strong>
              <span>Recent audit events</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">{livekitReady ? "LiveKit ready" : "LiveKit pending"}</span>
        <span className="pill neutral">{clerkReady ? "Auth ready" : "Auth fallback"}</span>
        <span className="pill neutral">{databaseReady ? "Live data" : "Demo data"}</span>
      </PageIntro>

      <section className="workspace-grid cols-3">
        {healthCards.map((card) => (
          <article key={card.title} className={`notice-card ${card.tone}`}>
            <strong>{card.title}</strong>
            <span>{card.detail}</span>
            <em>{card.meta}</em>
          </article>
        ))}
      </section>

      <section className="workspace-grid cols-4">
        {activityCards.map((card) => (
          <article key={card.title} className="panel">
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.title}</div>
            <p className="table-subtle" style={{ marginTop: 8 }}>
              {card.detail}
            </p>
          </article>
        ))}
      </section>

      <section className="workspace-grid cols-2">
        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Recent activity</h2>
              <p>The latest actions that matter most.</p>
            </div>
          </div>
          <div className="workspace-grid">
            {auditTrail.length ? (
              auditTrail.map((entry) => (
                <div key={entry.id} className="list-card">
                  <strong>{entry.action}</strong>
                  <span>
                    {entry.method} {entry.route}
                  </span>
                  <span>{formatShortDateTime(entry.createdAt, market)}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">No recent actions yet.</div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="section-head compact">
            <div>
              <h2>Readiness notes</h2>
              <p>What still matters before the next phase.</p>
            </div>
          </div>
          <div className="workspace-grid">
            <div className="list-card">
              <strong>Database</strong>
              <span>{databaseReady ? "Connected to live storage." : "Set DATABASE_URL to move off demo memory."}</span>
            </div>
            <div className="list-card">
              <strong>Auth</strong>
              <span>{clerkReady ? "Production auth keys are present." : "Add Clerk production keys for live sign-in."}</span>
            </div>
            <div className="list-card">
              <strong>Classroom</strong>
              <span>{livekitReady ? "Room URL wiring is available." : "Add LiveKit env vars before production."}</span>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
