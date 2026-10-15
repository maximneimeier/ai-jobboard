import type { Metadata } from "next";
import { OnboardingPage } from "@/components/demo/onboarding-page";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Create your profile | Atheniks Career Copilot",
  description: "Add your experience so we can show jobs that fit you.",
};

export default function OnboardingRoute() {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <OnboardingPage />
      </main>
      <SiteFooter />
    </div>
  );
}
