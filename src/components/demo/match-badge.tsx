"use client";

import {
  FIT_CLASS,
  FIT_LABEL,
  SEARCH_LABEL,
  experienceVerdict,
  type FitLabel,
  type SearchLabel,
} from "@/lib/demo/match";
import type { Level } from "@/lib/demo/jobs";

export function MatchBadge({
  fit,
  searchLabel,
  personalized,
}: {
  fit?: FitLabel;
  searchLabel: SearchLabel;
  personalized: boolean;
}) {
  if (personalized && fit) {
    return (
      <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${FIT_CLASS[fit]}`}>
        {FIT_LABEL[fit]}
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-ink">
      {SEARCH_LABEL[searchLabel]}
    </span>
  );
}

export function ExperienceMark({ years, level }: { years: number; level: Level }) {
  const verdict = experienceVerdict(years, level);
  return (
    <span
      className={
        verdict.enough
          ? "inline-flex rounded-md bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success-text"
          : "inline-flex rounded-md bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning-text"
      }
    >
      {verdict.label}
    </span>
  );
}
