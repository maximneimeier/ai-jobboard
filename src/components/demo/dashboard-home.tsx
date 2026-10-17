"use client";

import Link from "next/link";
import { useMemo } from "react";
import { demoJobById } from "@/lib/demo/jobs";
import {
  FIT_CLASS,
  FIT_LABEL,
  WORK_MODE_LABEL,
  rankDemoJobs,
  salaryLabel,
} from "@/lib/demo/match";
import { paths } from "@/lib/demo/paths";
import {
  EMPTY_FILTERS,
  useDemo,
  type ApplicationStatus,
} from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  interested: "Interested",
  preparing: "Preparing",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const EXAMPLE_ROLES = ["Software Engineer", "Frontend Engineer", "Full Stack Engineer"];
const EXAMPLE_PLACES = ["Berlin", "Germany", "Amsterdam"];

export function DashboardHome() {
  const demo = useDemo();
  const profile = demo.profile;
  const matches = useMemo(() => {
    const roles = profile?.desiredRoles.length ? profile.desiredRoles : EXAMPLE_ROLES;
    const places = profile?.desiredLocations.length
      ? profile.desiredLocations
      : EXAMPLE_PLACES;
    const ranked = rankDemoJobs(
      roles[0] || "Software Engineer",
      places[0] || profile?.location || "Berlin",
      EMPTY_FILTERS,
      "relevant",
      profile,
      true,
      roles,
      places,
    );
    if (ranked.length) return ranked;
    return rankDemoJobs(
      EXAMPLE_ROLES[0],
      EXAMPLE_PLACES[0],
      EMPTY_FILTERS,
      "relevant",
      profile,
      Boolean(profile),
      EXAMPLE_ROLES,
      EXAMPLE_PLACES,
    );
  }, [profile]);
  const recommended = matches.slice(0, 4);
  const saved = demo.savedIds.map(demoJobById).filter((job) => job != null);
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
          value={String(matches.length)}
          href="/jobs"
        />
        <Card label="Saved jobs" value={String(saved.length)} href={paths.saved} />
        <Card
          label="Applications in progress"
          value={String(inProgress.length)}
          href={paths.applications}
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
                  {job.company} · {placeLine(job)} · {salaryLabel(job)}
                </p>
                <p className="mt-2 text-[14px] leading-6 text-ink">{job.summary}</p>
                <p className="mt-2 text-[12px] text-muted">
                  Posted {job.postedDaysAgo} {job.postedDaysAgo === 1 ? "day" : "days"} ago
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
          <ul className="mt-4 grid gap-3">
            {saved.map((job) => (
              <li key={job.id}>
                <Link
                  href={`/jobs/${job.id}`}
                  className="block rounded-lg bg-surface px-5 py-4 ring-1 ring-hairline-soft hover:bg-surface-faint"
                >
                  <p className="text-[14px] font-medium text-ink">
                    {job.title} · {job.company}
                  </p>
                  <p className="mt-1 text-[13px] text-body">
                    {placeLine(job)} · {salaryLabel(job)}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-muted">{job.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-[16px] font-medium text-ink">Applications in progress</h2>
        {inProgress.length === 0 ? (
          <p className="mt-3 text-[14px] text-body">No applications in progress.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {inProgress.map((item) => {
              const job = demoJobById(item.jobId);
              if (!job) return null;
              return (
                <li key={item.jobId}>
                  <Link
                    href={paths.applications}
                    className="block rounded-lg bg-surface p-5 ring-1 ring-hairline-soft hover:bg-surface-faint"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-ink">
                        {job.title} · {job.company}
                      </p>
                      <span className="rounded-md bg-canvas px-2 py-0.5 text-[11px] font-medium text-ink ring-1 ring-hairline-soft">
                        {STATUS_LABEL[item.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] leading-6 text-body">{item.notes}</p>
                    {item.followUp ? (
                      <p className="mt-2 text-[12px] text-muted">Follow up {item.followUp}</p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-[16px] font-medium text-ink">Next steps</h2>
        <ul className="mt-4 grid gap-2 text-[14px] text-body">
          <li>
            <Link href={paths.saved} className="text-ink underline">
              Review saved jobs
            </Link>
          </li>
          <li>
            <Link href={paths.profile} className="text-ink underline">
              Review your profile
            </Link>
          </li>
          <li>
            <Link href={paths.applications} className="text-ink underline">
              Open your applications
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function placeLine(job: { location: string; workMode: keyof typeof WORK_MODE_LABEL }) {
  const mode = WORK_MODE_LABEL[job.workMode];
  return job.location.toLowerCase() === mode.toLowerCase()
    ? job.location
    : `${job.location} · ${mode}`;
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
