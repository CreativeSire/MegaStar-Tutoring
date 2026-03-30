import { AdminRoleEditor } from "@/components/admin-role-editor";
import { formatShortDateTime } from "@/lib/format";
import { listAuditEvents } from "@/lib/security-controls";
import { listWorkspaceProfiles } from "@/lib/repository";
import { requireAdminActor } from "@/lib/current-actor";

export default async function AdminPage() {
  const actor = await requireAdminActor({ redirectTo: "/app" });
  const [profiles, auditTrail] = await Promise.all([listWorkspaceProfiles(), listAuditEvents(actor, 20)]);

  return (
    <div className="workspace-grid">
      <section className="panel admin-hero">
        <div>
          <span className="eyebrow">Admin console</span>
          <h2>Manage people, access, and activity in one place.</h2>
          <p className="stat-label">
            A simple place to assign tutor, client, and admin access without touching Clerk metadata by hand.
          </p>
        </div>
        <div className="workspace-grid cols-3 admin-stats">
          <div className="list-card">
            <strong>{profiles.length}</strong>
            <span>Known users</span>
          </div>
          <div className="list-card">
            <strong>{auditTrail.length}</strong>
            <span>Recent audit events</span>
          </div>
          <div className="list-card">
            <strong>{actor.role}</strong>
            <span>Your role</span>
          </div>
        </div>
      </section>

      <AdminRoleEditor profiles={profiles} />

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Audit trail</h2>
            <p>Recent changes are listed here so you can review role edits and other important updates.</p>
          </div>
        </div>

        <div className="workspace-grid">
          {auditTrail.length ? (
            auditTrail.map((event) => (
              <div key={event.id} className="list-card">
                <div className="audit-row">
                  <strong>{event.action}</strong>
                  <span className="pill neutral">{event.statusCode}</span>
                </div>
                <span>
                  {formatShortDateTime(event.createdAt)} · {event.method} {event.route}
                </span>
                <span>{event.details}</span>
              </div>
            ))
          ) : (
            <div className="empty-state">No audit events yet. They will appear once people start using the app.</div>
          )}
        </div>
      </section>
    </div>
  );
}
