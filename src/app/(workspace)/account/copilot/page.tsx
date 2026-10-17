import type { Metadata } from "next";
import { CopilotChat } from "@/components/demo/copilot-chat";

export const metadata: Metadata = {
  title: "Career Copilot | Atheniks Career Copilot",
};

export default function CopilotPage() {
  return <CopilotChat />;
}
