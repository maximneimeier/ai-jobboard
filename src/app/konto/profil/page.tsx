import { redirect } from "next/navigation";
import { paths } from "@/lib/demo/paths";

export default function LegacyProfilePage() {
  redirect(paths.profile);
}
