import { AppShell } from "@/components/app-shell";
import { requireWorkspaceActor } from "@/lib/current-actor";
import { workspaceNav } from "@/lib/navigation";

export default async function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const actor = await requireWorkspaceActor();
  return (
    <AppShell
      title="MegaStar Tutoring"
      subtitle="Teaching hub"
      nav={workspaceNav}
      role={actor.role || "tutor"}
    >
      {children}
    </AppShell>
  );
}
