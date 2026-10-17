import type { Metadata } from "next";
import { CareerProfilePage } from "@/components/demo/career-profile";

export const metadata: Metadata = {
  title: "Profile | Atheniks Career Copilot",
};

export default function ProfilePage() {
  return <CareerProfilePage />;
}
