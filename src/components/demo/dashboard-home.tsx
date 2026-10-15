"use client";

import Link from "next/link";
import { useMemo } from "react";
import { demoJobById } from "@/lib/demo/jobs";
import { FIT_CLASS, FIT_LABEL, rankDemoJobs, salaryLabel } from "@/lib/demo/match";
import { useDemo } from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";

export function DashboardHome() {
  const demo = useDemo();
  const recommended = useMemo(
    () =>
      rankDemoJobs(
        demo.query || "Software Engineer",
        demo.location || demo.profile?.location || "Berlin",
        demo.filters,
        "relevant",
        demo.profile,
        demo.personalized,
        demo.roleTags,
        demo.locationTags,
      ).slice(0, 3),
    [demo],
  );
  const saved = demo.savedIds.map(demoJobById).filter(Boolean);
  const inProgress = demo.applications.filter((item) =>
    ["preparing", "applied", "interview"].includes(item.status),
  );

  return (
    <div className="mx-auto w-full max-w-[920px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Overview
      </p>
      <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
        Welcome back.
      </h1>
      <p className="mt-2 text-[16px] text-body">
        Your next role is closer than it feels.
      </p>
      <div className="mt-4">
        <DemoBanner>
          New matches, saved roles, and applications in one workspace.
        </DemoBanner>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Card
          label="New matching jobs"
          value={String(recommended.length)}
          href={
            demo.query || demo.location
              ? `/jobs?${new URLSearchParams({
                  ...(demo.query ? { role: demo.query } : {}),
                  ...(demo.location ? { location: demo.location } : {}),
                }).toString()}`
              : "/jobs"
          }
        />
        <Card label="Saved jobs" value={String(saved.length)} href="/konto/gemerkt" />
        <Card
          label="Applications in progress"
          value={String(inProgress.length)}
          href="/konto/bewerbungen"
        />
      </div>

      <section className="mt-12">
        <h2 className="text-[16px] font-medium text-ink">Recommended jobs</h2>
        <ul className="mt-4 grid gap-3">
          {recommended.map((job) => (
            <li key={job.id}>
              <Link
                href={`/jobs/${job.id}`}
                className="block rounded-lg bg-surface p-5 ring-1 ring-hairline-soft hover:bg-surface-faint"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{job.title}</p>
                  {job.fit ? (
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${FIT_CLASS[job.fit]}`}>
                      {FIT_LABEL[job.fit]}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[14px] text-body">
                  {job.company} · {job.location} · {salaryLabel(job)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-[16px] font-medium text-ink">Saved jobs</h2>
        {saved.length === 0 ? (
          <p className="mt-3 text-[14px] text-body">Nothing saved yet.</p>
        ) : (
          <ul className="mt-4 grid gap-2">
            {saved.map((job) =>
              job ? (
                <li key={job.id} className="text-[14px] text-ink">
                  <Link href={`/jobs/${job.id}`} className="hover:underline">
                    {job.title} · {job.company}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-[16px] font-medium text-ink">Next steps</h2>
        <ul className="mt-4 grid gap-2 text-[14px] text-body">
          <li>
            <Link href="/konto/gemerkt" className="text-ink underline">
              Review saved jobs
            </Link>
          </li>
          <li>
            <Link href="/konto/profil" className="text-ink underline">
              Complete your resume
            </Link>
          </li>
          <li>
            <Link href="/konto/bewerbungen" className="text-ink underline">
              Prepare your first application
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Card({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-surface p-5 ring-1 ring-hairline-soft hover:bg-surface-faint"
    >
      <p className="text-[13px] text-muted">{label}</p>
      <p className="font-display mt-2 text-[32px] font-semibold tracking-[-0.04em]">
        {value}
      </p>
    </Link>
  );
}
