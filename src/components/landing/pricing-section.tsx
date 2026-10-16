"use client";

import { Check } from "lucide-react";
import { WaitlistForm } from "./waitlist-form";

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-[84px] bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-accent uppercase">
          Pricing
        </p>
        <h2 className="font-display mt-2 max-w-[16ch] text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          Match first. Save when you are ready.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="flex h-full flex-col rounded-2xl bg-canvas p-6 ring-1 ring-hairline md:p-8">
            <p className="text-[14px] font-medium text-ink">Free</p>
            <p className="font-display mt-4 text-[44px] leading-none font-semibold tracking-[-0.04em] text-ink">
              €0
              <span className="ml-1 text-[16px] font-medium text-muted">/ month</span>
            </p>
            <p className="mt-3 text-[15px] leading-6 text-body">
              Search without an account. See why a role may fit — without fake
              percentages.
            </p>
            <ul className="mt-8 space-y-3 text-[14px] text-ink">
              {[
                "Create a career profile",
                "Jobs ranked to your experience",
                "Explained matches",
                "Filters that change results",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check size={16} className="mt-0.5 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/signup"
              className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-xl px-4 text-[15px] font-medium text-ink ring-1 ring-hairline transition hover:bg-surface"
            >
              Start for free
            </a>
          </article>
          <article className="flex h-full flex-col rounded-2xl bg-canvas p-6 ring-1 ring-ink md:p-8">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[14px] font-medium text-ink">Career Copilot Pro</p>
              <span className="rounded-md bg-accent-soft px-2 py-1 text-[12px] font-medium text-accent">
                Recommended
              </span>
            </div>
            <p className="font-display mt-4 text-[44px] leading-none font-semibold tracking-[-0.04em] text-ink">
              €12
              <span className="ml-1 text-[16px] font-medium text-muted">/ month</span>
            </p>
            <p className="mt-3 text-[15px] leading-6 text-body">
              Keep searching, keep the roles, and run applications in one place.
            </p>
            <ul className="mt-8 space-y-3 text-[14px] text-ink">
              {[
                "Unlimited search",
                "Everything in Free",
                "Saved jobs and profile",
                "Application tracker",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check size={16} className="mt-0.5 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <WaitlistForm stacked />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
