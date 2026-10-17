import type { Metadata } from "next";
import { ApplicationEditor } from "@/components/demo/application-editor";

export const metadata: Metadata = {
  title: "Application | Atheniks Career Copilot",
  description: "Resume and cover letter for a saved job.",
};

export default async function SavedApplicationRoute({
  params,
}: PageProps<"/account/saved/[id]">) {
  const { id } = await params;
  return <ApplicationEditor jobId={id} />;
}
