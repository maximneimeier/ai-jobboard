import type { Metadata } from "next";
import { SignInPage } from "@/components/demo/sign-in-page";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Sign in | Atheniks Career Copilot",
  description: "Sign in to your Atheniks account.",
};

export default function SignInRoute() {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <SignInPage />
      </main>
      <SiteFooter />
    </div>
  );
}
