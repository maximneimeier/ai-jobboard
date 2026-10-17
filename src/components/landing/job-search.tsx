"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function JobSearch() {
  return (
    <div id="search" className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href="/signup"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-medium text-white transition hover:bg-accent-hover"
      >
        Create your profile
        <ArrowRight size={16} />
      </Link>
      <Link
        href="/browse"
        className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-[15px] font-medium text-ink ring-1 ring-hairline transition hover:bg-surface"
      >
        Browse jobs
      </Link>
    </div>
  );
}
