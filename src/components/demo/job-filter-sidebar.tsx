"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  EMPLOYMENT_LABEL,
  FIT_LABEL,
  FIT_OPTIONS,
  INDUSTRY_LABEL,
  LEVEL_LABEL,
  WORK_MODE_LABEL,
} from "@/lib/demo/match";
import { INDUSTRIES, type Employment, type Level, type WorkMode } from "@/lib/demo/jobs";
import {
  addLocationTag,
  addRoleTag,
  resetFilters,
  setFilters,
  toggleLocationTag,
  toggleRoleTag,
  useDemo,
  type DemoFilters,
} from "@/lib/demo/store";

export function JobFilterSidebar({
  filters,
  resultCount,
  mobileOpen,
  onCloseMobile,
  personalized,
}: {
  filters: DemoFilters;
  resultCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  personalized: boolean;
}) {
  const body = (
    <FilterBody
      filters={filters}
      resultCount={resultCount}
      onCloseMobile={onCloseMobile}
      personalized={personalized}
    />
  );

  return (
    <>
      <div className="hidden md:block md:w-[260px] md:shrink-0">{body}</div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-ink/30"
            onClick={onCloseMobile}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-title"
            className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-surface shadow-[0_16px_60px_rgba(0,0,0,0.12)]"
          >
            <div className="min-h-0 flex-1 overflow-y-auto p-4">{body}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FilterBody({
  filters,
  resultCount,
  onCloseMobile,
  personalized,
}: {
  filters: DemoFilters;
  resultCount: number;
  onCloseMobile: () => void;
  personalized: boolean;
}) {
  const demo = useDemo();
  const [advanced, setAdvanced] = useState(
    Boolean(
      filters.levels.length ||
        filters.industries.length ||
        filters.employment.length ||
        filters.maxAgeDays,
    ),
  );
  const [roleDraft, setRoleDraft] = useState("");
  const [placeDraft, setPlaceDraft] = useState("");
  const rolePool = uniqueKeep([...(demo.profile?.desiredRoles ?? []), ...demo.roleTags]);
  const placePool = uniqueKeep([
    ...(demo.profile?.desiredLocations ?? []),
    ...demo.locationTags,
  ]);
  const profileRoles = new Set((demo.profile?.desiredRoles ?? []).map((item) => item.toLowerCase()));
  const profilePlaces = new Set(
    (demo.profile?.desiredLocations ?? []).map((item) => item.toLowerCase()),
  );

  function patch(partial: Partial<DemoFilters>) {
    setFilters({ ...filters, ...partial });
  }

  return (
    <div className="rounded-xl bg-surface p-4 ring-1 ring-hairline-soft">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p id="filter-title" className="text-[14px] font-medium text-ink">
            Filters
          </p>
          <p className="mt-0.5 text-[12px] text-muted">
            {resultCount} {resultCount === 1 ? "job" : "jobs"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => resetFilters()}
            className="text-[12px] text-muted hover:text-ink"
          >
            Reset filters
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted md:hidden"
            aria-label="Close filters"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-5">
        <div>
          <p className="text-[12px] font-medium text-muted">Job role</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rolePool.map((role) => {
              const on = demo.roleTags.includes(role);
              const fromProfile = profileRoles.has(role.toLowerCase());
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRoleTag(role)}
                  title={fromProfile ? "From your profile" : "Added in search"}
                  className={filterChip(on)}
                >
                  {role}
                  {fromProfile ? (
                    <span className="ml-1 text-[10px] opacity-70">Profile</span>
                  ) : null}
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
          <p className="text-[12px] font-medium text-muted">Location</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {placePool.map((place) => {
              const on = demo.locationTags.includes(place);
              const fromProfile = profilePlaces.has(place.toLowerCase());
              return (
                <button
                  key={place}
                  type="button"
                  onClick={() => toggleLocationTag(place)}
                  title={fromProfile ? "From your profile" : "Added in search"}
                  className={filterChip(on)}
                >
                  {place}
                  {fromProfile ? (
                    <span className="ml-1 text-[10px] opacity-70">Profile</span>
                  ) : null}
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
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(["remote", "hybrid", "onsite"] as WorkMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => patch({ workModes: toggleIn(filters.workModes, mode) })}
                className={filterChip(filters.workModes.includes(mode))}
              >
                {WORK_MODE_LABEL[mode]}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="grid gap-1 text-[12px] font-medium text-muted">
          Minimum salary, in k
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={filters.salaryMin || ""}
            placeholder="e.g. 80"
            onChange={(event) => patch({ salaryMin: Number(event.target.value) || 0 })}
            className="h-10 rounded-md bg-canvas px-3 text-[14px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>

        {personalized ? (
          <fieldset>
            <legend className="text-[12px] font-medium text-muted">Match category</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {FIT_OPTIONS.map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => patch({ fits: toggleIn(filters.fits, fit) })}
                  className={filterChip(filters.fits.includes(fit))}
                >
                  {FIT_LABEL[fit]}
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div>
          <button
            type="button"
            onClick={() => setAdvanced((value) => !value)}
            className="text-[13px] font-medium text-ink"
            aria-expanded={advanced}
          >
            {advanced ? "Hide advanced filters" : "Advanced filters"}
          </button>
          {advanced ? (
            <div className="mt-4 grid gap-4">
              <fieldset>
                <legend className="text-[12px] font-medium text-muted">Seniority</legend>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(["junior", "mid", "senior"] as Level[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => patch({ levels: toggleIn(filters.levels, level) })}
                      className={filterChip(filters.levels.includes(level))}
                    >
                      {LEVEL_LABEL[level]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-[12px] font-medium text-muted">Industry</legend>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {INDUSTRIES.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() =>
                        patch({ industries: toggleIn(filters.industries, industry) })
                      }
                      className={filterChip(filters.industries.includes(industry))}
                    >
                      {INDUSTRY_LABEL[industry]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-[12px] font-medium text-muted">Employment type</legend>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(["fulltime", "parttime", "contract"] as Employment[]).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        patch({ employment: toggleIn(filters.employment, item) })
                      }
                      className={filterChip(filters.employment.includes(item))}
                    >
                      {EMPLOYMENT_LABEL[item]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="grid gap-1 text-[12px] font-medium text-muted">
                Date posted
                <select
                  value={filters.maxAgeDays}
                  onChange={(event) => patch({ maxAgeDays: Number(event.target.value) })}
                  className="h-10 rounded-md bg-canvas px-3 text-[14px] text-ink ring-1 ring-hairline outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <option value={0}>Any time</option>
                  <option value={1}>Last 24 hours</option>
                  <option value={7}>Last 7 days</option>
                  <option value={14}>Last 14 days</option>
                  <option value={30}>Last 30 days</option>
                </select>
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ActiveFilterChips() {
  const demo = useDemo();
  const chips: { key: string; label: string; onClear: () => void }[] = [];
  for (const role of demo.roleTags) {
    chips.push({
      key: `role-${role}`,
      label: role,
      onClear: () => toggleRoleTag(role),
    });
  }
  for (const place of demo.locationTags) {
    chips.push({
      key: `place-${place}`,
      label: place,
      onClear: () => toggleLocationTag(place),
    });
  }
  for (const mode of demo.filters.workModes) {
    chips.push({
      key: `mode-${mode}`,
      label: WORK_MODE_LABEL[mode],
      onClear: () =>
        setFilters({
          ...demo.filters,
          workModes: demo.filters.workModes.filter((item) => item !== mode),
        }),
    });
  }
  if (demo.filters.salaryMin) {
    chips.push({
      key: "salary",
      label: `From ${demo.filters.salaryMin}k`,
      onClear: () => setFilters({ ...demo.filters, salaryMin: 0 }),
    });
  }
  for (const fit of demo.filters.fits) {
    chips.push({
      key: `fit-${fit}`,
      label: FIT_LABEL[fit],
      onClear: () =>
        setFilters({
          ...demo.filters,
          fits: demo.filters.fits.filter((item) => item !== fit),
        }),
    });
  }
  for (const level of demo.filters.levels) {
    chips.push({
      key: `level-${level}`,
      label: LEVEL_LABEL[level],
      onClear: () =>
        setFilters({
          ...demo.filters,
          levels: demo.filters.levels.filter((item) => item !== level),
        }),
    });
  }
  for (const industry of demo.filters.industries) {
    chips.push({
      key: `ind-${industry}`,
      label: INDUSTRY_LABEL[industry],
      onClear: () =>
        setFilters({
          ...demo.filters,
          industries: demo.filters.industries.filter((item) => item !== industry),
        }),
    });
  }
  for (const item of demo.filters.employment) {
    chips.push({
      key: `emp-${item}`,
      label: EMPLOYMENT_LABEL[item],
      onClear: () =>
        setFilters({
          ...demo.filters,
          employment: demo.filters.employment.filter((value) => value !== item),
        }),
    });
  }
  if (demo.filters.maxAgeDays) {
    chips.push({
      key: "age",
      label: `Posted within ${demo.filters.maxAgeDays}d`,
      onClear: () => setFilters({ ...demo.filters, maxAgeDays: 0 }),
    });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onClear}
          className="inline-flex h-7 items-center gap-1 rounded-full bg-canvas px-2.5 text-[12px] text-ink ring-1 ring-hairline hover:bg-surface"
        >
          {chip.label}
          <X size={12} aria-hidden />
          <span className="sr-only">Remove {chip.label}</span>
        </button>
      ))}
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
        className="h-9 min-w-0 flex-1 rounded-md bg-canvas px-2.5 text-[13px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft focus-visible:ring-2 focus-visible:ring-accent"
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
