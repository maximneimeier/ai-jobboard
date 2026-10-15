import type { Metadata } from "next";
import { DashboardHome } from "@/components/demo/dashboard-home";

export const metadata: Metadata = {
  title: "Account | Atheniks Career Copilot",
};

export default function KontoPage() {
  return <DashboardHome />;
}
