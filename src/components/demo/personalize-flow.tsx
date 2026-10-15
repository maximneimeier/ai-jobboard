"use client";

import { useEffect, useState } from "react";
import {
  SAMPLE_PROFILE,
  applySampleProfile,
  blankProfile,
  writeProfile,
  type CareerProfile,
} from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";
import { ProfileFields } from "./profile-fields";

type Step = "pick" | "processing" | "review";

export function PersonalizeFlow({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<Step>("pick");
  const [fileName, setFileName] = useState("");
  const [profile, setProfile] = useState<CareerProfile>(blankProfile());

  useEffect(() => {
    if (!open) return;
    setStep("pick");
    setFileName("");
    setProfile(blankProfile());
  }, [open]);

  if (!open) return null;

  function startUpload(name: string) {
    setFileName(name);
    setStep("processing");
    window.setTimeout(() => {
      setProfile(SAMPLE_PROFILE);
      setStep("review");
    }, 1100);
  }

  function finish() {
    writeProfile(profile);
    applySampleProfile(profile);
    onDone();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/30 p-4 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-surface p-6 shadow-[0_16px_60px_rgba(0,0,0,0.12)] ring-1 ring-hairline md:p-8">
        {step === "pick" ? (
          <>
            <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              Create your profile
            </p>
            <h2 className="font-display mt-2 text-[26px] font-semibold tracking-[-0.32px] text-ink">
              Tell us about your career.
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-body">
              Add your work history, education, skills, and what you want next.
              We use that to show the jobs that fit you best.
            </p>
            <div className="mt-6 grid gap-2">
              <button
                type="button"
                onClick={() => startUpload("resume.pdf")}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-accent text-[14px] font-medium text-white transition hover:bg-accent-hover"
              >
                Use an example resume
              </button>
              <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl text-[14px] font-medium text-ink ring-1 ring-hairline">
                Upload your CV
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    startUpload(file?.name ?? "resume.pdf");
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  setFileName("");
                  setProfile(blankProfile());
                  setStep("review");
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl text-[14px] font-medium text-ink ring-1 ring-hairline"
              >
                Fill in your profile
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center rounded-xl text-[14px] text-muted"
              >
                Cancel
              </button>
            </div>
          </>
        ) : null}

        {step === "processing" ? (
          <div className="py-10 text-center">
            <p className="text-[15px] text-body">Reading {fileName || "your CV"}…</p>
            <p className="mt-2 text-[13px] text-muted">
              Extracting experience, education, skills, and preferences.
            </p>
          </div>
        ) : null}

        {step === "review" ? (
          <>
            <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              Your profile
            </p>
            <h2 className="font-display mt-2 text-[26px] font-semibold tracking-[-0.32px] text-ink">
              {fileName ? "Does this look right?" : "Add your details."}
            </h2>
            <div className="mt-4">
              <DemoBanner>
                {fileName
                  ? `Review the details we extracted from ${fileName}. Edit anything before we match jobs.`
                  : "Fill in your resume. The more complete it is, the better your matches."}
              </DemoBanner>
            </div>
            <div className="mt-6">
              <ProfileFields profile={profile} onChange={setProfile} />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={finish}
                className="inline-flex h-11 items-center rounded-xl bg-accent px-4 text-[14px] font-medium text-white transition hover:bg-accent-hover"
              >
                Show my matching jobs
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center rounded-xl px-4 text-[14px] text-muted"
              >
                Cancel
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
