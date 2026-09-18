import { Logo } from "./logo";

const columns = [
  {
    title: "Produkt",
    links: ["Chat-Suche", "Filter", "Treffer", "Frühzugang"],
  },
  {
    title: "Unternehmen",
    links: ["Über Aria", "Karriere", "Presse"],
  },
  {
    title: "Rechtliches",
    links: ["Impressum", "Datenschutz", "AGB"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline-soft bg-surface-faint">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[14px] leading-6 text-body">
            Jobsuche im Gespräch. Anforderungen verstehen, präzise filtern,
            bessere Treffer.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              {column.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#start"
                    className="text-[14px] text-ink-soft hover:text-ink"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-hairline-soft">
        <p className="mx-auto max-w-[1440px] px-5 py-5 text-[13px] text-muted md:px-8">
          © {new Date().getFullYear()} Aria. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
