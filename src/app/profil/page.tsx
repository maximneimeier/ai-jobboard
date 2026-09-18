import type { Metadata } from "next";
import { ProfilePage } from "@/components/landing/profile-page";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";

export const metadata: Metadata = {
  title: "Profil | Aria",
  description: "Dein Profil für einen genaueren Job-Fit.",
};

export default function ProfilRoute() {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <ProfilePage />
      </main>
      <SiteFooter />
    </div>
  );
}
