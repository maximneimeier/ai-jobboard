"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  readSavedJobs,
  readSavedJobsSnapshot,
  subscribeSavedJobs,
} from "@/lib/saved-jobs";

export function SavedJobsButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  const jobs = useSyncExternalStore(
    subscribeSavedJobs,
    readSavedJobs,
    readSavedJobsSnapshot,
  );

  return (
    <Link
      href="/gemerkt"
      className={
        compact
          ? "relative inline-flex size-9 items-center justify-center rounded-md ring-1 ring-hairline"
          : "inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-[14px] tracking-[-0.16px] text-ink ring-1 ring-hairline"
      }
    >
      <BookmarkIcon />
      {compact ? (
        <span className="sr-only">Gemerkt</span>
      ) : (
        <span>Gemerkt</span>
      )}
      {jobs.length ? (
        <span
          className={
            compact
              ? "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white"
              : "rounded-md bg-surface-soft px-1.5 text-[11px] font-medium text-ink"
          }
        >
          {jobs.length}
        </span>
      ) : null}
    </Link>
  );
}

function BookmarkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3.5 2.5h7v9L7 9.4 3.5 11.5v-9z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
