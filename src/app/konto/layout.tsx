import { DashboardShell } from "@/components/demo/dashboard-shell";

export default function KontoLayout({ children }: LayoutProps<"/konto">) {
  return <DashboardShell>{children}</DashboardShell>;
}
