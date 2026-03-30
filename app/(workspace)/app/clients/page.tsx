import Link from "next/link";
import { ClientForm } from "@/components/client-form";
import { formatMoney, formatShortDate } from "@/lib/format";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function ClientsPage() {
  const actor = await requireActor();
  const overview = await getWorkspaceOverview(actor);

  return (
    <div className="workspace-grid cols-2">
      <ClientForm />

      <section className="panel">
        <h2>Client list</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Schedule</th>
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
                    <div>{client.meetingsPerWeek} sessions weekly</div>
                    <div className="table-subtle">{client.preferredDays || "No preferred days saved"}</div>
                  </td>
                  <td>{formatMoney(client.rateCents)}</td>
                  <td>
                    <span className={`pill ${client.status === "active" ? "success" : client.status === "needs_attention" ? "warning" : "neutral"}`}>
                      {client.status}
                    </span>
                    <div className="table-subtle">{formatShortDate(client.createdAt)}</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No clients yet. Add the first private profile on the left.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
