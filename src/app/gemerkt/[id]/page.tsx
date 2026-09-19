import type { Metadata } from "next";
import { ApplicationEditor } from "@/components/landing/application-editor";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Bewerbung | Aria",
  description: "Lebenslauf und Anschreiben zur gemerkten Stelle.",
};

export default async function ApplicationRoute({
  params,
}: PageProps<"/gemerkt/[id]">) {
  const { id } = await params;

  return (
    <div lang="de" className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <ApplicationEditor jobId={id} />
      </main>
      <SiteFooter />
    </div>
  );
}
