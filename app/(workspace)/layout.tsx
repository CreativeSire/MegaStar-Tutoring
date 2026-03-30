import { AppShell } from "@/components/app-shell";
import { workspaceNav } from "@/lib/navigation";

export default function WorkspaceLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell title="MegaStar Tutoring" subtitle="Tutor / admin workspace" nav={workspaceNav}>{children}</AppShell>;
}
