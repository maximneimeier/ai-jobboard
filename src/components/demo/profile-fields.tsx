"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  emptyEducation,
  emptyExperience,
  syncProfile,
  type CareerProfile,
  type EducationEntry,
  type WorkExperience,
} from "@/lib/demo/store";
import type { WorkMode } from "@/lib/demo/jobs";

export function ProfileFields({
  profile,
  onChange,
}: {
  profile: CareerProfile;
  onChange: (next: CareerProfile) => void;
}) {
  function set<K extends keyof CareerProfile>(key: K, value: CareerProfile[K]) {
    onChange(syncProfile({ ...profile, [key]: value }));
  }

  function updateExperience(id: string, patch: Partial<WorkExperience>) {
    set(
      "experience",
      profile.experience.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function updateEducation(id: string, patch: Partial<EducationEntry>) {
    set(
      "educationHistory",
      profile.educationHistory.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    );
  }

  return (
    <div className="grid gap-8">
      <Section
        title="Personal details"
        description="A short headline and where you want to work."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" className="sm:col-span-2">
            <input
              value={profile.fullName}
              onChange={(event) => set("fullName", event.target.value)}
              placeholder="Your name"
              className={inputClass}
            />
          </Field>
          <Field label="Professional title">
            <input
              value={profile.headline}
              onChange={(event) => set("headline", event.target.value)}
              placeholder="Software Engineer"
              className={inputClass}
            />
          </Field>
          <Field label="Location">
            <input
              value={profile.location}
              onChange={(event) => set("location", event.target.value)}
              placeholder="Berlin, Germany"
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Work experience"
        description="Where you worked, when, and what you did."
        actionLabel="Add experience"
        onAction={() => set("experience", [emptyExperience(), ...profile.experience])}
      >
        {profile.experience.length === 0 ? (
          <EmptyState text="Add roles from your career, starting with the most recent." />
        ) : (
          <div className="grid gap-4">
            {profile.experience.map((job, index) => (
              <article
                key={job.id}
                className="rounded-2xl bg-canvas p-4 ring-1 ring-hairline sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13px] font-medium text-muted">
                    Role {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "experience",
                        profile.experience.filter((item) => item.id !== job.id),
                      )
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-ink"
                    aria-label="Remove experience"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <Field label="Job title">
                    <input
                      value={job.title}
                      onChange={(event) =>
                        updateExperience(job.id, { title: event.target.value })
                      }
                      placeholder="Investment Analyst"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      value={job.company}
                      onChange={(event) =>
                        updateExperience(job.id, { company: event.target.value })
                      }
                      placeholder="Northbridge Capital"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Location" className="sm:col-span-2">
                    <input
                      value={job.location}
                      onChange={(event) =>
                        updateExperience(job.id, { location: event.target.value })
                      }
                      placeholder="Munich, Germany"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Start">
                    <input
                      type="month"
                      value={job.start}
                      onChange={(event) =>
                        updateExperience(job.id, { start: event.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>
                  <Field label="End">
                    <input
                      type="month"
                      value={job.current ? "" : job.end}
                      disabled={job.current}
                      onChange={(event) =>
                        updateExperience(job.id, { end: event.target.value })
                      }
                      className={`${inputClass} disabled:opacity-50`}
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-ink sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={job.current}
                      onChange={(event) =>
                        updateExperience(job.id, {
                          current: event.target.checked,
                          end: event.target.checked ? "" : job.end,
                        })
                      }
                      className="size-4 rounded border-hairline accent-accent"
                    />
                    I currently work here
                  </label>
                  <Field label="What you did" className="sm:col-span-2">
                    <textarea
                      value={job.description}
                      onChange={(event) =>
                        updateExperience(job.id, { description: event.target.value })
                      }
                      rows={4}
                      placeholder="Describe your responsibilities, projects, and results."
                      className={`${inputClass} h-auto py-2.5`}
                    />
                  </Field>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Education"
        description="Degrees, schools, and when you studied."
        actionLabel="Add education"
        onAction={() =>
          set("educationHistory", [emptyEducation(), ...profile.educationHistory])
        }
      >
        {profile.educationHistory.length === 0 ? (
          <EmptyState text="Add your degrees and certifications." />
        ) : (
          <div className="grid gap-4">
            {profile.educationHistory.map((entry, index) => (
              <article
                key={entry.id}
                className="rounded-2xl bg-canvas p-4 ring-1 ring-hairline sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[13px] font-medium text-muted">
                    Education {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      set(
                        "educationHistory",
                        profile.educationHistory.filter((item) => item.id !== entry.id),
                      )
                    }
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-ink"
                    aria-label="Remove education"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <Field label="School" className="sm:col-span-2">
                    <input
                      value={entry.school}
                      onChange={(event) =>
                        updateEducation(entry.id, { school: event.target.value })
                      }
                      placeholder="Technical University of Berlin"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Degree">
                    <input
                      value={entry.degree}
                      onChange={(event) =>
                        updateEducation(entry.id, { degree: event.target.value })
                      }
                      placeholder="BSc"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Field of study">
                    <input
                      value={entry.field}
                      onChange={(event) =>
                        updateEducation(entry.id, { field: event.target.value })
                      }
                      placeholder="Computer Science"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Start year">
                    <input
                      inputMode="numeric"
                      value={entry.start}
                      onChange={(event) =>
                        updateEducation(entry.id, { start: event.target.value })
                      }
                      placeholder="2018"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="End year">
                    <input
                      inputMode="numeric"
                      value={entry.current ? "" : entry.end}
                      disabled={entry.current}
                      onChange={(event) =>
                        updateEducation(entry.id, { end: event.target.value })
                      }
                      placeholder="2022"
                      className={`${inputClass} disabled:opacity-50`}
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-[13px] font-medium text-ink sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={entry.current}
                      onChange={(event) =>
                        updateEducation(entry.id, {
                          current: event.target.checked,
                          end: event.target.checked ? "" : entry.end,
                        })
                      }
                      className="size-4 rounded border-hairline accent-accent"
                    />
                    I currently study here
                  </label>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Skills"
        description="Tools and methods you use in your work."
      >
        <ChipEditor
          values={profile.skills}
          placeholder="Add a skill, then press Enter"
          onChange={(skills) => set("skills", skills)}
        />
      </Section>

      <Section
        title="Languages"
        description="Spoken languages. We match these against posting requirements."
      >
        <ChipEditor
          values={profile.languages}
          placeholder="Add a language, then press Enter"
          onChange={(languages) => set("languages", languages)}
        />
      </Section>

      <Section
        title="Abilities"
        description="Strengths that are harder to list as tools — communication, modeling, leadership."
      >
        <ChipEditor
          values={profile.abilities}
          placeholder="Add an ability, then press Enter"
          onChange={(abilities) => set("abilities", abilities)}
        />
      </Section>

      <Section
        title="Additional notes"
        description="Anything else a recruiter or matching should know."
      >
        <textarea
          value={profile.notes}
          onChange={(event) => set("notes", event.target.value)}
          rows={5}
          placeholder="Visa status, side projects, industries you want, or anything you would put at the bottom of a resume."
          className={`${inputClass} h-auto py-2.5`}
        />
      </Section>

      <Section
        title="Job preferences"
        description="Used to rank roles. You can change these without rewriting your resume."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-[13px] font-medium text-ink">Desired roles</p>
            <ChipEditor
              values={profile.desiredRoles}
              placeholder="Add a role, then press Enter"
              onChange={(desiredRoles) => set("desiredRoles", desiredRoles)}
            />
          </div>
          <Field label="Work mode">
            <select
              value={profile.remote}
              onChange={(event) =>
                set("remote", event.target.value as WorkMode | "flexible")
              }
              className={inputClass}
            >
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="flexible">Flexible</option>
            </select>
          </Field>
          <Field label="Salary expectation from, in k">
            <input
              type="number"
              min={0}
              value={profile.salaryMin}
              onChange={(event) => set("salaryMin", Number(event.target.value) || 0)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.16px] text-ink">
            {title}
          </h2>
          <p className="mt-1 text-[13px] leading-5 text-body">{description}</p>
        </div>
        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-[13px] font-medium text-accent transition hover:bg-accent-soft"
          >
            <Plus size={14} />
            {actionLabel}
          </button>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`grid gap-1.5 text-[13px] font-medium text-ink ${className ?? ""}`}>
      {label}
      {children}
    </label>
  );
}

function ChipEditor({
  values,
  placeholder,
  onChange,
}: {
  values: string[];
  placeholder: string;
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add(raw: string) {
    const next = raw
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => !values.some((value) => value.toLowerCase() === item.toLowerCase()));
    if (!next.length) return;
    onChange([...values, ...next]);
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      add(draft);
    }
    if (event.key === "Backspace" && !draft && values.length) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <div>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl bg-canvas px-2 py-1.5 ring-1 ring-hairline focus-within:ring-2 focus-within:ring-accent">
        {values.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-lg bg-surface px-2 py-1 text-[13px] font-medium text-ink ring-1 ring-hairline"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(values.filter((value) => value !== item))}
              className="text-muted hover:text-ink"
              aria-label={`Remove ${item}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => add(draft)}
          placeholder={values.length ? "" : placeholder}
          className="min-w-[160px] flex-1 bg-transparent px-1.5 py-1.5 text-[14px] font-normal text-ink outline-none placeholder:text-muted-soft"
        />
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-2xl bg-canvas px-4 py-6 text-center text-[14px] text-body ring-1 ring-hairline">
      {text}
    </p>
  );
}

const inputClass =
  "h-11 w-full rounded-xl bg-canvas px-3.5 text-[14px] font-normal text-ink ring-1 ring-hairline outline-none focus:ring-2 focus:ring-accent";
