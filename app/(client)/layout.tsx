import { AppShell } from "@/components/app-shell";
import { clientNav } from "@/lib/navigation";

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AppShell title="Client Portal" subtitle="Private student view" nav={clientNav}>{children}</AppShell>;
}
