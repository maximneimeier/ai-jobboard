"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { logoForCompany } from "@/lib/companies";
import {
  openApplicationFromJob,
  readApplications,
  readApplicationsSnapshot,
  removeApplication,
  subscribeApplications,
} from "@/lib/applications";
import {
  JOB_STATUSES,
  readSavedJobs,
  readSavedJobsSnapshot,
  removeSavedJob,
  saveJob,
  savedJobStatusLabel,
  setJobStatus,
  subscribeSavedJobs,
  type JobStatus,
} from "@/lib/saved-jobs";
import type { DetailCheck, RankedJob } from "@/lib/search";

const CULTURE: Record<RankedJob["culture"], string> = {
  startup: "Startup",
  scaleup: "Scale-up",
  corporate: "Konzern",
};

const SENIORITY: Record<RankedJob["seniority"], string> = {
  junior: "Junior",
  mid: "Professional",
  senior: "Senior",
  lead: "Lead",
  staff: "Staff",
};

export function JobCard({
  job,
  open,
  onToggle,
}: {
  job: RankedJob;
  open: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const logo = logoForCompany(job.company);
  const cardRef = useRef<HTMLElement>(null);
  const savedJobs = useSyncExternalStore(
    subscribeSavedJobs,
    readSavedJobs,
    readSavedJobsSnapshot,
  );
  const applications = useSyncExternalStore(
    subscribeApplications,
    readApplications,
    readApplicationsSnapshot,
  );
  const saved = savedJobs.find((item) => item.id === job.id);
  const application = applications.find((item) => item.jobId === job.id);
  const [writing, setWriting] = useState(false);
  const tasks = job.responsibilityChecks ?? asChecks(job.responsibilities);
  const needs = job.requirementChecks ?? asChecks(job.requirements);

  useEffect(() => {
    if (!open) return;
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open]);

  return (
    <article ref={cardRef} className="rounded-lg bg-canvas ring-1 ring-hairline-soft">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-col p-4 text-left hover:bg-surface-faint"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <CompanyMark company={job.company} logo={logo} />
            <div className="min-w-0">
              <h3 className="text-[15px] font-medium tracking-[-0.16px] text-ink">
                {job.role}
              </h3>
              <p className="mt-1 text-[13px] text-body">
                {job.company} · {job.city}
                {job.city === "Remote" ? "" : ` · ${workModeLabel(job.workMode)}`}
              </p>
            </div>
          </div>
          <span className="flex items-center gap-2">
            {saved ? (
              <span className="rounded-md bg-surface-soft px-1.5 py-0.5 text-[11px] font-medium text-ink">
                {savedJobStatusLabel(saved.status)}
              </span>
            ) : null}
            <span className="rounded-md bg-[#eaf8f2] px-1.5 py-0.5 text-[12px] font-medium text-success">
              {job.match}%
            </span>
            <Chevron open={open} />
          </span>
        </div>
        <p className="mt-3 text-[13px] leading-6 text-body">
          {job.salaryMin} bis {job.salaryMax}k
        </p>
        {job.fits.length ? (
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
            {job.fits.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink"
              >
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[13px] leading-6 text-body">{job.why}</p>
        )}
        {job.gaps.length ? (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
            {job.gaps.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 text-[12px] text-muted"
              >
                <MissIcon />
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </button>

      {open ? (
        <div className="border-t border-hairline-soft px-4 pt-4 pb-5">
          <p className="whitespace-pre-line text-[14px] leading-6 text-ink">
            {job.description}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-3">
            <Fact label="Level" value={SENIORITY[job.seniority]} />
            <Fact label="Team" value={`${job.teamSize} Personen`} />
            <Fact label="Kultur" value={CULTURE[job.culture]} />
            <Fact
              label="Modell"
              value={
                job.city === "Remote" ? "Remote" : workModeLabel(job.workMode)
              }
            />
            <Fact
              label="Bereitschaft"
              value={job.onCall ? "Ja" : "Nein"}
            />
            <Fact
              label="Woche"
              value={job.fourDayWeek ? "4 Tage möglich" : "5 Tage"}
            />
          </dl>

          {job.stack.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-md bg-surface-soft px-2 py-0.5 text-[12px] font-medium text-ink-soft"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}

          <section className="mt-5">
            <h4 className="text-[13px] font-medium tracking-[-0.16px] text-ink">
              Aufgaben
            </h4>
            <p className="mt-1 text-[12px] text-muted">
              Haken passt zu deinem Profil. Kreuz weicht ab.
            </p>
            <CheckList items={tasks} />
          </section>

          <section className="mt-5">
            <h4 className="text-[13px] font-medium tracking-[-0.16px] text-ink">
              Das bringst du mit
            </h4>
            <p className="mt-1 text-[12px] text-muted">
              Was du schon mitbringst, und wo es hakt.
            </p>
            <CheckList items={needs} />
          </section>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {application ? (
              <Link
                href={`/gemerkt/${job.id}`}
                className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] font-medium tracking-[-0.16px] text-white"
              >
                Bewerbung öffnen
              </Link>
            ) : (
              <button
                type="button"
                disabled={writing}
                onClick={async () => {
                  setWriting(true);
                  try {
                    await openApplicationFromJob(job);
                    window.location.assign(`/gemerkt/${job.id}`);
                  } finally {
                    setWriting(false);
                  }
                }}
                className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] font-medium tracking-[-0.16px] text-white disabled:opacity-60"
              >
                {writing ? "Erzeugt…" : "Bewerbung schreiben"}
              </button>
            )}
            {saved ? (
              <>
                <label className="sr-only" htmlFor={`card-status-${job.id}`}>
                  Status
                </label>
                <select
                  id={`card-status-${job.id}`}
                  value={saved.status}
                  onChange={(event) =>
                    setJobStatus(job.id, event.target.value as JobStatus)
                  }
                  className="h-10 rounded-md bg-canvas px-3 text-[14px] text-ink ring-1 ring-hairline outline-none focus:ring-ink"
                >
                  {JOB_STATUSES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <Link
                  href="/gemerkt"
                  className="inline-flex h-10 items-center rounded-md px-3 text-[14px] font-medium text-ink ring-1 ring-hairline"
                >
                  Zur Liste
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    removeSavedJob(job.id);
                    removeApplication(job.id);
                  }}
                  className="inline-flex h-10 items-center rounded-md px-3 text-[14px] text-muted"
                >
                  Entfernen
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => saveJob(job)}
                className="inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline"
              >
                Merken
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                saveJob(job, "applied");
                router.push("/gemerkt");
              }}
              className="inline-flex h-10 items-center rounded-md px-3 text-[14px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline"
            >
              Beworben
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function asChecks(lines: string[]): DetailCheck[] {
  return lines.map((text) => ({ text, fit: true }));
}

function CheckList({ items }: { items: DetailCheck[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {items.map((item) => (
        <li key={item.text} className="flex gap-2.5 text-[14px] leading-6">
          <span className="mt-0.5 shrink-0">
            {item.fit ? <CheckIcon /> : <MissIcon />}
          </span>
          <span className={item.fit ? "text-ink" : "text-body"}>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}

function CompanyMark({ company, logo }: { company: string; logo: string }) {
  const [failed, setFailed] = useState(false);

  if (!logo || failed) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-ink text-[12px] font-medium text-white">
        {company.slice(0, 1)}
      </span>
    );
  }

  return (
    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-hairline-soft">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo}
        alt=""
        width={36}
        height={36}
        className="size-7 object-contain"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={`mt-0.5 text-muted transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M3.5 5.5L7 9l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 text-success"
      aria-hidden
    >
      <path
        d="M3 7.2l2.4 2.4L11 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MissIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 text-muted-soft"
      aria-hidden
    >
      <path
        d="M4 4l6 6M10 4l-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function workModeLabel(mode: RankedJob["workMode"]) {
  if (mode === "remote") return "Remote";
  if (mode === "hybrid") return "Hybrid";
  return "Vor Ort";
}
