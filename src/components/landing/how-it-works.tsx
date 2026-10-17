"use client";

import { CheckCircle2, Sparkles, UserRound } from "lucide-react";

const STEPS = [
  {
    step: "01",
    icon: UserRound,
    title: "Create your profile",
    text: "Upload a CV or enter your history, then choose the roles and places you want. You review every field before matching starts.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "See jobs that fit",
    text: "Discover ranks open roles and labels each one a strong match, a good match, a stretch, or something that needs review.",
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Track what happens next",
    text: "Save a role, set its status, and move it on the application board. Connect your inbox to mark offers and rejections.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-[84px] bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <h2 className="font-display max-w-[18ch] text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          Your next opportunity in three simple steps.
        </h2>
        <ol className="relative mt-10 grid gap-4 md:grid-cols-3">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[2.75rem] right-[16%] left-[16%] hidden h-px bg-hairline md:block"
          />
          {STEPS.map((item) => (
            <li
              key={item.step}
              className="relative rounded-2xl bg-canvas p-6 ring-1 ring-hairline"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <item.icon size={18} />
                </span>
                <span className="text-[12px] font-medium text-muted">{item.step}</span>
              </div>
              <h3 className="mt-6 text-[18px] font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-6 text-body">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
