import type { Metadata } from "next";
import { BrowseChat } from "@/components/demo/browse-chat";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Browse jobs | Atheniks Career Copilot",
  description: "Describe your experience or attach a CV. No account required.",
};

export default function BrowsePage() {
  return (
    <div className="flex h-dvh flex-col bg-canvas">
      <SiteNav />
      <main className="flex min-h-0 flex-1 flex-col">
        <BrowseChat />
      </main>
    </div>
  );
}
