"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoJobById } from "@/lib/demo/jobs";
import {
  EMPLOYMENT_LABEL,
  FIT_CLASS,
  FIT_LABEL,
  LEVEL_LABEL,
  SEARCH_LABEL,
  WORK_MODE_LABEL,
  matchChecks,
  postedLabel,
  rankDemoJobs,
  salaryLabel,
} from "@/lib/demo/match";
import {
  toggleSave,
  upsertApplication,
  useDemo,
} from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";
import { SignupModal } from "./signup-modal";
import { SkillChecks } from "./skill-checks";

export function JobArticle({ jobId }: { jobId: string }) {
  const demo = useDemo();
  const [signupOpen, setSignupOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [prepareOpen, setPrepareOpen] = useState(false);
  const job = demoJobById(jobId);
  const ranked = useMemo(() => {
    if (!job) return null;
    return (
      rankDemoJobs(
        demo.query,
        demo.location,
        demo.filters,
        demo.sort,
        demo.profile,
        demo.personalized,
        demo.roleTags,
        demo.locationTags,
      ).find((item) => item.id === job.id) ?? {
        ...job,
        score: 0,
        searchLabel: "similar" as const,
        why: ["Similar role to your current search."],
        consider: ["Open the full posting to confirm the details."],
      }
    );
  }, [job, demo]);

  if (!job || !ranked) {
    return (
      <div className="mx-auto max-w-[800px] px-5 py-16">
        <p className="text-[15px] text-body">This job is no longer available.</p>
        <Link href="/jobs" className="mt-4 inline-flex text-[14px] text-ink underline">
          Back to results
        </Link>
      </div>
    );
  }

  const listing = job;

  function save() {
    const result = toggleSave(listing.id);
    if (result.needsSignup) setSignupOpen(true);
  }

  function prepare() {
    if (!demo.savedIds.includes(listing.id)) toggleSave(listing.id);
    upsertApplication(listing.id, { status: "preparing" });
    setPrepareOpen(true);
  }

  return (
    <article className="mx-auto w-full max-w-[800px] px-5 py-12 md:px-8">
      <Link href="/jobs" className="text-[13px] text-muted hover:text-ink">
        ← Results
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {demo.personalized && ranked.fit ? (
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${FIT_CLASS[ranked.fit]}`}>
            {FIT_LABEL[ranked.fit]}
          </span>
        ) : (
          <span className="rounded-md bg-surface-soft px-2 py-0.5 text-[11px] font-medium">
            {SEARCH_LABEL[ranked.searchLabel]}
          </span>
        )}
        <span className="text-[12px] text-muted">{job.source}</span>
      </div>
      <h1 className="font-display mt-3 text-[36px] leading-[1.1] font-semibold tracking-[-0.04em] text-ink">
        {job.title}
      </h1>
      <p className="mt-3 text-[16px] text-body">
        {job.company} · {job.location} · {WORK_MODE_LABEL[job.workMode]} ·{" "}
        {EMPLOYMENT_LABEL[job.employment]} · {LEVEL_LABEL[job.level]}
      </p>
      <p className="mt-2 text-[14px] text-muted">
        {salaryLabel(job)} · {postedLabel(job.postedDaysAgo)}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          className="inline-flex h-11 items-center rounded-md bg-ink px-4 text-[14px] font-medium text-white"
        >
          {demo.savedIds.includes(job.id) ? "Saved" : "Save job"}
        </button>
        <button
          type="button"
          onClick={prepare}
          className="inline-flex h-11 items-center rounded-md px-4 text-[14px] font-medium text-ink ring-1 ring-hairline"
        >
          Prepare application
        </button>
        <button
          type="button"
          onClick={() => setSourceOpen(true)}
          className="inline-flex h-11 items-center rounded-md px-4 text-[14px] text-muted"
        >
          View original posting
        </button>
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-[15px] font-medium text-ink">About the company</h2>
          <p className="mt-2 text-[15px] leading-7 text-body">{job.aboutCompany}</p>
        </section>
        <section>
          <h2 className="text-[15px] font-medium text-ink">The role</h2>
          <p className="mt-2 text-[15px] leading-7 text-body">{job.description}</p>
        </section>
        <section>
          <h2 className="text-[15px] font-medium text-ink">Responsibilities</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-7 text-body">
            {job.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-[15px] font-medium text-ink">Requirements</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-7 text-body">
            {job.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-[15px] font-medium text-ink">Skills</h2>
          {demo.personalized && demo.profile ? (
            <SkillChecks checks={matchChecks(job, demo.profile)} />
          ) : (
            <p className="mt-2 text-[15px] text-body">{job.skills.join(" · ")}</p>
          )}
        </section>
        {demo.personalized ? (
          <section className="rounded-lg bg-surface p-5 ring-1 ring-hairline-soft">
            <h2 className="text-[15px] font-medium text-ink">Fit with your profile</h2>
            <div className="mt-3">
              <DemoBanner>
                Based on your profile, experience, and stated preferences.
              </DemoBanner>
            </div>
            <p className="mt-4 text-[13px] font-medium text-ink">Why it fits</p>
            <ul className="mt-2 space-y-1 text-[14px] leading-6 text-body">
              {ranked.why.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] font-medium text-ink">Things to consider</p>
            <ul className="mt-2 space-y-1 text-[14px] leading-6 text-body">
              {ranked.consider.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {sourceOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/30 p-4">
          <div className="max-w-md rounded-lg bg-surface p-6 ring-1 ring-hairline">
            <h2 className="text-[18px] font-medium text-ink">Original posting</h2>
            <p className="mt-3 text-[15px] leading-6 text-body">
              Continue to the {job.company} careers page to view the original
              posting and apply.
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

      <SignupModal
        open={signupOpen || Boolean(demo.pendingSaveId)}
        onDone={() => setSignupOpen(false)}
      />
    </article>
  );
}

function PreparePanel({
  jobTitle,
  jobId,
  onClose,
}: {
  jobTitle: string;
  jobId: string;
  onClose: () => void;
}) {
  const demo = useDemo();
  const profile = demo.profile;
  const [notes, setNotes] = useState(
    demo.applications.find((item) => item.jobId === jobId)?.notes ?? "",
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/30 p-4 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface p-6 ring-1 ring-hairline">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Application
        </p>
        <h2 className="font-display mt-2 text-[24px] font-semibold text-ink">
          {jobTitle}
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-body">
          Keep notes, tailor your story, and send when you are ready.
        </p>
        {profile ? (
          <div className="mt-5 rounded-md bg-canvas p-4 ring-1 ring-hairline-soft">
            <p className="text-[13px] font-medium text-ink">
              {profile.currentRole} · {profile.years} years
            </p>
            <p className="mt-1 text-[13px] text-body">
              {[...profile.skills, ...profile.abilities].join(" · ")}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-[13px] text-muted">
            Without a profile, only the job. Personalization stays optional.
          </p>
        )}
        <div className="mt-5">
          <p className="text-[13px] font-medium text-ink">CV notes, examples only</p>
          <ul className="mt-2 space-y-1 text-[14px] leading-6 text-body">
            <li>· Lead with shipped product work, not a task list.</li>
            <li>· Two concrete features or systems, with your part in them.</li>
            <li>· Mention TypeScript or React only with context.</li>
          </ul>
        </div>
        <div className="mt-5">
          <p className="text-[13px] font-medium text-ink">Checklist</p>
          <ul className="mt-2 space-y-1 text-[14px] leading-6 text-body">
            <li>· Hold the listing against your profile</li>
            <li>· Tailor the note to one gap</li>
            <li>· Set a follow-up date</li>
          </ul>
        </div>
        <label className="mt-5 grid gap-1 text-[13px] font-medium text-ink">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="rounded-md bg-canvas px-3 py-2 text-[14px] font-normal ring-1 ring-hairline outline-none"
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              upsertApplication(jobId, { status: "preparing", notes });
              window.location.assign("/konto/bewerbungen");
            }}
            className="inline-flex h-10 items-center rounded-md px-4 text-[14px] ring-1 ring-hairline"
          >
            Mark as preparing
          </button>
          <button
            type="button"
            onClick={() => {
              upsertApplication(jobId, { status: "applied", notes });
              window.location.assign("/konto/bewerbungen");
            }}
            className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] text-white"
          >
            Mark as applied
          </button>
          <button type="button" onClick={onClose} className="h-10 px-3 text-[14px] text-muted">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
