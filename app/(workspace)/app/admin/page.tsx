import { AdminRoleEditor } from "@/components/admin-role-editor";
import { PageIntro } from "@/components/page-intro";
import { formatShortDateTime } from "@/lib/format";
import { listAuditEvents } from "@/lib/security-controls";
import { listWorkspaceProfiles } from "@/lib/repository";
import { requireAdminActor } from "@/lib/current-actor";

export default async function AdminPage() {
  const actor = await requireAdminActor({ redirectTo: "/app" });
  const [profiles, auditTrail] = await Promise.all([listWorkspaceProfiles(), listAuditEvents(actor, 20)]);

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Access"
        title="People and access in one place."
        description="Set who can use the tutor area, the student area, or both."
        aside={
          <>
            <div className="list-card">
              <strong>{profiles.length}</strong>
              <span>Known users</span>
            </div>
            <div className="list-card">
              <strong>{auditTrail.length}</strong>
              <span>Recent changes</span>
            </div>
            <div className="list-card">
              <strong>{actor.role}</strong>
              <span>Your access</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">Tutor access</span>
        <span className="pill neutral">Student access</span>
        <span className="pill neutral">Admin access</span>
      </PageIntro>

      <AdminRoleEditor profiles={profiles} />

      <section className="panel">
        <div className="section-head compact">
          <div>
            <h2>Recent changes</h2>
            <p>Role edits and other important updates are listed here for a quick review.</p>
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
            <div className="empty-state">No recent changes yet. They will appear once people start using the app.</div>
          )}
        </div>
      </section>
    </div>
  );
}
