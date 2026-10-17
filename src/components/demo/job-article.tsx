"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { demoJobById } from "@/lib/demo/jobs";
import { paths } from "@/lib/demo/paths";
import {
  EMPLOYMENT_LABEL,
  LEVEL_LABEL,
  WORK_MODE_LABEL,
  matchChecks,
  postedLabel,
  rankDemoJobs,
  salaryLabel,
} from "@/lib/demo/match";
import { toggleSave, upsertApplication, useDemo } from "@/lib/demo/store";
import { ExperienceMark, MatchBadge } from "./match-badge";
import { PreparePanel } from "./prepare-panel";
import { SkillChecks } from "./skill-checks";

function jobOrigin(from: string | null) {
  if (from === "saved") return { href: paths.saved, label: "Saved jobs" };
  if (from === "overview") return { href: paths.account, label: "Overview" };
  if (from === "applications") return { href: paths.applications, label: "Applications" };
  return { href: paths.jobs, label: "Results" };
}

export function JobArticle({ jobId }: { jobId: string }) {
  const demo = useDemo();
  const origin = jobOrigin(useSearchParams().get("from"));
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
        summaryLine: "Similar role to your current search.",
      }
    );
  }, [job, demo]);

  if (!job || !ranked) {
    return (
      <div className="mx-auto max-w-[800px] px-5 py-16">
        <p className="text-[15px] text-body">This job is no longer available.</p>
        <Link href={origin.href} className="mt-4 inline-flex text-[14px] text-ink underline">
          Back to {origin.label.toLowerCase()}
        </Link>
      </div>
    );
  }

  const listing = job;

  function save() {
    toggleSave(listing.id);
  }

  function prepare() {
    if (!demo.savedIds.includes(listing.id)) toggleSave(listing.id);
    upsertApplication(listing.id, { status: "preparing" });
    setPrepareOpen(true);
  }

  return (
    <article className="mx-auto w-full max-w-[800px] px-5 py-12 md:px-8">
      <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
        <Link href={origin.href} className="hover:text-ink">
          {origin.label}
        </Link>
        <span className="px-1.5" aria-hidden>
          /
        </span>
        <span className="text-ink">{job.title}</span>
      </nav>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <MatchBadge
          fit={ranked.fit}
          searchLabel={ranked.searchLabel}
          personalized={demo.personalized}
        />
        {demo.personalized && demo.profile ? (
          <ExperienceMark years={demo.profile.years} level={job.level} />
        ) : null}
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
            <div className="mt-2">
              <SkillChecks checks={matchChecks(job, demo.profile)} />
            </div>
          ) : (
            <p className="mt-2 text-[15px] text-body">{job.skills.join(" · ")}</p>
          )}
        </section>
        {demo.personalized ? (
          <section className="rounded-lg bg-surface p-5 ring-1 ring-hairline-soft">
            <h2 className="text-[15px] font-medium text-ink">Fit with your profile</h2>
            <p className="mt-3 text-[13px] leading-5 text-body">
              Based on your profile, experience, and stated preferences.
            </p>
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

      {prepareOpen ? (
        <PreparePanel
          jobTitle={job.title}
          jobId={job.id}
          onClose={() => setPrepareOpen(false)}
        />
      ) : null}

    </article>
  );
}
