import type { Metadata } from "next";
import { AlertsPage } from "@/components/demo/alerts-page";

export const metadata: Metadata = {
  title: "Job alerts | Atheniks Career Copilot",
};

export default function AlertsRoute() {
  return <AlertsPage />;
}
