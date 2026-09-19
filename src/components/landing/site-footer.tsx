import { Logo } from "./logo";

const links = [
  { href: "/search#suche", label: "Jobs" },
  { href: "/search#arbeitgeber", label: "Arbeitgeber" },
  { href: "/gemerkt", label: "Gemerkt" },
  { href: "/profil", label: "Profil" },
  { href: "/#early-access", label: "Early Access" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline-soft bg-canvas">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-12 px-5 py-12 md:flex-row md:items-start md:justify-between md:px-8">
        <div>
          <Logo />
          <p className="mt-3 max-w-[34ch] text-[14px] leading-6 text-body">
            Die Jobsuche, die Anforderungen versteht. Ein Produkt von{" "}
            <a
              href="https://atheniks.com/de/"
              className="font-medium text-ink underline decoration-hairline underline-offset-4 hover:decoration-ink"
            >
              Atheniks
            </a>
            {". "}
          </p>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
            Aria
          </p>
          <ul className="mt-4 space-y-2.5">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-[14px] text-ink-soft hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline-soft">
        <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-3 px-5 py-5 text-[13px] text-muted md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Atheniks. Alle Rechte vorbehalten.</p>
          <div className="flex flex-wrap gap-5">
            <a href="https://atheniks.com/de/impressum/" className="hover:text-ink">
              Impressum
            </a>
            <a href="https://atheniks.com/de/datenschutz/" className="hover:text-ink">
              Datenschutz
            </a>
            <a href="https://atheniks.com/de/agb/" className="hover:text-ink">
              AGB
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
