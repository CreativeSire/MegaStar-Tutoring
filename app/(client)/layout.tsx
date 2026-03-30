import { AppShell } from "@/components/app-shell";
import { requireClientActor } from "@/lib/current-actor";
import { clientNav } from "@/lib/navigation";

export default async function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const actor = await requireClientActor();
  return (
    <AppShell title="Client Portal" subtitle="Private student view" nav={clientNav} role={actor.role || "client"}>
      {children}
    </AppShell>
  );
}
