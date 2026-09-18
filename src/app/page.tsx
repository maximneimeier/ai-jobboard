import { EmployerDirectory } from "@/components/landing/employer-directory";
import { HomeSearch } from "@/components/landing/home-search";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { JOBS } from "@/lib/jobs";

const categories = [
  { name: "Informatik / Software", count: JOBS.filter((job) => job.fn === "engineering").length },
  { name: "Design / UX", count: JOBS.filter((job) => job.fn === "design").length },
  { name: "Product Management", count: JOBS.filter((job) => job.fn === "product").length },
  { name: "Data / Analytics", count: JOBS.filter((job) => job.fn === "data").length },
  { name: "Marketing / Growth", count: JOBS.filter((job) => job.fn === "marketing").length },
  { name: "Sales / Customer", count: JOBS.filter((job) => job.fn === "sales").length },
  { name: "Berlin", count: JOBS.filter((job) => job.city === "Berlin").length },
  { name: "München", count: JOBS.filter((job) => job.city === "München").length },
  { name: "Remote", count: JOBS.filter((job) => job.workMode === "remote").length },
];

export default function Home() {
  return (
    <div id="top" className="flex min-h-full flex-col bg-canvas">
      <SiteNav />
      <main>
        <HomeSearch />

        <section id="arbeitgeber" className="scroll-mt-[84px] bg-surface-faint py-24">
          <EmployerDirectory />
        </section>

        <section id="berufe" className="scroll-mt-[84px] bg-canvas py-24">
          <div className="mx-auto max-w-[1080px] px-5 md:px-8">
            <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              Berufe
            </p>
            <h2 className="font-display mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] md:text-[40px]">
              Jobs nach Berufsgruppen
            </h2>
            <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <a
                  key={category.name}
                  href="#suche"
                  className="flex items-center justify-between rounded-lg px-4 py-3 ring-1 ring-hairline-soft hover:bg-surface-faint"
                >
                  <span className="text-[15px] tracking-[-0.16px]">{category.name}</span>
                  <span className="text-[14px] text-muted">{category.count}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="preise" className="scroll-mt-[84px] bg-surface-faint py-24">
          <div className="mx-auto max-w-[1080px] px-5 md:px-8">
            <div className="max-w-[44ch]">
              <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
                Preise
              </p>
              <h2 className="font-display mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] md:text-[40px]">
                Ein Plan zum Testen. Einer zum Weitersuchen.
              </h2>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              <article className="flex h-full flex-col rounded-lg bg-canvas p-6 ring-1 ring-hairline-soft md:p-8">
                <p className="text-[14px] font-medium tracking-[-0.16px] text-ink">Gratis</p>
                <p className="font-display mt-4 text-[44px] leading-none font-semibold tracking-[-0.04em] text-ink">
                  0 €
                  <span className="ml-1 text-[16px] font-medium tracking-[-0.16px] text-muted">
                    / Monat
                  </span>
                </p>
                <p className="mt-3 text-[15px] leading-6 text-body">
                  Zum Ausprobieren. Fünf Suchen, Treffer mit Begründung.
                </p>
                <ul className="mt-8 space-y-3 text-[14px] leading-6 text-ink">
                  {[
                    "5 Suchen",
                    "Suche in normalen Sätzen",
                    "Treffer mit Fit und Lücke",
                    "Kriterien als Filter",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <a
                    href="#suche"
                    className="inline-flex h-11 w-full items-center justify-center rounded-md px-4 text-[15px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline"
                  >
                    Kostenlos starten
                  </a>
                </div>
              </article>

              <article className="flex h-full flex-col rounded-lg bg-canvas p-6 ring-1 ring-ink md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] font-medium tracking-[-0.16px] text-ink">Pro</p>
                  <span className="rounded-md bg-surface-soft px-2 py-1 text-[12px] font-medium text-ink">
                    Empfohlen
                  </span>
                </div>
                <p className="font-display mt-4 text-[44px] leading-none font-semibold tracking-[-0.04em] text-ink">
                  12 €
                  <span className="ml-1 text-[16px] font-medium tracking-[-0.16px] text-muted">
                    / Monat
                  </span>
                </p>
                <p className="mt-3 text-[15px] leading-6 text-body">
                  Unbegrenzt weitersuchen, Profile speichern und direkt bewerben.
                </p>
                <ul className="mt-8 space-y-3 text-[14px] leading-6 text-ink">
                  {[
                    "Unbegrenzte Suche",
                    "Alles aus Gratis",
                    "Profile speichern",
                    "Direkt bewerben",
                  ].map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <WaitlistForm stacked />
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="mt-1 shrink-0 text-ink"
      aria-hidden
    >
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
