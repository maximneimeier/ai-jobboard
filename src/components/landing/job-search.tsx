"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function JobSearch() {
  return (
    <div id="search" className="flex justify-center">
      <Link
        href="/signup"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-medium text-white transition hover:bg-accent-hover"
      >
        Create your profile
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
