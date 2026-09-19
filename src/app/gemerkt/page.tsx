import type { Metadata } from "next";
import { SavedJobsList } from "@/components/landing/saved-jobs-list";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Gemerkt | Aria",
  description: "Deine gemerkten Stellen und der Bewerbungsstatus.",
};

export default function GemerktPage() {
  return (
    <div lang="de" className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <SavedJobsList />
      </main>
      <SiteFooter />
    </div>
  );
}
