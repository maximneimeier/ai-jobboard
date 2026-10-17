import { redirect } from "next/navigation";
import { paths } from "@/lib/demo/paths";

export default async function LegacySavedApplicationRoute({
  params,
}: PageProps<"/konto/gemerkt/[id]">) {
  const { id } = await params;
  redirect(paths.savedJob(id));
}
