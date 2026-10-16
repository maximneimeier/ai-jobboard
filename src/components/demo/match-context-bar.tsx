"use client";

import Link from "next/link";
import type { CareerProfile } from "@/lib/demo/store";

export function MatchContextBar({
  profile,
  personalized,
}: {
  profile: CareerProfile | null;
  personalized: boolean;
}) {
  if (!personalized || !profile) {
    return (
      <div className="flex flex-col gap-3 rounded-xl bg-surface p-4 ring-1 ring-hairline-soft md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[14px] font-medium text-ink">Matching jobs based on your search</p>
          <p className="mt-1 text-[13px] leading-5 text-body">
            Add a career profile to rank roles by skills, location, and what you want next.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-ink px-3.5 text-[13px] font-medium text-white"
        >
          Create your profile
        </Link>
      </div>
    );
  }

  const roles = profile.desiredRoles.slice(0, 3);
  const places = profile.desiredLocations.slice(0, 3);
  const skills = profile.skills.slice(0, 4);
  const missing: string[] = [];
  if (!profile.skills.length) missing.push("skills");
  if (!profile.languages.length) missing.push("languages");
  if (!profile.desiredRoles.length) missing.push("target roles");
  const goal = profile.notes.trim();

  return (
    <div className="rounded-xl bg-surface p-4 ring-1 ring-hairline-soft md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-ink">
            Matching jobs based on your career profile
          </p>
          <dl className="mt-3 grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
            <Fact label="Target roles" value={roles.join(", ") || "Not set"} />
            <Fact label="Locations" value={places.join(", ") || profile.location || "Not set"} />
            <Fact label="Skills on file" value={skills.join(", ") || "Not set"} />
            <Fact
              label="Career notes"
              value={goal ? clip(goal, 90) : "Not set"}
            />
          </dl>
          {missing.length ? (
            <p className="mt-3 text-[12px] text-muted">
              Missing from your profile: {missing.join(", ")}. Adding them improves match quality.
            </p>
          ) : null}
        </div>
        <Link
          href="/onboarding/roles"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-3.5 text-[13px] font-medium text-ink ring-1 ring-hairline hover:bg-canvas"
        >
          Improve my matches
        </Link>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
    </div>
  );
}

function clip(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}
