import type { Metadata } from "next";
import { RolePicker } from "@/components/demo/role-picker";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Job preferences | Atheniks Career Copilot",
  description: "Choose the roles, places, and filters we should look for.",
};

export default function RolePickerRoute() {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <RolePicker />
      </main>
      <SiteFooter />
    </div>
  );
}
