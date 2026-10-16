"use client";

import { useState } from "react";
import { upsertApplication, useDemo } from "@/lib/demo/store";

export function PreparePanel({
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
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/30 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="prepare-title"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface p-6 ring-1 ring-hairline"
      >
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Application
        </p>
        <h2 id="prepare-title" className="font-display mt-2 text-[24px] font-semibold text-ink">
          {jobTitle}
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-body">
          Keep notes, tailor your story, and send when you are ready.
        </p>
        {profile ? (
          <div className="mt-5 rounded-md bg-canvas p-4 ring-1 ring-hairline-soft">
            <p className="text-[13px] font-medium text-ink">
              {profile.currentRole || profile.headline || "Your profile"}
              {profile.years ? ` · ${profile.years} years` : ""}
            </p>
            <p className="mt-1 text-[13px] text-body">
              {[...profile.skills, ...profile.abilities].filter(Boolean).join(" · ") ||
                "Add skills to your profile to tailor this note."}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-[13px] text-muted">
            Without a profile, only the job details are available.
          </p>
        )}
        <label className="mt-5 grid gap-1 text-[13px] font-medium text-ink">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="rounded-md bg-canvas px-3 py-2 text-[14px] font-normal ring-1 ring-hairline outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              upsertApplication(jobId, { status: "preparing", notes });
              window.location.assign("/konto/bewerbungen");
            }}
            className="inline-flex h-10 items-center rounded-md px-4 text-[14px] ring-1 ring-hairline focus-visible:ring-2 focus-visible:ring-accent"
          >
            Mark as preparing
          </button>
          <button
            type="button"
            onClick={() => {
              upsertApplication(jobId, { status: "applied", notes });
              window.location.assign("/konto/bewerbungen");
            }}
            className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] text-white focus-visible:ring-2 focus-visible:ring-accent"
          >
            Mark as applied
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-3 text-[14px] text-muted hover:text-ink"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
