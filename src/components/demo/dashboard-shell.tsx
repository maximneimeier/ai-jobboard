"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/landing/logo";
import { useDemo } from "@/lib/demo/store";

const NAV = [
  { href: "/konto", label: "Overview" },
  { href: "/jobs", label: "Discover jobs" },
  { href: "/konto/gemerkt", label: "Saved jobs" },
  { href: "/konto/bewerbungen", label: "Applications" },
  { href: "/konto/copilot", label: "Career Copilot" },
  { href: "/konto/alerts", label: "Job alerts" },
  { href: "/konto/profil", label: "My profile" },
  { href: "/konto/einstellungen", label: "Settings" },
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
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!demo.signedUp) router.replace("/signin");
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
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-hairline-soft bg-surface md:flex">
        <div className="px-4 py-5">
          <Link href="/">
            <Logo compact />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 pb-6">
          {NAV.map((item) => {
            const href =
              item.href === "/jobs"
                ? jobsHref(demo.query, demo.location)
                : item.href;
            const active =
              item.href === "/konto"
                ? path === "/konto"
                : item.href === "/jobs"
                  ? path.startsWith("/jobs")
                  : path === item.href || path.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={href}
                className={
                  active
                    ? "rounded-md bg-canvas px-3 py-2 text-[14px] font-medium text-ink ring-1 ring-hairline-soft"
                    : "rounded-md px-3 py-2 text-[14px] text-body hover:text-ink"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-4 pb-5 text-[12px] text-muted">
          {demo.signedUp ? demo.email || "Your account" : "Guest"}
        </p>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-hairline-soft bg-surface px-4 py-3 md:hidden">
          <Link href="/">
            <Logo compact />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 items-center rounded-md px-3 text-[13px] ring-1 ring-hairline"
          >
            Menu
          </button>
        </header>
        {open ? (
          <nav className="border-b border-hairline-soft bg-surface px-3 py-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={
                  item.href === "/jobs"
                    ? jobsHref(demo.query, demo.location)
                    : item.href
                }
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-[14px] text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
