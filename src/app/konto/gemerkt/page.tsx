import { redirect } from "next/navigation";
import { paths } from "@/lib/demo/paths";

export default function LegacySavedPage() {
  redirect(paths.saved);
}
