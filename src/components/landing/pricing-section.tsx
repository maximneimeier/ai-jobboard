"use client";

import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section id="workspace" className="scroll-mt-[84px] bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-accent uppercase">
          Workspace
        </p>
        <h2 className="font-display mt-2 max-w-[18ch] text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          Browse first. The workspace opens with your account.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-2xl bg-canvas p-6 ring-1 ring-hairline md:p-8">
            <p className="text-[14px] font-medium text-ink">Browse jobs</p>
            <p className="mt-4 text-[15px] leading-6 text-body">
              No account. Attach a CV or describe your experience in chat, and roles are picked from that.
            </p>
            <ul className="mt-8 space-y-3 text-[14px] text-ink">
              {[
                "Upload a CV",
                "Or describe skills and experience in chat",
                "See the roles picked for that story",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/browse"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-[15px] font-medium text-ink ring-1 ring-hairline transition hover:bg-surface"
            >
              Browse jobs
            </a>
          </article>
          <article className="flex h-full flex-col rounded-2xl bg-canvas p-6 ring-1 ring-ink md:p-8">
            <p className="text-[14px] font-medium text-ink">Your account</p>
            <p className="mt-4 text-[15px] leading-6 text-body">
              Create a profile and the sidebar keeps discover, saved jobs, and applications together.
            </p>
            <ul className="mt-8 space-y-3 text-[14px] text-ink">
              {[
                "Profile from a CV or entered by hand",
                "Explained matches on each role",
                "Saved jobs with a status menu",
                "Application board",
                "Job alerts, Career Copilot, and inbox replies",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-4 text-[15px] font-medium text-white transition hover:bg-accent-hover"
            >
              Create your profile
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
