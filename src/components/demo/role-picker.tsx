"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  EMPLOYMENT_LABEL,
  INDUSTRY_LABEL,
  LEVEL_LABEL,
  WORK_MODE_LABEL,
  suggestedLocations,
  suggestedRoles,
} from "@/lib/demo/match";
import { INDUSTRIES, type Employment, type Industry, type Level, type WorkMode } from "@/lib/demo/jobs";
import { completeRoleSelection, useDemo } from "@/lib/demo/store";

const WORK_MODES: WorkMode[] = ["hybrid", "remote", "onsite"];
const LEVELS: Level[] = ["junior", "mid", "senior"];
const EMPLOYMENTS: Employment[] = ["fulltime", "parttime", "contract"];

export function RolePicker() {
  const demo = useDemo();
  const suggestions = useMemo(
    () => suggestedRoles(demo.profile),
    [demo.profile],
  );
  const places = useMemo(
    () => suggestedLocations(demo.profile),
    [demo.profile],
  );
  const presetRoles = useMemo(() => {
    const fromProfile = demo.profile?.desiredRoles ?? [];
    const recommended = suggestions
      .filter((item) => item.recommended)
      .map((item) => item.title);
    return fromProfile.length ? fromProfile : recommended.slice(0, 3);
  }, [demo.profile, suggestions]);
  const presetPlaces = useMemo(() => {
    const fromProfile = demo.profile?.desiredLocations ?? [];
    if (fromProfile.length) return fromProfile;
    const recommended = places
      .filter((item) => item.recommended)
      .map((item) => item.label);
    return recommended.length ? recommended : places.slice(0, 2).map((item) => item.label);
  }, [demo.profile, places]);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [customPlace, setCustomPlace] = useState("");
  const [workModes, setWorkModes] = useState<WorkMode[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [employment, setEmployment] = useState<Employment[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [salaryMin, setSalaryMin] = useState(0);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (seeded) return;
    if (!presetRoles.length && !presetPlaces.length) return;
    setSelected(presetRoles);
    setSelectedPlaces(presetPlaces);
    const remote = demo.profile?.remote;
    setWorkModes(
      remote && remote !== "flexible" ? [remote] : demo.filters.workModes,
    );
    setLevels(demo.filters.levels);
    setEmployment(demo.filters.employment);
    setIndustries(demo.filters.industries);
    setSalaryMin(demo.filters.salaryMin || demo.profile?.salaryMin || 0);
    setSeeded(true);
  }, [demo.filters, demo.profile, presetPlaces, presetRoles, seeded]);

  function toggle(title: string) {
    setSelected((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  function togglePlace(label: string) {
    setSelectedPlaces((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
  }

  function addCustom() {
    const next = custom.trim();
    if (!next) return;
    setSelected((current) =>
      current.some((item) => item.toLowerCase() === next.toLowerCase())
        ? current
        : [...current, next],
    );
    setCustom("");
  }

  function addCustomPlace() {
    const next = customPlace.trim();
    if (!next) return;
    setSelectedPlaces((current) =>
      current.some((item) => item.toLowerCase() === next.toLowerCase())
        ? current
        : [...current, next],
    );
    setCustomPlace("");
  }

  function finish() {
    window.location.assign(
      completeRoleSelection(selected, selectedPlaces, {
        workModes,
        levels,
        employment,
        industries,
        salaryMin,
      }),
    );
  }

  const extraRoles = selected.filter(
    (role) => !suggestions.some((item) => item.title.toLowerCase() === role.toLowerCase()),
  );
  const extraPlaces = selectedPlaces.filter(
    (place) => !places.some((item) => item.label.toLowerCase() === place.toLowerCase()),
  );

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Job preferences
      </p>
      <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
        What are you looking for?
      </h1>
      <p className="mt-3 max-w-[54ch] text-[16px] leading-7 text-body">
        We ranked these from your profile. Turn on the ones you want, or type a
        role that is not in the list.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {suggestions.map((item, index) => {
          const on = selected.some(
            (role) => role.toLowerCase() === item.title.toLowerCase(),
          );
          return (
            <button
              key={`role-${item.title}-${index}`}
              type="button"
              onClick={() => toggle(item.title)}
              className={chipClass(on)}
            >
              <span className="text-[14px] font-medium">{item.title}</span>
              <span className={on ? "text-[12px] text-white/80" : "text-[12px] text-muted"}>
                {item.recommended ? "Best match · " : ""}
                {item.reason}
              </span>
            </button>
          );
        })}
        {extraRoles.map((role) => (
          <button
            key={`extra-role-${role}`}
            type="button"
            onClick={() => toggle(role)}
            className={chipClass(true)}
          >
            <span className="text-[14px] font-medium">{role}</span>
            <span className="text-[12px] text-white/80">Added by you</span>
          </button>
        ))}
      </div>

      <label className="mt-8 grid gap-1.5 text-[13px] font-medium text-ink">
        Role not listed?
        <AddRow
          value={custom}
          placeholder="Type the role you want"
          onChange={setCustom}
          onAdd={addCustom}
        />
      </label>

      <h2 className="font-display mt-12 text-[24px] font-semibold tracking-[-0.24px] text-ink">
        Where do you want to work?
      </h2>
      <p className="mt-2 max-w-[54ch] text-[15px] leading-6 text-body">
        Pick cities and countries. Add a place if it is not shown.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {places.map((item, index) => {
          const on = selectedPlaces.some(
            (place) => place.toLowerCase() === item.label.toLowerCase(),
          );
          return (
            <button
              key={`place-${item.label}-${index}`}
              type="button"
              onClick={() => togglePlace(item.label)}
              className={chipClass(on)}
            >
              <span className="text-[14px] font-medium">{item.label}</span>
              <span className={on ? "text-[12px] text-white/80" : "text-[12px] text-muted"}>
                {item.kind === "country" ? "Country · " : item.kind === "remote" ? "Remote · " : "City · "}
                {item.reason}
              </span>
            </button>
          );
        })}
        {extraPlaces.map((place) => (
          <button
            key={`extra-place-${place}`}
            type="button"
            onClick={() => togglePlace(place)}
            className={chipClass(true)}
          >
            <span className="text-[14px] font-medium">{place}</span>
            <span className="text-[12px] text-white/80">Added by you</span>
          </button>
        ))}
      </div>

      <label className="mt-8 grid gap-1.5 text-[13px] font-medium text-ink">
        City or country not listed?
        <AddRow
          value={customPlace}
          placeholder="Type a city or country"
          onChange={setCustomPlace}
          onAdd={addCustomPlace}
        />
      </label>

      <PrefSection title="Work mode" hint="Leave empty for any.">
        {WORK_MODES.map((mode) => (
          <CompactChip
            key={mode}
            label={WORK_MODE_LABEL[mode]}
            on={workModes.includes(mode)}
            onClick={() => setWorkModes((current) => toggleIn(current, mode))}
          />
        ))}
      </PrefSection>

      <PrefSection title="Level" hint="Junior through senior. Leave empty for any.">
        {LEVELS.map((level) => (
          <CompactChip
            key={level}
            label={LEVEL_LABEL[level]}
            on={levels.includes(level)}
            onClick={() => setLevels((current) => toggleIn(current, level))}
          />
        ))}
      </PrefSection>

      <PrefSection title="Employment" hint="Leave empty for any.">
        {EMPLOYMENTS.map((item) => (
          <CompactChip
            key={item}
            label={EMPLOYMENT_LABEL[item]}
            on={employment.includes(item)}
            onClick={() => setEmployment((current) => toggleIn(current, item))}
          />
        ))}
      </PrefSection>

      <label className="mt-10 grid gap-1.5 text-[13px] font-medium text-ink">
        Salary from, in k
        <input
          type="number"
          min={0}
          inputMode="numeric"
          value={salaryMin || ""}
          placeholder="e.g. 80"
          onChange={(event) => setSalaryMin(Number(event.target.value) || 0)}
          className="h-12 max-w-[220px] rounded-xl bg-surface px-3.5 text-[14px] font-normal text-ink ring-1 ring-hairline outline-none focus:ring-2 focus:ring-accent"
        />
      </label>

      <PrefSection title="Industry" hint="Leave empty for any.">
        {INDUSTRIES.map((industry) => (
          <CompactChip
            key={industry}
            label={INDUSTRY_LABEL[industry]}
            on={industries.includes(industry)}
            onClick={() => setIndustries((current) => toggleIn(current, industry))}
          />
        ))}
      </PrefSection>

      <button
        type="button"
        onClick={finish}
        className="mt-8 inline-flex h-12 items-center rounded-xl bg-accent px-5 text-[15px] font-medium text-white transition hover:bg-accent-hover"
      >
        See matching jobs
      </button>
    </div>
  );
}

function chipClass(on: boolean) {
  return on
    ? "inline-flex flex-col items-start rounded-2xl bg-accent px-3.5 py-2.5 text-left text-white"
    : "inline-flex flex-col items-start rounded-2xl bg-surface px-3.5 py-2.5 text-left text-ink ring-1 ring-hairline";
}

function PrefSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-[16px] font-semibold tracking-[-0.16px] text-ink">{title}</h2>
      <p className="mt-1 text-[13px] text-body">{hint}</p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function CompactChip({
  label,
  on,
  onClick,
}: {
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        on
          ? "inline-flex h-9 items-center rounded-full bg-accent px-3.5 text-[13px] font-medium text-white"
          : "inline-flex h-9 items-center rounded-full bg-surface px-3.5 text-[13px] font-medium text-ink ring-1 ring-hairline"
      }
    >
      {label}
    </button>
  );
}

function toggleIn<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}

function AddRow({
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
    <span className="flex gap-2">
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
        className="h-12 flex-1 rounded-xl bg-surface px-3.5 text-[14px] font-normal text-ink ring-1 ring-hairline outline-none focus:ring-2 focus:ring-accent"
      />
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex h-12 items-center rounded-xl px-4 text-[14px] font-medium text-ink ring-1 ring-hairline"
      >
        Add
      </button>
    </span>
  );
}
