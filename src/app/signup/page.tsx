import type { Metadata } from "next";
import { CreateAccountPage } from "@/components/demo/create-account-page";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Create your account | Atheniks Career Copilot",
  description: "Create an account to start your career profile.",
};

export default function SignupRoute() {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <CreateAccountPage />
      </main>
      <SiteFooter />
    </div>
  );
}
