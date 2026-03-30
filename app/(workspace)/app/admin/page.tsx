import { formatShortDateTime } from "@/lib/format";
import { listAuditEvents } from "@/lib/security-controls";
import { requireAdminActor } from "@/lib/current-actor";

export default async function AdminPage() {
  const actor = await requireAdminActor({ redirectTo: "/app" });
  const auditTrail = await listAuditEvents(actor, 20);

  return (
    <section className="panel">
      <h2>Admin controls</h2>
      <p className="stat-label">A private space for audit visibility, access checks, and operational oversight.</p>
      <div className="workspace-grid cols-2">
        <div className="list-card">
          <strong>Role</strong>
          <span>{actor.role}</span>
        </div>
        <div className="list-card">
          <strong>Audit coverage</strong>
          <span>{auditTrail.length} recent events tracked</span>
        </div>
      </div>

      <div className="workspace-grid" style={{ marginTop: "1.5rem" }}>
        {auditTrail.length ? (
          auditTrail.map((event) => (
            <div key={event.id} className="list-card">
              <strong>{event.action}</strong>
              <span>
                {formatShortDateTime(event.createdAt)} · {event.route} · {event.statusCode}
              </span>
              <span>{event.details}</span>
            </div>
          ))
        ) : (
          <div className="empty-state">No audit events yet. They will appear after activity starts.</div>
        )}
      </div>
    </section>
  );
}
