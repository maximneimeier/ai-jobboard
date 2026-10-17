import type { Metadata } from "next";
import { JobArticle } from "@/components/demo/job-article";
import { demoJobById } from "@/lib/demo/jobs";

export const metadata: Metadata = {
  title: "Job | Atheniks Career Copilot",
};

export default async function JobDetailPage({
  params,
}: PageProps<"/jobs/[id]">) {
  const { id } = await params;
  const job = demoJobById(id);

  return (
    <div className="min-h-full flex-1 bg-surface">
      <JobArticle jobId={job?.id ?? id} />
    </div>
  );
}
