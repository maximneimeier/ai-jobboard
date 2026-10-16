import type { Metadata } from "next";
import { CvUploadPage } from "@/components/demo/cv-upload-page";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Upload your CV | Atheniks Career Copilot",
  description: "Upload a CV and we fill in your career profile.",
};

export default function CvUploadRoute() {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <CvUploadPage />
      </main>
      <SiteFooter />
    </div>
  );
}
