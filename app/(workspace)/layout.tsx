import { AppShell } from "@/components/app-shell";
import { requireActor } from "@/lib/current-actor";
import { workspaceNav } from "@/lib/navigation";

export default async function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireActor();
  return <AppShell title="MegaStar Tutoring" subtitle="Tutor / admin workspace" nav={workspaceNav}>{children}</AppShell>;
}
