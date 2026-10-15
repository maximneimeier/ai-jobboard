"use client";

import { FolderCheck, ScanSearch, Target } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "Relevant opportunities",
    text: "Focus on jobs that align with your interests, experience, and career goals.",
  },
  {
    icon: ScanSearch,
    title: "Transparent matching",
    text: "Understand why a role may be a good fit and which requirements need a closer look.",
  },
  {
    icon: FolderCheck,
    title: "Everything in one place",
    text: "Keep track of saved opportunities, applications, and next steps without spreadsheets.",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="scroll-mt-[84px] bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <h2 className="font-display max-w-[18ch] text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          Spend less time searching. More time moving forward.
        </h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {FEATURES.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl bg-surface p-6 ring-1 ring-hairline transition hover:shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <item.icon size={18} />
              </span>
              <h3 className="mt-5 text-[17px] font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-6 text-body">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
