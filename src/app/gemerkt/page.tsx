import type { Metadata } from "next";
import { SavedBoard } from "@/components/demo/saved-board";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Saved | Atheniks Career Copilot",
  description: "Your saved jobs.",
};

export default function GemerktPage() {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <SavedBoard />
      </main>
      <SiteFooter />
    </div>
  );
}
