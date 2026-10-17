"use client";

import { Inbox, ScanSearch, Send } from "lucide-react";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Matches you can read",
    text: "Each listing explains the fit: title, location, level, and which requirements still need confirmation.",
  },
  {
    icon: Send,
    title: "Saved jobs and a board",
    text: "Set a status on a saved role, or drag the card across interested, preparing, applied, interview, offer, and rejected.",
  },
  {
    icon: Inbox,
    title: "Offers and rejections",
    text: "Connect the inbox on your account. Replies show on saved jobs and move the matching cards on the board.",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="scroll-mt-[84px] bg-canvas py-20 md:py-28">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <h2 className="font-display max-w-[18ch] text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          The same workspace you open after you sign in.
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
