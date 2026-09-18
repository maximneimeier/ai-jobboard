"use client";

import { useState } from "react";

const tabs = ["Chat", "Filter", "Treffer"] as const;

const filters = [
  { label: "Rolle", value: "Senior Product Designer" },
  { label: "Ort", value: "Berlin · Hybrid" },
  { label: "Gehalt", value: "ab 80.000 €" },
  { label: "Kultur", value: "Design-Team, kein Konzern" },
  { label: "Level", value: "Senior, 5+ Jahre" },
  { label: "Stack", value: "Figma, Research, Systems" },
];

const jobs = [
  {
    company: "Linear",
    role: "Senior Product Designer",
    meta: "Berlin · Hybrid · 85–110k",
    match: 96,
    why: "Kleines, starkes Design-Team. Produktgeführt, kein Konzern-Setup.",
  },
  {
    company: "Pitch",
    role: "Lead Product Designer",
    meta: "Berlin · Hybrid · 90–120k",
    match: 93,
    why: "Design-led Startup, Berlin HQ, Senior-Rolle mit echter Ownership.",
  },
  {
    company: "Personio",
    role: "Product Designer",
    meta: "München / Remote · 80–95k",
    match: 71,
    why: "Gehalt und Level passen. Kultur näher am Scale-up als gewünscht.",
  },
];

export function ProductPreview() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Chat");

  return (
    <div className="product-shadow overflow-hidden rounded-lg bg-canvas">
      <div className="flex items-center justify-between border-b border-hairline-soft px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <p className="text-[13px] font-medium tracking-[-0.16px] text-muted">
          Aria · Jobsuche
        </p>
        <span className="w-12" />
      </div>

      <div className="flex gap-1 border-b border-hairline-soft px-3">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`relative px-4 py-3 text-[15px] font-medium tracking-[-0.16px] ${
              tab === item ? "text-ink" : "text-muted"
            }`}
          >
            {item}
            {tab === item ? (
              <span className="absolute inset-x-3 bottom-0 h-px bg-ink" />
            ) : null}
          </button>
        ))}
      </div>

      {tab === "Chat" ? <ChatView /> : null}
      {tab === "Filter" ? <FilterView /> : null}
      {tab === "Treffer" ? <ResultsView /> : null}
    </div>
  );
}

function ChatView() {
  return (
    <div className="grid min-h-[420px] lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col border-hairline-soft lg:border-r">
        <div className="flex-1 space-y-5 px-5 py-5">
          <div className="flex justify-end">
            <div className="max-w-[88%] rounded-[10px] bg-surface-soft px-3.5 py-3 text-[14px] leading-6 text-ink-soft">
              Ich suche eine Senior Product Designer Rolle in Berlin, hybrid,
              mind. 80k. Wichtig ist ein starkes Design-Team — möglichst kein
              Konzern.
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-5 items-center justify-center rounded-[6px] bg-ink text-[10px] font-semibold text-white">
                A
              </span>
              <p className="text-[12px] font-medium text-muted">Aria</p>
            </div>
            <p className="text-[14px] leading-6 text-ink-soft">
              Verstanden. Ich suche Senior Product Design Rollen in Berlin
              (Hybrid), ab 80.000 €, mit Design-Kultur statt Konzernstruktur.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Berlin", "Hybrid", "Senior", "ab 80k", "Design-Kultur"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-[6px] bg-surface-faint px-2 py-1 text-[12px] font-medium text-ink-soft ring-1 ring-hairline-soft"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-hairline-soft p-3">
          <div className="flex items-center gap-2 rounded-[10px] bg-canvas px-3 py-2.5 ring-1 ring-hairline">
            <p className="flex-1 text-[14px] text-muted-soft">
              Noch genauer: nur Teams unter 20 Designer…
            </p>
            <span className="inline-flex size-7 items-center justify-center rounded-[8px] bg-ink text-white">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6h7M6.5 3l3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <ResultsPane compact />
    </div>
  );
}

function FilterView() {
  return (
    <div className="grid min-h-[420px] gap-0 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-3 border-hairline-soft p-5 lg:border-r">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Aus dem Gespräch erkannt
        </p>
        {filters.map((filter) => (
          <div
            key={filter.label}
            className="flex items-center justify-between rounded-[10px] bg-surface-faint px-3 py-2.5 ring-1 ring-hairline-soft"
          >
            <span className="text-[13px] text-muted">{filter.label}</span>
            <span className="text-[13px] font-medium text-ink">
              {filter.value}
            </span>
          </div>
        ))}
      </div>
      <div className="p-5">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Präzision
        </p>
        <p className="mt-2 max-w-sm text-[14px] leading-6 text-body">
          Aria übersetzt weiche Anforderungen — „kein Konzern“, „starkes
          Design-Team“ — in harte Filter. Du kannst jeden Punkt nachschärfen.
        </p>
        <div className="mt-6 space-y-4">
          <div>
            <div className="mb-1.5 flex justify-between text-[13px]">
              <span className="text-ink">Kultur-Fit</span>
              <span className="text-muted">hoch</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-strong">
              <div className="h-full w-[86%] rounded-full bg-ink" />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px]">
              <span className="text-ink">Gehaltsband</span>
              <span className="text-muted">ab 80k</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-strong">
              <div className="h-full w-[70%] rounded-full bg-ink" />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex justify-between text-[13px]">
              <span className="text-ink">Konzern-Distanz</span>
              <span className="text-muted">streng</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-strong">
              <div className="h-full w-[92%] rounded-full bg-ink" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsView() {
  return (
    <div className="min-h-[420px]">
      <ResultsPane />
    </div>
  );
}

function ResultsPane({ compact = false }: { compact?: boolean }) {
  const items = compact ? jobs.slice(0, 2) : jobs;

  return (
    <div className="space-y-3 bg-surface-faint p-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          {jobs.length} passende Rollen
        </p>
        <p className="text-[12px] text-muted-soft">sortiert nach Fit</p>
      </div>
      {items.map((job) => (
        <article
          key={job.company}
          className="rounded-[10px] bg-canvas p-3.5 ring-1 ring-hairline-soft"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[14px] font-medium tracking-[-0.16px] text-ink">
                {job.role}
              </p>
              <p className="mt-0.5 text-[13px] text-body">
                {job.company} · {job.meta}
              </p>
            </div>
            <span className="shrink-0 rounded-[6px] bg-[#eaf8f2] px-1.5 py-0.5 text-[12px] font-medium text-[#0a7a4f]">
              {job.match}%
            </span>
          </div>
          <p className="mt-2.5 text-[13px] leading-5 text-body">{job.why}</p>
        </article>
      ))}
    </div>
  );
}
