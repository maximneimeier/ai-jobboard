"use client";

import { completeProfile, type CareerProfile } from "@/lib/demo/store";
import { ProfileFields } from "./profile-fields";

export function ProfileReview({
  profile,
  onChange,
  fileName,
}: {
  profile: CareerProfile;
  onChange: (next: CareerProfile) => void;
  fileName?: string;
}) {
  function finish() {
    window.location.assign(completeProfile(profile));
  }

  return (
    <>
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Your profile
      </p>
      <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
        {fileName ? "Does this look right?" : "Add your details."}
      </h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-6 text-body">
        {fileName
          ? `We filled in your profile from ${fileName}. Edit anything before we match jobs.`
          : "Add what you have. You can continue even if some fields are empty."}
      </p>
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
        <ProfileFields profile={profile} onChange={onChange} />
        <button
          type="submit"
          className="mt-8 inline-flex h-12 items-center rounded-xl bg-accent px-5 text-[15px] font-medium text-white transition hover:bg-accent-hover"
        >
          See matching jobs
        </button>
      </form>
    </>
  );
}
