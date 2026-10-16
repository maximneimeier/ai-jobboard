"use client";

import { useState } from "react";
import Link from "next/link";
import { blankProfile, type CareerProfile } from "@/lib/demo/store";
import { ProfileReview } from "./profile-review";

export function OnboardingPage() {
  const [manual, setManual] = useState(false);
  const [profile, setProfile] = useState<CareerProfile>(blankProfile());

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-10 md:px-8">
      {manual ? (
        <ProfileReview profile={profile} onChange={setProfile} />
      ) : (
        <>
          <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
            Create your profile
          </p>
          <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
            Tell us about your career.
          </h1>
          <p className="mt-3 max-w-[52ch] text-[16px] leading-7 text-body">
            Upload a CV and we fill in your profile for you, or add everything
            yourself. Either way, you review the same details before we match jobs.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/onboarding/upload"
              className="flex flex-col items-start rounded-2xl bg-accent px-5 py-5 text-left text-white transition hover:bg-accent-hover"
            >
              <span className="text-[16px] font-medium">Upload your CV</span>
              <span className="mt-1 text-[13px] leading-5 text-white/80">
                We read the file and fill in your work history, education, and skills.
              </span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setProfile(blankProfile());
                setManual(true);
              }}
              className="flex flex-col items-start rounded-2xl px-5 py-5 text-left ring-1 ring-hairline transition hover:bg-canvas"
            >
              <span className="text-[16px] font-medium text-ink">Enter your details</span>
              <span className="mt-1 text-[13px] leading-5 text-muted">
                Add your experience, education, and skills yourself.
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
