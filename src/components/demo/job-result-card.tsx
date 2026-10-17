"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import {
  LEVEL_LABEL,
  WORK_MODE_LABEL,
  matchChecks,
  postedLabel,
  salaryLabel,
  type RankedDemoJob,
} from "@/lib/demo/match";
import type { CareerProfile, FeedbackAction, FeedbackReason } from "@/lib/demo/store";
import { ExperienceMark, MatchBadge } from "./match-badge";
import { SkillChecks } from "./skill-checks";
import { JobFeedbackControls } from "./job-feedback-controls";

export function companyInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || "?";
}

export function JobResultCard({
  job,
  profile,
  personalized,
  saved,
  feedback,
  onOpen,
  onSave,
  onFeedback,
}: {
  job: RankedDemoJob;
  profile: CareerProfile | null;
  personalized: boolean;
  saved: boolean;
  feedback?: FeedbackAction;
  onOpen: () => void;
  onSave: () => void;
  onFeedback: (action: FeedbackAction, reason?: FeedbackReason) => void;
}) {
  const checks = personalized && profile ? matchChecks(job, profile) : [];

  return (
    <article className="rounded-xl bg-surface p-4 ring-1 ring-hairline-soft transition hover:ring-hairline md:px-5 md:py-4">
      <div className="flex gap-3">
        <div
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-[11px] font-semibold tracking-wide text-accent"
          aria-hidden
        >
          {companyInitials(job.company)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[15px] font-medium tracking-[-0.16px] text-ink">
                  {job.title}
                </h2>
                <MatchBadge
                  fit={job.fit}
                  searchLabel={job.searchLabel}
                  personalized={personalized}
                />
                {personalized && profile ? (
                  <ExperienceMark years={profile.years} level={job.level} />
                ) : null}
              </div>
              <p className="mt-0.5 text-[13px] text-body">
                {job.company}
                <span className="text-muted-soft"> · </span>
                {job.location}
                <span className="text-muted-soft"> · </span>
                {WORK_MODE_LABEL[job.workMode]}
                <span className="text-muted-soft"> · </span>
                {LEVEL_LABEL[job.level]}
              </p>
            </div>
            <p className="shrink-0 text-[12px] text-muted">
              {salaryLabel(job)}
              <span className="text-muted-soft"> · </span>
              {postedLabel(job.postedDaysAgo)}
            </p>
          </div>

          {personalized && checks.length ? (
            <div className="mt-2.5">
              <SkillChecks checks={checks} compact limit={5} />
            </div>
          ) : job.skills.length ? (
            <p className="mt-2 text-[12px] text-muted">
              {job.skills.slice(0, 5).join(" · ")}
            </p>
          ) : null}

          <p className="mt-2.5 max-w-[62ch] text-[13px] leading-5 text-body">
            {job.summaryLine}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex h-9 items-center rounded-lg bg-ink px-3.5 text-[13px] font-medium text-white transition hover:bg-ink-soft focus-visible:ring-2 focus-visible:ring-accent"
            >
              View match
            </button>
            <button
              type="button"
              onClick={onSave}
              aria-pressed={saved}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-ink ring-1 ring-hairline transition hover:bg-canvas focus-visible:ring-2 focus-visible:ring-accent"
            >
              {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              {saved ? "Saved" : "Save job"}
            </button>
            <JobFeedbackControls value={feedback} onFeedback={onFeedback} />
          </div>
        </div>
      </div>
    </article>
  );
}
