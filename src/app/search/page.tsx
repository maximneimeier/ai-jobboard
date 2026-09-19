import type { Metadata } from "next";
import { EmployerDirectory } from "@/components/landing/employer-directory";
import { HomeSearch } from "@/components/landing/home-search";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Jobsuche | Aria",
  description:
    "Beschreibe deine Wunschrolle und verfeinere deine Jobsuche im Gespräch.",
};

export default function SearchPage() {
  return (
    <div lang="de" id="top" className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main>
        <HomeSearch />
        <section
          id="arbeitgeber"
          className="scroll-mt-[84px] bg-surface-faint py-24"
        >
          <EmployerDirectory />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
