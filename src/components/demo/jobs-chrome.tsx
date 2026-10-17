"use client";

import { useEffect, useState } from "react";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { useDemo } from "@/lib/demo/store";
import { DashboardShell } from "./dashboard-shell";

export function JobsChrome({ children }: { children: React.ReactNode }) {
  const demo = useDemo();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="min-h-full bg-canvas" />;
  }

  if (demo.signedUp) {
    return <DashboardShell>{children}</DashboardShell>;
  }

  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
