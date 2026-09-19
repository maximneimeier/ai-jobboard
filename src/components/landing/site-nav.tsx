"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CHAT_OPEN_EVENT } from "@/lib/chats";
import { Logo } from "./logo";
import { ProfileMenu } from "./profile-menu";
import { SavedJobsButton } from "./saved-jobs-button";

const links = [
  { href: "/search#suche", label: "Jobs" },
  { href: "/search#arbeitgeber", label: "Arbeitgeber" },
  { href: "/gemerkt", label: "Gemerkt" },
  { href: "/#early-access", label: "Early Access" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    function onChat(event: Event) {
      setChatOpen(Boolean((event as CustomEvent).detail));
    }
    window.addEventListener(CHAT_OPEN_EVENT, onChat);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, onChat);
  }, []);

  if (chatOpen) {
    return (
      <header
        className="pointer-events-none invisible sticky top-0 z-40 h-16 md:h-[72px]"
        aria-hidden
      />
    );
  }

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
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ProfileMenu />
          <Link
            href="/search#suche"
            className="inline-flex h-9 items-center rounded-md bg-ink px-3.5 text-[14px] font-medium tracking-[-0.16px] text-white"
          >
            Jetzt suchen
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <SavedJobsButton compact />
          <ProfileMenu compact />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-hairline"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
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
          </nav>
        </div>
      ) : null}
    </header>
  );
}
