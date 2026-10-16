"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SignupModal } from "@/components/demo/signup-modal";
import { useDemo } from "@/lib/demo/store";
import { Logo } from "./logo";

const LINKS = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [signup, setSignup] = useState(false);
  const [ready, setReady] = useState(false);
  const demo = useDemo();
  useEffect(() => {
    setReady(true);
  }, []);
  const signedUp = ready && demo.signedUp;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hairline bg-surface/90 backdrop-blur-md">
        <div className="mx-auto grid h-16 w-full max-w-[1120px] grid-cols-[1fr_auto] items-center px-5 md:h-[72px] md:grid-cols-[1fr_auto_1fr] md:px-8">
          <Link href="/" onClick={() => setOpen(false)}>
            <Logo label="Atheniks" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium text-muted transition hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center justify-end gap-2 md:flex">
            {signedUp ? (
              <Link
                href="/konto"
                className="inline-flex h-9 items-center rounded-xl px-3.5 text-[14px] font-medium text-ink transition hover:bg-canvas"
              >
                Account
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setSignup(true)}
                className="inline-flex h-9 items-center rounded-xl px-3.5 text-[14px] font-medium text-ink transition hover:bg-canvas"
              >
                Sign In
              </button>
            )}
            <Link
              href="/signup"
              className="inline-flex h-9 items-center rounded-xl bg-accent px-3.5 text-[14px] font-medium text-white transition hover:bg-accent-hover"
            >
              Get Started
            </Link>
          </div>
          <button
            type="button"
            className="justify-self-end rounded-xl p-2 text-ink ring-1 ring-hairline md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-hairline bg-surface px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-medium text-ink"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {signedUp ? (
                <Link href="/konto" className="text-[14px] font-medium" onClick={() => setOpen(false)}>
                  Account
                </Link>
              ) : (
                <button
                  type="button"
                  className="text-left text-[14px] font-medium"
                  onClick={() => {
                    setOpen(false);
                    setSignup(true);
                  }}
                >
                  Sign In
                </button>
              )}
              <Link
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-accent text-[14px] font-medium text-white"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        ) : null}
      </header>
      <SignupModal open={signup} onDone={() => setSignup(false)} />
    </>
  );
}
