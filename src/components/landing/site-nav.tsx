"use client";

import { useState } from "react";
import { Logo } from "./logo";

const links = [
  { href: "#produkt", label: "Produkt" },
  { href: "#so-funktionierts", label: "So funktioniert’s" },
  { href: "#treffer", label: "Treffer" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline-soft bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="relative z-10" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium tracking-[-0.16px] text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="#start"
            className="inline-flex h-9 items-center rounded-md px-3.5 text-[15px] font-medium tracking-[-0.16px] text-ink"
          >
            Anmelden
          </a>
          <a
            href="#start"
            className="inline-flex h-9 items-center rounded-md bg-ink px-3.5 text-[15px] font-medium tracking-[-0.16px] text-white hover:bg-ink-soft"
          >
            Frühzugang
          </a>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 ring-hairline md:hidden"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menü</span>
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
        <div className="border-t border-hairline-soft bg-canvas px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[15px] font-medium tracking-[-0.16px]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#start"
              className="mt-2 inline-flex h-9 items-center justify-center rounded-md bg-ink text-[15px] font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Frühzugang
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
