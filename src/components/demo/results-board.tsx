"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  EMPLOYMENT_LABEL,
  FIT_CLASS,
  FIT_LABEL,
  INDUSTRY_LABEL,
  matchChecks,
  LEVEL_LABEL,
  SEARCH_LABEL,
  WORK_MODE_LABEL,
  postedLabel,
  rankDemoJobs,
  salaryLabel,
} from "@/lib/demo/match";
import { catalogLocations, INDUSTRIES, type Employment, type Level, type WorkMode } from "@/lib/demo/jobs";
import {
  addLocationTag,
  addRoleTag,
  resetFilters,
  setFilters,
  setSearch,
  setSort,
  toggleLocationTag,
  toggleRoleTag,
  toggleSave,
  useDemo,
  type DemoFilters,
} from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";
import { SignupModal } from "./signup-modal";
import { SkillChecks } from "./skill-checks";

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
  const [signupOpen, setSignupOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  function onSave(jobId: string) {
    const result = toggleSave(jobId);
    if (result.needsSignup) setSignupOpen(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-5 py-10 md:flex-row md:px-8">
      <aside className="md:w-[280px] md:shrink-0">
        <button
          type="button"
          className="mb-4 inline-flex h-10 items-center rounded-md px-3 text-[14px] ring-1 ring-hairline md:hidden"
          onClick={() => setFiltersOpen((value) => !value)}
        >
          {filtersOpen ? "Hide filters" : "Filters"}
        </button>
        <div className={filtersOpen ? "block" : "hidden md:block"}>
          <FilterPanel filters={demo.filters} />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Results
        </p>
        <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
          {demo.roleTags.length
            ? demo.roleTags.join(", ")
            : query || "Open search"}
          {demo.locationTags.length
            ? ` in ${demo.locationTags.join(", ")}`
            : location
              ? ` in ${location}`
              : ""}
        </h1>
        <p className="mt-2 text-[15px] text-body">
          {results.length} {results.length === 1 ? "job" : "jobs"} matching your search.
        </p>

        {demo.profile?.desiredRoles.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {demo.profile.desiredRoles.map((role) => {
              const on = demo.roleTags.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRoleTag(role)}
                  className={
                    on
                      ? "inline-flex h-8 items-center rounded-full bg-accent px-3 text-[13px] font-medium text-white"
                      : "inline-flex h-8 items-center rounded-full bg-surface px-3 text-[13px] font-medium text-ink ring-1 ring-hairline"
                  }
                >
                  {role}
                </button>
              );
            })}
            <Link
              href="/onboarding/roles"
              className="inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium text-muted hover:text-ink"
            >
              Edit roles
            </Link>
          </div>
        ) : null}

        {demo.profile?.desiredLocations.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {demo.profile.desiredLocations.map((place) => {
              const on = demo.locationTags.includes(place);
              return (
                <button
                  key={place}
                  type="button"
                  onClick={() => toggleLocationTag(place)}
                  className={
                    on
                      ? "inline-flex h-8 items-center rounded-full bg-accent px-3 text-[13px] font-medium text-white"
                      : "inline-flex h-8 items-center rounded-full bg-surface px-3 text-[13px] font-medium text-ink ring-1 ring-hairline"
                  }
                >
                  {place}
                </button>
              );
            })}
            <Link
              href="/onboarding/roles"
              className="inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium text-muted hover:text-ink"
            >
              Edit locations
            </Link>
          </div>
        ) : null}

        <div className="mt-4">
          <DemoBanner>
            {demo.personalized
              ? "Matches are ranked using your role, skills, and preferences."
              : "Add a profile to see why each role may fit you."}
          </DemoBanner>
        </div>

        {demo.personalized ? null : (
          <div className="mt-6 flex flex-col gap-3 rounded-lg bg-surface p-4 ring-1 ring-hairline-soft md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[14px] font-medium text-ink">
                Want more personalized results?
              </p>
              <p className="mt-1 text-[13px] leading-5 text-body">
                Add your experience so we can rank roles that fit you.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl bg-ink px-4 text-[14px] font-medium text-white"
            >
              Create your profile
            </Link>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <label className="text-[13px] text-muted" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={demo.sort}
            onChange={(event) =>
              setSort(event.target.value as typeof demo.sort)
            }
            className="h-10 rounded-md bg-surface px-3 text-[14px] ring-1 ring-hairline outline-none"
          >
            <option value="relevant">Most relevant</option>
            <option value="recent">Most recent</option>
            <option value="salary">Salary</option>
          </select>
        </div>

        {results.length === 0 ? (
          <p className="mt-10 rounded-lg bg-surface px-5 py-10 text-[15px] text-body ring-1 ring-hairline-soft">
            No results for these filters. Reset them or change the role and city.
          </p>
        ) : (
          <ul className="mt-6 grid gap-3">
            {results.map((job) => (
              <li key={job.id}>
                <article className="rounded-lg bg-surface p-5 ring-1 ring-hairline-soft md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[17px] font-medium tracking-[-0.16px] text-ink">
                          {job.title}
                        </h2>
                        {demo.personalized && job.fit ? (
                          <span
                            className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${FIT_CLASS[job.fit]}`}
                          >
                            {FIT_LABEL[job.fit]}
                          </span>
                        ) : (
                          <span className="rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-medium text-ink">
                            {SEARCH_LABEL[job.searchLabel]}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[14px] text-body">
                        {job.company} · {job.location} · {WORK_MODE_LABEL[job.workMode]} ·{" "}
                        {EMPLOYMENT_LABEL[job.employment]} · {LEVEL_LABEL[job.level]}
                      </p>
                      <p className="mt-2 text-[13px] text-muted">
                        {salaryLabel(job)} · {postedLabel(job.postedDaysAgo)} ·{" "}
                        {job.source}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[14px] leading-6 text-body">{job.summary}</p>
                  {demo.personalized && demo.profile ? (
                    <SkillChecks checks={matchChecks(job, demo.profile)} />
                  ) : (
                    <p className="mt-2 text-[13px] text-muted">
                      {job.skills.slice(0, 5).join(" · ")}
                    </p>
                  )}

                  {demo.personalized ? (
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-[12px] font-medium text-ink">
                          Why this job fits you
                        </p>
                        <ul className="mt-2 space-y-1 text-[13px] leading-5 text-body">
                          {job.why.map((item) => (
                            <li key={item}>· {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-ink">
                          Things to consider
                        </p>
                        <ul className="mt-2 space-y-1 text-[13px] leading-5 text-body">
                          {job.consider.map((item) => (
                            <li key={item}>· {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] font-medium text-white"
                    >
                      Details
                    </Link>
                    <button
                      type="button"
                      onClick={() => onSave(job.id)}
                      className="inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-ink ring-1 ring-hairline"
                    >
                      {demo.savedIds.includes(job.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SignupModal
        open={signupOpen || Boolean(demo.pendingSaveId)}
        onDone={() => setSignupOpen(false)}
      />
    </div>
  );
}

function FilterPanel({
  filters,
}: {
  filters: DemoFilters;
}) {
  const demo = useDemo();
  const [roleDraft, setRoleDraft] = useState("");
  const [placeDraft, setPlaceDraft] = useState("");
  const { cities, countries } = catalogLocations();
  const rolePool = uniqueKeep([
    ...(demo.profile?.desiredRoles ?? []),
    ...demo.roleTags,
  ]);
  const placePool = uniqueKeep([
    ...(demo.profile?.desiredLocations ?? []),
    ...demo.locationTags,
    ...cities,
    ...countries,
  ]);

  function patch(partial: Partial<DemoFilters>) {
    setFilters({ ...filters, ...partial });
  }

  return (
    <div className="rounded-lg bg-surface p-4 ring-1 ring-hairline-soft">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[14px] font-medium text-ink">Filter</p>
        <button
          type="button"
          onClick={() => resetFilters()}
          className="text-[12px] text-muted hover:text-ink"
        >
          Reset filters
        </button>
      </div>
      <div className="mt-4 grid gap-4">
        <div>
          <p className="text-[12px] font-medium text-muted">Roles</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rolePool.map((role) => {
              const on = demo.roleTags.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRoleTag(role)}
                  className={filterChip(on)}
                >
                  {role}
                </button>
              );
            })}
          </div>
          <FilterAdd
            value={roleDraft}
            placeholder="Add a role"
            onChange={setRoleDraft}
            onAdd={() => {
              addRoleTag(roleDraft);
              setRoleDraft("");
            }}
          />
        </div>
        <div>
          <p className="text-[12px] font-medium text-muted">Cities & countries</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {placePool.map((place) => {
              const on = demo.locationTags.includes(place);
              return (
                <button
                  key={place}
                  type="button"
                  onClick={() => toggleLocationTag(place)}
                  className={filterChip(on)}
                >
                  {place}
                </button>
              );
            })}
          </div>
          <FilterAdd
            value={placeDraft}
            placeholder="Add a city or country"
            onChange={setPlaceDraft}
            onAdd={() => {
              addLocationTag(placeDraft);
              setPlaceDraft("");
            }}
          />
        </div>
        <fieldset>
          <legend className="text-[12px] font-medium text-muted">Work mode</legend>
          <div className="mt-2 grid gap-1">
            {(["remote", "hybrid", "onsite"] as WorkMode[]).map((mode) => (
              <label key={mode} className="flex items-center gap-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={filters.workModes.includes(mode)}
                  onChange={() =>
                    patch({
                      workModes: toggleIn(filters.workModes, mode),
                    })
                  }
                />
                {WORK_MODE_LABEL[mode]}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[12px] font-medium text-muted">Level</legend>
          <div className="mt-2 grid gap-1">
            {(["junior", "mid", "senior"] as Level[]).map((level) => (
              <label key={level} className="flex items-center gap-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={filters.levels.includes(level)}
                  onChange={() =>
                    patch({ levels: toggleIn(filters.levels, level) })
                  }
                />
                {LEVEL_LABEL[level]}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[12px] font-medium text-muted">Industry</legend>
          <div className="mt-2 grid gap-1">
            {INDUSTRIES.map((industry) => (
              <label
                key={industry}
                className="flex items-center gap-2 text-[13px] text-ink"
              >
                <input
                  type="checkbox"
                  checked={filters.industries.includes(industry)}
                  onChange={() =>
                    patch({
                      industries: toggleIn(filters.industries, industry),
                    })
                  }
                />
                {INDUSTRY_LABEL[industry]}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-1 text-[12px] font-medium text-muted">
          Salary from, in k
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={filters.salaryMin || ""}
            placeholder="e.g. 80"
            onChange={(event) =>
              patch({ salaryMin: Number(event.target.value) || 0 })
            }
            className="h-10 rounded-md bg-canvas px-3 text-[14px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft"
          />
        </label>
        <fieldset>
          <legend className="text-[12px] font-medium text-muted">Employment</legend>
          <div className="mt-2 grid gap-1">
            {(["fulltime", "parttime", "contract"] as Employment[]).map((item) => (
              <label key={item} className="flex items-center gap-2 text-[13px] text-ink">
                <input
                  type="checkbox"
                  checked={filters.employment.includes(item)}
                  onChange={() =>
                    patch({ employment: toggleIn(filters.employment, item) })
                  }
                />
                {EMPLOYMENT_LABEL[item]}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="grid gap-1 text-[12px] font-medium text-muted">
          Date posted
          <select
            value={filters.maxAgeDays}
            onChange={(event) =>
              patch({ maxAgeDays: Number(event.target.value) })
            }
            className="h-10 rounded-md bg-canvas px-3 text-[14px] text-ink ring-1 ring-hairline outline-none"
          >
            <option value={0}>Any time</option>
            <option value={1}>Last 24 hours</option>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function toggleIn<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

function uniqueKeep(values: string[]) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const value of values) {
    const key = value.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    next.push(value);
  }
  return next;
}

function filterChip(on: boolean) {
  return on
    ? "inline-flex h-7 items-center rounded-full bg-accent px-2.5 text-[12px] font-medium text-white"
    : "inline-flex h-7 items-center rounded-full bg-canvas px-2.5 text-[12px] font-medium text-ink ring-1 ring-hairline";
}

function FilterAdd({
  value,
  placeholder,
  onChange,
  onAdd,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}) {
  return (
    <span className="mt-2 flex gap-1.5">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onAdd();
          }
        }}
        placeholder={placeholder}
        className="h-9 min-w-0 flex-1 rounded-md bg-canvas px-2.5 text-[13px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft"
      />
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-9 items-center rounded-md px-2.5 text-[12px] font-medium text-ink ring-1 ring-hairline"
      >
        Add
      </button>
    </span>
  );
}
