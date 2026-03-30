import Link from "next/link";
import { ClientForm } from "@/components/client-form";
import { PageIntro } from "@/components/page-intro";
import { formatMoney, formatShortDate } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function ClientsPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);
  const activeClients = overview.clients.filter((client) => client.status === "active").length;
  const attentionClients = overview.clients.filter((client) => client.status === "needs_attention").length;

  return (
    <div className="workspace-grid">
      <PageIntro
        eyebrow="Students"
        title="Each student gets a clear private profile."
        description="Keep the name, rhythm, rate, and notes together so every lesson stays easy to follow."
        aside={
          <>
            <div className="list-card">
              <strong>{overview.clientCount}</strong>
              <span>Student profiles</span>
            </div>
            <div className="list-card">
              <strong>{activeClients}</strong>
              <span>Active right now</span>
            </div>
            <div className="list-card">
              <strong>{attentionClients}</strong>
              <span>Need a look</span>
            </div>
          </>
        }
      >
        <span className="pill neutral">{overview.sessionCount} lessons</span>
        <span className="pill neutral">{formatMoney(overview.billableTotal)} due</span>
        <span className="pill neutral">Private by design</span>
      </PageIntro>

      <section className="workspace-grid cols-3">
        <article className="panel">
          <div className="stat-value">{overview.clientCount}</div>
          <div className="stat-label">Student profiles</div>
        </article>
        <article className="panel">
          <div className="stat-value">{overview.sessionCount}</div>
          <div className="stat-label">Lessons saved</div>
        </article>
        <article className="panel">
          <div className="stat-value">{formatMoney(overview.billableTotal)}</div>
          <div className="stat-label">Current total</div>
        </article>
      </section>

      <div className="workspace-grid cols-2">
        <ClientForm />

        <section className="panel">
          <div className="section-head compact">
            <div>
              <h2>Student list</h2>
              <p>See each profile, the weekly rhythm, and the current rate at a glance.</p>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rhythm</th>
                <th>Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {overview.clients.length ? (
                overview.clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <Link href={`/app/clients/${client.id}`}>
                        <strong>{client.name}</strong>
                      </Link>
                      <div className="table-subtle">{client.billTo}</div>
                    </td>
                    <td>
                      <div>{client.meetingsPerWeek} sessions each week</div>
                      <div className="table-subtle">{client.preferredDays || "No preferred days saved"}</div>
                    </td>
                    <td>{formatMoney(client.rateCents)}</td>
                    <td>
                      <span className={`pill ${client.status === "active" ? "success" : client.status === "needs_attention" ? "warning" : "neutral"}`}>
                        {client.status}
                      </span>
                      <div className="table-subtle">Added {formatShortDate(client.createdAt)}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No students yet. Add the first profile on the left.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
