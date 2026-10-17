import { JobsChrome } from "@/components/demo/jobs-chrome";

export default function JobsLayout({ children }: LayoutProps<"/jobs">) {
  return <JobsChrome>{children}</JobsChrome>;
}
