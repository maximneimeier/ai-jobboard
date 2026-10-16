"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  EMPLOYMENT_LABEL,
  LEVEL_LABEL,
  WORK_MODE_LABEL,
  analyzeMatch,
  postedLabel,
  salaryLabel,
  type RankedDemoJob,
} from "@/lib/demo/match";
import { toggleSave, type CareerProfile } from "@/lib/demo/store";
import { MatchBadge } from "./match-badge";
import { companyInitials } from "./job-result-card";
import { PreparePanel } from "./prepare-panel";
import { SkillChip } from "./skill-checks";

export function JobMatchPanel({
  job,
  profile,
  personalized,
  saved,
  onClose,
  onSave,
}: {
  job: RankedDemoJob;
  profile: CareerProfile | null;
  personalized: boolean;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [sourceOpen, setSourceOpen] = useState(false);
  const [prepareOpen, setPrepareOpen] = useState(false);
  const analysis = analyzeMatch(job, profile);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[55]">
      <button
        type="button"
        aria-label="Close match details"
        className="absolute inset-0 bg-ink/30"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-panel-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col bg-surface shadow-[0_16px_60px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-hairline-soft px-5 py-4">
          <div className="flex min-w-0 gap-3">
            <div
              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-[12px] font-semibold text-accent"
              aria-hidden
            >
              {companyInitials(job.company)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  id="match-panel-title"
                  className="text-[17px] font-medium tracking-[-0.16px] text-ink"
                >
                  {job.title}
                </h2>
                <MatchBadge
                  fit={job.fit}
                  searchLabel={job.searchLabel}
                  personalized={personalized}
                />
              </div>
              <p className="mt-1 text-[13px] text-body">
                {job.company} · {job.location} · {WORK_MODE_LABEL[job.workMode]} ·{" "}
                {EMPLOYMENT_LABEL[job.employment]}
              </p>
              <p className="mt-0.5 text-[12px] text-muted">
                {LEVEL_LABEL[job.level]} · {salaryLabel(job)} · {postedLabel(job.postedDaysAgo)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted hover:text-ink"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] font-medium text-ink ring-1 ring-hairline"
            >
              {saved ? "Saved" : "Save job"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!saved) toggleSave(job.id);
                setPrepareOpen(true);
              }}
              className="inline-flex h-9 items-center rounded-lg bg-ink px-3 text-[13px] font-medium text-white"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setSourceOpen(true)}
              className="inline-flex h-9 items-center rounded-lg px-3 text-[13px] text-muted hover:text-ink"
            >
              Original posting
            </button>
          </div>

          <Section title="Why this job">
            <p className="text-[14px] leading-6 text-body">{analysis.summary}</p>
          </Section>

          {personalized ? (
            <>
              <Section title="Skills match">
                {analysis.confirmedSkills.length ? (
                  <Group label="Confirmed on your profile">
                    {analysis.confirmedSkills.map((label) => (
                      <SkillChip
                        key={label}
                        check={{ label, status: "confirmed", kind: "skill" }}
                      />
                    ))}
                  </Group>
                ) : (
                  <p className="text-[13px] text-muted">
                    No listed skills are confirmed on your profile yet.
                  </p>
                )}
                {analysis.unverifiedSkills.length ? (
                  <Group label="Not yet on your profile">
                    {analysis.unverifiedSkills.map((label) => (
                      <SkillChip
                        key={label}
                        check={{ label, status: "unverified", kind: "skill" }}
                      />
                    ))}
                  </Group>
                ) : null}
                {analysis.confirmedLanguages.length || analysis.unverifiedLanguages.length ? (
                  <Group label="Languages on the posting">
                    {analysis.confirmedLanguages.map((label) => (
                      <SkillChip
                        key={label}
                        check={{ label, status: "confirmed", kind: "language" }}
                      />
                    ))}
                    {analysis.unverifiedLanguages.map((label) => (
                      <SkillChip
                        key={label}
                        check={{ label, status: "unverified", kind: "language" }}
                      />
                    ))}
                  </Group>
                ) : null}
              </Section>

              <Section title="Requirements">
                <ul className="grid gap-2">
                  {analysis.requirements.map((item) => (
                    <li key={item.label} className="text-[13px] leading-5 text-body">
                      <span
                        className={
                          item.state === "fulfilled"
                            ? "mr-2 text-[11px] font-medium text-success-text"
                            : item.state === "clarify"
                              ? "mr-2 text-[11px] font-medium text-warning-text"
                              : "mr-2 text-[11px] font-medium text-muted"
                        }
                      >
                        {item.state === "fulfilled"
                          ? "Fulfilled"
                          : item.state === "clarify"
                            ? "Needs confirmation"
                            : "Listed"}
                      </span>
                      {item.label}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Career alignment">
                <p className="text-[14px] leading-6 text-body">{analysis.career}</p>
              </Section>

              <Section title="Potential challenges">
                <ul className="grid gap-1.5 text-[14px] leading-6 text-body">
                  {analysis.challenges.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </Section>

              <Section title="Recommended next steps">
                <ul className="grid gap-1.5 text-[14px] leading-6 text-body">
                  {analysis.nextSteps.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </Section>
            </>
          ) : (
            <Section title="About this role">
              <p className="text-[14px] leading-6 text-body">{job.description}</p>
              <p className="mt-3 text-[13px] text-muted">
                Add a profile to see a structured match analysis for this listing.
              </p>
            </Section>
          )}

          <Section title="The role">
            <p className="text-[14px] leading-6 text-body">{job.description}</p>
            {job.responsibilities.length ? (
              <ul className="mt-3 grid gap-1 text-[13px] leading-6 text-body">
                {job.responsibilities.slice(0, 4).map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            ) : null}
          </Section>
        </div>
      </aside>

      {sourceOpen ? (
        <div className="fixed inset-0 z-[65] flex items-center justify-center bg-ink/40 p-4">
          <div className="max-w-md rounded-lg bg-surface p-6 ring-1 ring-hairline">
            <h3 className="text-[16px] font-medium text-ink">Original posting</h3>
            <p className="mt-3 text-[14px] leading-6 text-body">
              Continue to the {job.company} careers page to view the original posting
              and apply.
            </p>
            <button
              type="button"
              onClick={() => setSourceOpen(false)}
              className="mt-5 inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] text-white"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}

      {prepareOpen ? (
        <PreparePanel
          jobTitle={job.title}
          jobId={job.id}
          onClose={() => setPrepareOpen(false)}
        />
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h3 className="text-[13px] font-medium text-ink">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <p className="text-[12px] text-muted">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
