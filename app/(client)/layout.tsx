import { AppShell } from "@/components/app-shell";
import { requireActor } from "@/lib/current-actor";
import { clientNav } from "@/lib/navigation";

export default async function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireActor();
  return <AppShell title="Client Portal" subtitle="Private student view" nav={clientNav}>{children}</AppShell>;
}
