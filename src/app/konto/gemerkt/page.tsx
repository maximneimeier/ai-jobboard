import type { Metadata } from "next";
import { SavedBoard } from "@/components/demo/saved-board";

export const metadata: Metadata = {
  title: "Saved | Atheniks Career Copilot",
};

export default function KontoSavedPage() {
  return <SavedBoard />;
}
