"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, LayoutGrid, Search, Send } from "lucide-react";

const JOBS = [
  {
    id: "se",
    title: "Software Engineer",
    company: "Northline",
    meta: "Berlin · Hybrid",
    fit: "Good match",
    why: [
      "This role sits close to Software Engineer.",
      "The location matches your preference.",
      "You cover TypeScript and React.",
    ],
    gap: "Hybrid office days need confirmation",
  },
  {
    id: "sse",
    title: "Senior Software Engineer",
    company: "Northline",
    meta: "Berlin · Hybrid",
    fit: "Stretch opportunity",
    why: [
      "The title matches your search.",
      "The location matches your preference.",
    ],
    gap: "The seniority is above your current level",
  },
];

export function DashboardPreview() {
  const [active, setActive] = useState(JOBS[0].id);
  const [saved, setSaved] = useState<string[]>([]);
  const job = JOBS.find((item) => item.id === active) ?? JOBS[0];

  return (
    <section id="preview" className="scroll-mt-[84px] bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-accent uppercase">
          Product
        </p>
        <h2 className="font-display mt-2 max-w-[20ch] text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          A smarter way to discover your next opportunity.
        </h2>
        <p className="mt-4 max-w-[52ch] text-[16px] leading-7 text-body">
          Discover roles for your preferences, open the match, and save the ones
          you want to track.
        </p>

        <div className="relative mt-10 overflow-hidden rounded-2xl bg-surface shadow-[0_16px_50px_rgba(17,24,39,0.07)] ring-1 ring-hairline">
          <p className="absolute top-3 right-3 z-10 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
            Your workspace
          </p>
          <div className="grid min-h-[420px] lg:grid-cols-[200px_minmax(0,1fr)_280px]">
            <aside className="hidden border-r border-hairline bg-canvas/70 p-4 lg:block">
              <p className="px-2 text-[12px] font-medium text-muted">Atheniks</p>
              <ul className="mt-4 space-y-1 text-[13px] text-body">
                {[
                  { icon: LayoutGrid, label: "Overview" },
                  { icon: Search, label: "Discover jobs", active: true },
                  { icon: Bookmark, label: "Saved jobs" },
                  { icon: Send, label: "Applications" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.label}
                      className={
                        item.active
                          ? "flex items-center gap-2 rounded-xl bg-surface px-3 py-2 font-medium text-ink ring-1 ring-hairline"
                          : "flex items-center gap-2 rounded-xl px-3 py-2"
                      }
                    >
                      <Icon size={14} />
                      {item.label}
                    </li>
                  );
                })}
              </ul>
            </aside>
            <div className="p-4 md:border-r md:border-hairline md:p-5">
              <div className="flex flex-wrap gap-2">
                {["Most relevant", "Berlin", "Hybrid"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink ring-1 ring-hairline"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <ul className="mt-4 grid gap-3">
                {JOBS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActive(item.id)}
                      className={
                        active === item.id
                          ? "w-full rounded-xl bg-accent-soft p-4 text-left ring-1 ring-accent/20"
                          : "w-full rounded-xl bg-canvas p-4 text-left ring-1 ring-hairline transition hover:bg-surface"
                      }
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[14px] font-medium text-ink">{item.title}</p>
                        <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-accent">
                          {item.fit}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] text-muted">
                        {item.company} · {item.meta}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-hairline p-5 lg:border-t-0">
              <p className="text-[11px] font-medium text-muted uppercase">Job details</p>
              <h3 className="mt-2 text-[16px] font-medium text-ink">{job.title}</h3>
              <p className="mt-1 text-[13px] text-body">
                {job.company} · {job.meta}
              </p>
              <p className="mt-4 text-[12px] font-medium text-ink">Why it fits</p>
              <ul className="mt-2 space-y-1 text-[13px] text-body">
                {job.why.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
              <p className="mt-4 text-[12px] font-medium text-ink">Needs confirmation</p>
              <p className="mt-1 text-[13px] text-body">· {job.gap}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-xl bg-ink px-3 text-[12px] font-medium text-white"
                >
                  Open job
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSaved((current) =>
                      current.includes(job.id)
                        ? current.filter((id) => id !== job.id)
                        : [...current, job.id],
                    )
                  }
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-[12px] font-medium text-ink ring-1 ring-hairline"
                >
                  {saved.includes(job.id) ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                  {saved.includes(job.id) ? "Saved" : "Save Job"}
                </button>
              </div>
              <p className="mt-4 text-[11px] text-muted">
                Hybrid · Posted this week
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
