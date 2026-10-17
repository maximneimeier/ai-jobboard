"use client";

import { useRouter } from "next/navigation";
import { resetDemo, signOut, useDemo } from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";

export function SettingsPage() {
  const demo = useDemo();
  const router = useRouter();

  return (
    <div className="mx-auto w-full max-w-[640px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Settings
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        Account
      </h1>
      <div className="mt-4">
        <DemoBanner>
          Clear your search, profile, saved jobs, and applications from this
          browser.
        </DemoBanner>
      </div>
      <p className="mt-6 text-[15px] text-body">
        Account: {demo.signedUp ? demo.email || "Signed in" : "Not signed in"}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="inline-flex h-11 items-center rounded-md bg-ink px-4 text-[14px] text-white"
        >
          Sign out
        </button>
        <button
          type="button"
          onClick={() => {
            resetDemo();
            router.push("/");
          }}
          className="inline-flex h-11 items-center rounded-md px-4 text-[14px] text-ink ring-1 ring-hairline"
        >
          Clear saved data
        </button>
      </div>
    </div>
  );
}
