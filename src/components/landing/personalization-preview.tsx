"use client";

import Link from "next/link";
import { FileUp } from "lucide-react";

const SKILLS = ["TypeScript", "React", "Node.js", "PostgreSQL", "Git"];
const ROLES = ["Software Engineer", "Frontend Engineer", "Full Stack Engineer"];
const PLACES = ["Berlin", "Germany", "Amsterdam"];

export function PersonalizationPreview() {
  return (
    <section id="personalize" className="scroll-mt-[84px] bg-surface py-20 md:py-28">
      <div className="mx-auto grid max-w-[1120px] items-center gap-10 px-5 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.72px] text-accent uppercase">
            Your profile
          </p>
          <h2 className="font-display mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
            A job search that understands you.
          </h2>
          <p className="mt-4 text-[16px] leading-7 text-body">
            Upload a CV or enter your history, then set the roles and places you
            want. Matching uses that profile, and you can edit every field.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-12 items-center rounded-xl bg-accent px-5 text-[15px] font-medium text-white transition hover:bg-accent-hover"
          >
            Create your profile
          </Link>
        </div>
        <div className="rounded-2xl bg-canvas p-5 ring-1 ring-hairline md:p-6">
          <p className="text-[11px] font-medium text-accent">Your profile</p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-hairline bg-surface px-4 py-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <FileUp size={18} />
            </span>
            <div>
              <p className="text-[14px] font-medium text-ink">Upload a CV</p>
              <p className="text-[12px] text-muted">PDF or DOCX. You can edit everything afterwards.</p>
            </div>
          </div>
          <p className="mt-5 text-[12px] font-medium text-ink">Example skills</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-surface px-2.5 py-1 text-[12px] text-ink ring-1 ring-hairline"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="mt-5 text-[12px] font-medium text-ink">Preferred roles</p>
          <p className="mt-1 text-[13px] text-body">{ROLES.join(" · ")}</p>
          <p className="mt-5 text-[12px] font-medium text-ink">Preferred locations</p>
          <p className="mt-1 text-[13px] text-body">{PLACES.join(" · ")}</p>
          <p className="mt-5 text-[12px] font-medium text-ink">Matching preferences</p>
          <p className="mt-1 text-[13px] text-body">Hybrid · Salary from 70k</p>
        </div>
      </div>
    </section>
  );
}
