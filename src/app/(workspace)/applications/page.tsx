import type { Metadata } from "next";
import { ApplicationsBoard } from "@/components/demo/applications-board";

export const metadata: Metadata = {
  title: "Applications | Atheniks Career Copilot",
};

export default function ApplicationsPage() {
  return <ApplicationsBoard />;
}
