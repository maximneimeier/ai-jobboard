import { redirect } from "next/navigation";
import { paths } from "@/lib/demo/paths";

export default async function GemerktApplicationRoute({
  params,
}: PageProps<"/gemerkt/[id]">) {
  const { id } = await params;
  redirect(paths.savedJob(id));
}
