"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { logoForCompany } from "@/lib/companies";
import {
  buildApplication,
  openApplicationFromJob,
  readApplications,
  readApplicationsSnapshot,
  removeApplication,
  resolveJobSource,
  subscribeApplications,
} from "@/lib/applications";
import {
  EMPTY_PROFILE,
  profileCriteria,
  readProfile,
  subscribeProfile,
} from "@/lib/profile";
import {
  JOB_STATUSES,
  readSavedJobs,
  readSavedJobsSnapshot,
  removeSavedJob,
  saveJob,
  setJobStatus,
  subscribeSavedJobs,
  type JobStatus,
  type SavedJob,
} from "@/lib/saved-jobs";
import {
  criteriaHasSignal,
  recommendJobs,
  type RankedJob,
} from "@/lib/search";

export function SavedJobsList() {
  const jobs = useSyncExternalStore(
    subscribeSavedJobs,
    readSavedJobs,
    readSavedJobsSnapshot,
  );
  const profile = useSyncExternalStore(
    subscribeProfile,
    readProfile,
    () => EMPTY_PROFILE,
  );
  const criteria = useMemo(() => profileCriteria(profile), [profile]);
  const hasProfile = criteriaHasSignal(criteria);
  const recommended = useMemo(() => {
    const savedIds = jobs.map((job) => job.id);
    return recommendJobs(criteria, savedIds, 12);
  }, [criteria, jobs]);

  return (
    <section className="flex-1 bg-canvas">
      <div className="mx-auto w-full max-w-[1080px] px-5 py-16 md:px-8 md:py-20">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Gemerkt
        </p>
        <h1 className="font-display mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          Deine Stellen.
        </h1>
        <p className="mt-3 max-w-[46ch] text-[16px] leading-7 text-body">
          {jobs.length
            ? `${jobs.length} ${jobs.length === 1 ? "Stelle" : "Stellen"} gespeichert. Hier schreibst du Lebenslauf und Anschreiben.`
            : "Merk dir Stellen in der Suche. Hier landest du sie, schreibst die Bewerbung und trägst den Status ein."}
        </p>

        {jobs.length === 0 ? (
          <div className="mt-10 rounded-lg bg-surface-faint px-5 py-10 ring-1 ring-hairline-soft">
            <p className="text-[15px] leading-6 text-body">
              Noch nichts gemerkt. Unten liegen passende Rollen. Oder öffne eine
              Stelle in der Suche und klick auf Merken.
            </p>
            <Link
              href="/#suche"
              className="mt-5 inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] font-medium tracking-[-0.16px] text-white"
            >
              Zur Suche
            </Link>
          </div>
        ) : (
          <ul className="mt-10 grid gap-3">
            {jobs.map((job) => (
              <li key={job.id}>
                <SavedJobRow job={job} />
              </li>
            ))}
          </ul>
        )}

        {recommended.length > 0 ? (
          <div className="mt-16">
            <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              Passend zu dir
            </p>
            <h2 className="font-display mt-2 text-[24px] leading-[1.2] font-semibold tracking-[-0.32px] text-ink md:text-[28px]">
              Weitere Stellen.
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-6 text-body">
              {hasProfile
                ? "Aus deinem Profil und den gemerkten Rollen. Merk sie dir oder schreib gleich die Bewerbung."
                : "Noch kein klares Profil. Hier ein paar Rollen zum Starten. Im Profil wird der Fit genauer."}
            </p>
            {!hasProfile ? (
              <Link
                href="/profil"
                className="mt-4 inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline"
              >
                Profil ausfüllen
              </Link>
            ) : null}
            <ul className="mt-8 grid gap-3">
              {recommended.map((job) => (
                <li key={job.id}>
                  <RecommendedJobRow job={job} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function SavedJobRow({ job }: { job: SavedJob }) {
  const router = useRouter();
  const logo = logoForCompany(job.company);
  const applications = useSyncExternalStore(
    subscribeApplications,
    readApplications,
    readApplicationsSnapshot,
  );
  const hasDocs = applications.some((item) => item.jobId === job.id);
  const [writing, setWriting] = useState(false);

  async function writeApplication() {
    const source = resolveJobSource(job.id);
    if (!source) {
      router.push(`/gemerkt/${job.id}`);
      return;
    }
    setWriting(true);
    try {
      await buildApplication(source);
      router.push(`/gemerkt/${job.id}`);
    } finally {
      setWriting(false);
    }
  }

  return (
    <article className="rounded-lg bg-canvas p-5 ring-1 ring-hairline-soft md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {logo ? (
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-hairline-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt=""
                width={44}
                height={44}
                className="size-8 object-contain"
              />
            </span>
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ink text-[14px] font-medium text-white">
              {job.company.slice(0, 1)}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="text-[17px] font-medium tracking-[-0.16px] text-ink">
              {job.role}
            </h2>
            <p className="mt-1 text-[14px] text-body">
              {job.company} · {job.city}
              {job.city === "Remote" ? "" : ` · ${workModeLabel(job.workMode)}`}
            </p>
            <p className="mt-2 text-[13px] text-muted">
              {job.salaryMin} bis {job.salaryMax}k · {job.match}% Fit
              {hasDocs ? " · Lebenslauf und Anschreiben" : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {hasDocs ? (
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
              onClick={writeApplication}
              className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] font-medium tracking-[-0.16px] text-white disabled:opacity-60"
            >
              {writing ? "Erzeugt…" : "Bewerbung schreiben"}
            </button>
          )}
          <label className="sr-only" htmlFor={`status-${job.id}`}>
            Status
          </label>
          <select
            id={`status-${job.id}`}
            value={job.status}
            onChange={(event) =>
              setJobStatus(job.id, event.target.value as JobStatus)
            }
            className="h-10 min-w-[148px] rounded-md bg-canvas px-3 text-[14px] text-ink ring-1 ring-hairline outline-none focus:ring-ink"
          >
            {JOB_STATUSES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              removeSavedJob(job.id);
              removeApplication(job.id);
            }}
            className="inline-flex h-10 items-center rounded-md px-3 text-[14px] text-muted ring-1 ring-hairline hover:text-ink"
          >
            Entfernen
          </button>
        </div>
      </div>
    </article>
  );
}

function RecommendedJobRow({ job }: { job: RankedJob }) {
  const router = useRouter();
  const logo = logoForCompany(job.company);
  const [writing, setWriting] = useState(false);

  async function writeApplication() {
    setWriting(true);
    try {
      await openApplicationFromJob(job);
      router.push(`/gemerkt/${job.id}`);
    } finally {
      setWriting(false);
    }
  }

  return (
    <article className="rounded-lg bg-canvas p-5 ring-1 ring-hairline-soft md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {logo ? (
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-hairline-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt=""
                width={44}
                height={44}
                className="size-8 object-contain"
              />
            </span>
          ) : (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-ink text-[14px] font-medium text-white">
              {job.company.slice(0, 1)}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="text-[17px] font-medium tracking-[-0.16px] text-ink">
              {job.role}
            </h3>
            <p className="mt-1 text-[14px] text-body">
              {job.company} · {job.city}
              {job.city === "Remote" ? "" : ` · ${workModeLabel(job.workMode)}`}
            </p>
            <p className="mt-2 text-[13px] text-muted">
              {job.salaryMin} bis {job.salaryMax}k
              {job.match > 0 ? ` · ${job.match}% Fit` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <button
            type="button"
            disabled={writing}
            onClick={writeApplication}
            className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] font-medium tracking-[-0.16px] text-white disabled:opacity-60"
          >
            {writing ? "Erzeugt…" : "Bewerbung schreiben"}
          </button>
          <button
            type="button"
            onClick={() => saveJob(job)}
            className="inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline"
          >
            Merken
          </button>
        </div>
      </div>
    </article>
  );
}

function workModeLabel(mode: SavedJob["workMode"]) {
  if (mode === "remote") return "Remote";
  if (mode === "hybrid") return "Hybrid";
  return "Vor Ort";
}
