"use client";

import { useState } from "react";
import {
  SAMPLE_PROFILE,
  blankProfile,
  completeProfile,
  type CareerProfile,
} from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";
import { ProfileFields } from "./profile-fields";

type Step = "pick" | "processing" | "review";

export function OnboardingPage() {
  const [step, setStep] = useState<Step>("pick");
  const [fileName, setFileName] = useState("");
  const [profile, setProfile] = useState<CareerProfile>(blankProfile());

  function startUpload(name: string) {
    setFileName(name);
    setStep("processing");
    window.setTimeout(() => {
      setProfile(SAMPLE_PROFILE);
      setStep("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1100);
  }

  function finish() {
    window.location.assign(completeProfile(profile));
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-10 md:px-8">
      {step === "pick" ? (
        <>
          <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
            Create your profile
          </p>
          <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
            Tell us about your career.
          </h1>
          <p className="mt-3 max-w-[52ch] text-[16px] leading-7 text-body">
            Add your work history, education, skills, and what you want next.
            We use that to show the jobs that fit you best.
          </p>
          <div className="mt-8 grid gap-2">
            <button
              type="button"
              onClick={() => startUpload("resume.pdf")}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent text-[15px] font-medium text-white transition hover:bg-accent-hover"
            >
              Use an example resume
            </button>
            <label className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl text-[15px] font-medium text-ink ring-1 ring-hairline">
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
              className="inline-flex h-12 items-center justify-center rounded-xl text-[15px] font-medium text-ink ring-1 ring-hairline"
            >
              Fill in your profile
            </button>
            <button
              type="button"
              onClick={() => {
                setProfile(blankProfile());
                window.location.assign(completeProfile(blankProfile()));
              }}
              className="inline-flex h-12 items-center justify-center rounded-xl text-[15px] font-medium text-muted transition hover:text-ink"
            >
              Skip for now
            </button>
          </div>
        </>
      ) : null}

      {step === "processing" ? (
        <div className="py-16 text-center">
          <p className="text-[16px] text-body">Reading {fileName || "your CV"}…</p>
          <p className="mt-2 text-[14px] text-muted">
            Extracting experience, education, skills, and preferences.
          </p>
        </div>
      ) : null}

      {step === "review" ? (
        <>
          <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
            Your profile
          </p>
          <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
            {fileName ? "Does this look right?" : "Add your details."}
          </h1>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-6 text-body">
            Add what you have. You can continue even if some fields are empty.
          </p>
          <div className="mt-4">
            <DemoBanner>
              {fileName
                ? `Review the details we extracted from ${fileName}. Edit anything before we match jobs.`
                : "The more complete this is, the better we can rank roles for you."}
            </DemoBanner>
          </div>
          <button
            type="button"
            onClick={finish}
            className="mt-6 inline-flex h-12 items-center rounded-xl bg-accent px-5 text-[15px] font-medium text-white transition hover:bg-accent-hover"
          >
            See matching jobs
          </button>
          <form
            className="mt-8"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              finish();
            }}
          >
            <ProfileFields profile={profile} onChange={setProfile} />
            <button
              type="submit"
              className="mt-8 inline-flex h-12 items-center rounded-xl bg-accent px-5 text-[15px] font-medium text-white transition hover:bg-accent-hover"
            >
              See matching jobs
            </button>
          </form>
        </>
      ) : null}
    </div>
  );
}
