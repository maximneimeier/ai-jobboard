import { redirect } from "next/navigation";

export default async function GemerktApplicationRoute({
  params,
}: PageProps<"/gemerkt/[id]">) {
  const { id } = await params;
  redirect(`/konto/gemerkt/${id}`);
}
