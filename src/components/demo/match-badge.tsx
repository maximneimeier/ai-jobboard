import { FIT_CLASS, FIT_LABEL, SEARCH_LABEL, type FitLabel, type SearchLabel } from "@/lib/demo/match";

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
