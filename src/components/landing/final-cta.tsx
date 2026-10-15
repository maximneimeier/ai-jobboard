"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="bg-accent-soft/40 py-20 md:py-28">
      <div className="mx-auto max-w-[720px] px-5 text-center md:px-8">
        <h2 className="font-display text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          Your next opportunity starts here.
        </h2>
        <p className="mx-auto mt-4 max-w-[42ch] text-[16px] leading-7 text-body">
          Discover jobs that match your ambitions, not just your keywords.
        </p>
        <Link
          href="/onboarding"
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 text-[15px] font-medium text-white transition hover:bg-accent-hover sm:w-auto"
        >
          Create your profile
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
