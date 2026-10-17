"use client";

import Link from "next/link";
import { demoJobById } from "@/lib/demo/jobs";
import { salaryLabel } from "@/lib/demo/match";
import { toggleSave, useDemo } from "@/lib/demo/store";

export function SavedBoard() {
  const demo = useDemo();
  const jobs = demo.savedIds.map(demoJobById).filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-[800px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Saved
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        Your jobs.
      </h1>
      {jobs.length === 0 ? (
        <p className="mt-8 text-[15px] text-body">
          Nothing saved yet.{" "}
          <Link href="/jobs" className="text-ink underline">
            Discover jobs
          </Link>
        </p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {jobs.map((job) =>
            job ? (
              <li
                key={job.id}
                className="rounded-lg bg-surface p-5 ring-1 ring-hairline-soft"
              >
                <p className="font-medium text-ink">{job.title}</p>
                <p className="mt-1 text-[14px] text-body">
                  {job.company} · {job.location} · {salaryLabel(job)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex h-9 items-center rounded-md px-3 text-[13px] ring-1 ring-hairline"
                  >
                    Open job
                  </Link>
                  <Link
                    href={`/konto/gemerkt/${job.id}`}
                    className="inline-flex h-9 items-center rounded-md bg-ink px-3 text-[13px] text-white"
                  >
                    Prepare application
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleSave(job.id)}
                    className="inline-flex h-9 items-center rounded-md px-3 text-[13px] ring-1 ring-hairline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
}
