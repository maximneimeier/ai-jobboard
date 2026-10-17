"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { rankDemoJobs, rankingHint, type RankedDemoJob } from "@/lib/demo/match";
import { paths } from "@/lib/demo/paths";
import {
  clearJobFeedback,
  setJobFeedback,
  setSearch,
  setSort,
  toggleSave,
  useDemo,
  type FeedbackAction,
  type FeedbackReason,
} from "@/lib/demo/store";
import { ActiveFilterChips, JobFilterSidebar } from "./job-filter-sidebar";
import { JobMatchPanel } from "./job-match-panel";
import { JobResultCard } from "./job-result-card";
import { MatchContextBar } from "./match-context-bar";

type JobsView = "best" | "discover";

export function ResultsBoard({
  initialRole,
  initialLocation,
  openPersonalize = false,
}: {
  initialRole: string;
  initialLocation: string;
  openPersonalize?: boolean;
}) {
  const demo = useDemo();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<JobsView>("best");
  const [openJobId, setOpenJobId] = useState<string | null>(null);

  useEffect(() => {
    if (demo.roleTags.length || demo.locationTags.length) return;
    if (initialRole || initialLocation) {
      setSearch(initialRole, initialLocation);
    }
  }, [demo.locationTags.length, demo.roleTags.length, initialLocation, initialRole]);

  useEffect(() => {
    if (openPersonalize) router.replace("/onboarding");
  }, [openPersonalize, router]);

  const query = demo.query || initialRole;
  const location = demo.location || initialLocation;
  const results = useMemo(
    () =>
      rankDemoJobs(
        query,
        location,
        demo.filters,
        demo.sort,
        demo.profile,
        demo.personalized,
        demo.roleTags,
        demo.locationTags,
      ),
    [query, location, demo.filters, demo.sort, demo.profile, demo.personalized, demo.roleTags, demo.locationTags],
  );

  const hidden = useMemo(() => {
    return new Set(
      (demo.jobFeedback ?? [])
        .filter((item) => item.action === "not_interested")
        .map((item) => item.jobId),
    );
  }, [demo.jobFeedback]);

  const visible = results.filter((job) => !hidden.has(job.id));
  const { best, discover } = splitJobs(visible, demo.personalized);
  const shown = view === "best" ? best : discover;
  const openJob = shown.concat(visible).find((job) => job.id === openJobId) ?? null;
  const heading = demo.roleTags.length
    ? demo.roleTags.join(", ")
    : query || "Open search";
  const place = demo.locationTags.length
    ? demo.locationTags.join(", ")
    : location;

  function onSave(jobId: string) {
    toggleSave(jobId);
  }

  function onFeedback(jobId: string, action: FeedbackAction, reason?: FeedbackReason) {
    setJobFeedback(jobId, action, reason);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-5 py-8 md:flex-row md:px-8">
      <div className="md:hidden">
        <button
          type="button"
          className="inline-flex h-10 items-center rounded-lg px-3 text-[14px] ring-1 ring-hairline"
          onClick={() => setFiltersOpen(true)}
        >
          Filters
        </button>
      </div>
      <JobFilterSidebar
        filters={demo.filters}
        resultCount={visible.length}
        mobileOpen={filtersOpen}
        onCloseMobile={() => setFiltersOpen(false)}
        personalized={demo.personalized}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-1.5">
          <ViewTab
            href={undefined}
            active={view === "best"}
            onClick={() => setView("best")}
            label="Best matches"
            count={best.length}
          />
          <ViewTab
            href={undefined}
            active={view === "discover"}
            onClick={() => setView("discover")}
            label="Discover"
            count={discover.length}
          />
          <ViewTab href={paths.applications} label="My applications" />
        </div>

        <p className="mt-5 text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          {view === "best" ? "Best matches" : "Discover"}
        </p>
        <h1 className="font-display mt-1.5 text-[28px] font-semibold tracking-[-0.32px] text-ink md:text-[32px]">
          {heading}
          {place ? ` in ${place}` : ""}
        </h1>
        <p className="mt-2 text-[14px] text-body">
          {shown.length} {shown.length === 1 ? "job" : "jobs"}
          {hidden.size ? ` · ${hidden.size} hidden after feedback` : ""}.{" "}
          {rankingHint(demo.personalized)}
        </p>

        <div className="mt-5">
          <MatchContextBar profile={demo.profile} personalized={demo.personalized} />
        </div>

        <div className="mt-4">
          <ActiveFilterChips />
        </div>

        {hidden.size ? (
          <p className="mt-3 text-[12px] text-muted">
            Jobs marked not interested stay hidden on this page.{" "}
            <button
              type="button"
              className="text-ink underline"
              onClick={() => {
                for (const item of demo.jobFeedback) {
                  if (item.action === "not_interested") clearJobFeedback(item.jobId);
                }
              }}
            >
              Show them again
            </button>
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <label className="text-[13px] text-muted" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={demo.sort}
            onChange={(event) => setSort(event.target.value as typeof demo.sort)}
            className="h-9 rounded-md bg-surface px-3 text-[14px] ring-1 ring-hairline outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="relevant">Most relevant</option>
            <option value="recent">Most recent</option>
            <option value="salary">Salary</option>
          </select>
        </div>

        {shown.length === 0 ? (
          <EmptyState
            view={view}
            hasResults={visible.length > 0}
            onDiscover={() => setView("discover")}
          />
        ) : (
          <ul className="mt-4 grid gap-2">
            {shown.map((job) => (
              <li key={job.id}>
                <JobResultCard
                  job={job}
                  profile={demo.profile}
                  personalized={demo.personalized}
                  saved={demo.savedIds.includes(job.id)}
                  feedback={demo.jobFeedback?.find((item) => item.jobId === job.id)?.action}
                  onOpen={() => setOpenJobId(job.id)}
                  onSave={() => onSave(job.id)}
                  onFeedback={(action, reason) => onFeedback(job.id, action, reason)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {openJob ? (
        <JobMatchPanel
          job={openJob}
          profile={demo.profile}
          personalized={demo.personalized}
          saved={demo.savedIds.includes(openJob.id)}
          onClose={() => setOpenJobId(null)}
          onSave={() => onSave(openJob.id)}
        />
      ) : null}

    </div>
  );
}

function splitJobs(jobs: RankedDemoJob[], personalized: boolean) {
  if (personalized) {
    const best = jobs.filter((job) => job.fit === "strong" || job.fit === "good" || !job.fit);
    const discover = jobs.filter((job) => job.fit === "stretch" || job.fit === "review");
    if (!best.length) return { best: jobs, discover };
    return { best, discover };
  }
  const best = jobs.filter((job) => job.searchLabel === "match");
  const discover = jobs.filter((job) => job.searchLabel !== "match");
  if (!best.length) return { best: jobs, discover: [] };
  return { best, discover };
}

function ViewTab({
  label,
  count,
  active,
  href,
  onClick,
}: {
  label: string;
  count?: number;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const className = active
    ? "inline-flex h-9 items-center rounded-lg bg-ink px-3 text-[13px] font-medium text-white"
    : "inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-medium text-ink ring-1 ring-hairline hover:bg-surface";
  const text = count === undefined ? label : `${label} · ${count}`;
  if (href) {
    return (
      <Link href={href} className={className}>
        {text}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} aria-current={active ? "page" : undefined}>
      {text}
    </button>
  );
}

function EmptyState({
  view,
  hasResults,
  onDiscover,
}: {
  view: JobsView;
  hasResults: boolean;
  onDiscover: () => void;
}) {
  return (
    <div className="mt-8 rounded-xl bg-surface px-5 py-10 ring-1 ring-hairline-soft">
      <p className="text-[15px] font-medium text-ink">
        {view === "discover" ? "No extra roles in Discover" : "No matching jobs"}
      </p>
      <p className="mt-2 max-w-[48ch] text-[14px] leading-6 text-body">
        {hasResults && view === "best"
          ? "Nothing in Best matches for these filters. Try Discover, or reset a filter."
          : "Reset filters or change the role and city."}
      </p>
      {hasResults && view === "best" ? (
        <button
          type="button"
          onClick={onDiscover}
          className="mt-4 inline-flex h-9 items-center rounded-lg bg-ink px-3.5 text-[13px] font-medium text-white"
        >
          Open Discover
        </button>
      ) : null}
    </div>
  );
}
