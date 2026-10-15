import type { Metadata } from "next";
import { ResultsBoard } from "@/components/demo/results-board";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Jobs | Atheniks Career Copilot",
  description: "Matching jobs for your search.",
};

export default async function JobsPage({
  searchParams,
}: PageProps<"/jobs">) {
  const query = await searchParams;
  const role = typeof query.role === "string" ? query.role : "";
  const location = typeof query.location === "string" ? query.location : "";
  const personalize = query.personalize === "1";

  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex-1">
        <ResultsBoard
          initialRole={role}
          initialLocation={location}
          openPersonalize={personalize}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
