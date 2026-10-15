import { Logo } from "./logo";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "https://atheniks.com/de/datenschutz/", label: "Privacy" },
  { href: "https://atheniks.com/de/agb/", label: "Terms" },
  { href: "mailto:hello@atheniks.com", label: "Contact" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <Logo label="Atheniks" />
          <p className="mt-3 max-w-[32ch] text-[14px] leading-6 text-body">
            Less searching. Better opportunities.
          </p>
          <p id="about" className="mt-4 max-w-[40ch] text-[13px] leading-6 text-muted">
            Atheniks is a personal AI career copilot. Search first, then
            personalize when you are ready.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-10 gap-y-2.5 text-[14px]">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-ink-soft transition hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-5 py-5 text-[13px] text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p suppressHydrationWarning>© 2026 Atheniks. All rights reserved.</p>
          <p id="contact">
            <a href="mailto:hello@atheniks.com" className="hover:text-ink">
              hello@atheniks.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
