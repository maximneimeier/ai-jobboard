"use client";

import { useEffect, useState } from "react";
import { SAMPLE_PROFILE, useDemo, writeProfile, type CareerProfile } from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";
import { ProfileFields } from "./profile-fields";

export function CareerProfilePage() {
  const demo = useDemo();
  const [profile, setProfile] = useState<CareerProfile>(
    demo.profile ?? SAMPLE_PROFILE,
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (demo.profile) setProfile(demo.profile);
  }, [demo.profile]);

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Profile
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        Resume
      </h1>
      <div className="mt-4">
        <DemoBanner>
          Add your work history, education, skills, and notes. We use this to rank and explain matching roles.
        </DemoBanner>
      </div>
      <div className="mt-8">
        <ProfileFields profile={profile} onChange={setProfile} />
      </div>
      <button
        type="button"
        onClick={() => {
          writeProfile(profile);
          setSaved(true);
        }}
        className="mt-8 inline-flex h-11 items-center rounded-xl bg-accent px-4 text-[14px] font-medium text-white transition hover:bg-accent-hover"
      >
        Save resume
      </button>
      {saved ? (
        <p className="mt-3 text-[13px] text-body">Saved. Matching now uses this resume.</p>
      ) : null}
    </div>
  );
}
