import type { Metadata } from "next";
import { ResultsBoard } from "@/components/demo/results-board";

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
    <ResultsBoard
      initialRole={role}
      initialLocation={location}
      openPersonalize={personalize}
    />
  );
}
