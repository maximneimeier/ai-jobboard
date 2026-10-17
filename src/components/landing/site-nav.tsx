"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDemo } from "@/lib/demo/store";
import { Logo } from "./logo";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const demo = useDemo();
  useEffect(() => {
    setReady(true);
  }, []);
  const signedUp = ready && demo.signedUp;
  const saved = ready ? demo.savedIds.length : 0;
  const links = [
    { href: "/jobs", label: "Jobs" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/konto/gemerkt", label: "Saved" },
    { href: "/#pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-hairline-soft bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1080px] items-center justify-between px-5 md:h-[72px] md:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium tracking-[-0.16px] text-ink"
            >
              {link.label}
              {link.label === "Saved" && saved ? (
                <span className="ml-1.5 rounded-md bg-surface-soft px-1.5 text-[11px]">
                  {saved}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {signedUp ? (
            <Link
              href="/konto"
              className="inline-flex h-9 items-center rounded-md bg-ink px-3.5 text-[14px] font-medium tracking-[-0.16px] text-white"
            >
              Account
            </Link>
          ) : (
            <>
              <Link
                href="/signin"
                className="inline-flex h-9 items-center rounded-md px-3.5 text-[14px] font-medium tracking-[-0.16px] text-ink"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center rounded-md bg-ink px-3.5 text-[14px] font-medium tracking-[-0.16px] text-white"
              >
                Create your profile
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-hairline lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {open ? (
              <path
                d="M3.5 3.5l9 9M12.5 3.5l-9 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-hairline-soft bg-surface px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {signedUp ? (
              <Link
                href="/konto"
                className="text-[14px] font-medium"
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-[14px] font-medium"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-[14px] font-medium"
                  onClick={() => setOpen(false)}
                >
                  Create your profile
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
