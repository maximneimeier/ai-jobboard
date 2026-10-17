"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, FileText } from "lucide-react";
import { SAMPLE_PROFILE, type CareerProfile } from "@/lib/demo/store";
import { ProfileReview } from "./profile-review";

const DEFAULT_FILE = {
  name: "Alex-Weber-CV.pdf",
  size: "248 KB",
  kind: "PDF",
};

export function CvUploadPage() {
  const [file, setFile] = useState(DEFAULT_FILE);
  const [reading, setReading] = useState(false);
  const [profile, setProfile] = useState<CareerProfile>(SAMPLE_PROFILE);

  function takeFile(next?: File) {
    if (!next) return;
    const kind = next.name.split(".").pop()?.toUpperCase() || "PDF";
    const size =
      next.size > 0
        ? `${Math.max(1, Math.round(next.size / 1024))} KB`
        : "248 KB";
    setReading(true);
    window.setTimeout(() => {
      setFile({ name: next.name, size, kind });
      setProfile(SAMPLE_PROFILE);
      setReading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  }

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 py-10 md:px-8">
      <Link href="/onboarding" className="text-[13px] text-muted hover:text-ink">
        ← Back
      </Link>
      <div className="mt-4">
      {reading ? (
        <div className="py-16 text-center">
          <p className="text-[16px] text-body">Reading {file.name}…</p>
          <p className="mt-2 text-[14px] text-muted">
            Filling in your work history, education, and skills.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4 rounded-2xl bg-surface p-4 ring-1 ring-hairline md:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-ink">{file.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-muted">
                  <Check className="h-3.5 w-3.5 text-success" />
                  {file.kind} · {file.size}
                </p>
              </div>
            </div>
            <label className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-xl px-3 text-[13px] font-medium text-ink ring-1 ring-hairline transition hover:bg-canvas">
              Replace
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(event) => {
                  takeFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
          </div>
          <div className="mt-8">
            <ProfileReview
              profile={profile}
              onChange={setProfile}
              fileName={file.name}
            />
          </div>
        </>
      )}
      </div>
    </div>
  );
}
