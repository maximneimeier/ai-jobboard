"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Bookmark,
  LayoutGrid,
  Search,
  Send,
  Settings,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/landing/logo";
import { paths } from "@/lib/demo/paths";
import { ensureWorkspace, useDemo } from "@/lib/demo/store";

const NAV: { label: string; items: { href: string; label: string; icon: LucideIcon }[] }[] = [
  {
    label: "Workspace",
    items: [
      { href: paths.account, label: "Overview", icon: LayoutGrid },
      { href: paths.jobs, label: "Discover jobs", icon: Search },
      { href: paths.saved, label: "Saved jobs", icon: Bookmark },
      { href: paths.applications, label: "Applications", icon: Send },
    ],
  },
  {
    label: "Guidance",
    items: [
      { href: paths.copilot, label: "Career Copilot", icon: Sparkles },
      { href: paths.alerts, label: "Job alerts", icon: Bell },
    ],
  },
  {
    label: "Account",
    items: [
      { href: paths.profile, label: "My profile", icon: UserRound },
      { href: paths.settings, label: "Settings", icon: Settings },
    ],
  },
];

function jobsHref(query: string, location: string) {
  const params = new URLSearchParams();
  if (query) params.set("role", query);
  if (location) params.set("location", location);
  const qs = params.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const demo = useDemo();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!demo.signedUp) {
      router.replace(paths.signin);
      return;
    }
    ensureWorkspace();
  }, [demo.signedUp, ready, router]);

  if (!ready || !demo.signedUp) {
    return (
      <div className="flex min-h-full items-center justify-center bg-canvas px-5">
        <p className="text-[14px] text-muted">Opening your account…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full bg-canvas">
      <aside className="sticky top-0 flex h-dvh w-[232px] shrink-0 flex-col border-r border-hairline-soft bg-surface">
        <div className="px-4 py-4">
          <Link href="/">
            <Logo compact />
          </Link>
        </div>
        <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-4">
          {NAV.map((group) => (
            <div key={group.label}>
              <p className="px-2.5 pb-1 text-[11px] font-medium tracking-[0.08em] text-muted uppercase">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const href =
                    item.href === paths.jobs
                      ? jobsHref(demo.query, demo.location)
                      : item.href;
                  const active =
                    item.href === paths.account
                      ? path === paths.account
                      : item.href === paths.jobs
                        ? path.startsWith(paths.jobs)
                        : path === item.href || path.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={href}
                      className={
                        active
                          ? "flex items-center gap-2.5 rounded-lg bg-canvas px-2.5 py-2 text-[14px] font-medium text-ink"
                          : "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[14px] text-body hover:bg-canvas hover:text-ink"
                      }
                    >
                      <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <p className="shrink-0 truncate border-t border-hairline-soft px-4 py-4 text-[12px] text-muted">
          {demo.email || "Your account"}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
