import type { Metadata } from "next";
import { SettingsPage } from "@/components/demo/settings-page";

export const metadata: Metadata = {
  title: "Settings | Atheniks Career Copilot",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
