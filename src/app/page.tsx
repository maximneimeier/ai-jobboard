import { ProductPreview } from "@/components/landing/product-preview";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteNav } from "@/components/landing/site-nav";
import { WaitlistForm } from "@/components/landing/waitlist-form";

const logos = ["Linear", "Personio", "Pitch", "Trade Republic", "Celonis", "N26"];

const features = [
  {
    id: "produkt",
    eyebrow: "Chat",
    title: "Jobsuche wie in ChatGPT.",
    body: "Du schreibst, was du wirklich brauchst. Aria stellt Rückfragen, merkt sich den Kontext und sucht weiter — ohne dass du zehn Dropdowns klickst.",
    points: [
      "Natürliche Sprache statt Filter-Marathon",
      "Nachschärfen im Gespräch: Ort, Gehalt, Kultur, Stack",
      "Der Chat bleibt der Einstieg, nicht ein Extra",
    ],
  },
  {
    id: "treffer",
    eyebrow: "Filter",
    title: "Anforderungen, nicht Keywords.",
    body: "„Kein Konzern“, „starkes Design-Team“, „hybrid in Berlin“ sind keine Suchbegriffe. Aria übersetzt sie in echte Kriterien und schließt Rollen aus, die nur auf dem Papier passen.",
    points: [
      "Weiche Wünsche werden harte Filter",
      "Kultur, Teamgröße und Setup zählen mit",
      "Jeder Filter bleibt sichtbar und editierbar",
    ],
  },
];

const steps = [
  {
    n: "01",
    title: "Erzähl, was du suchst",
    body: "Rolle, Ort, Gehalt, Kultur — in normalen Sätzen. So wie du es einem Freund erklären würdest.",
  },
  {
    n: "02",
    title: "Aria filtert präzise",
    body: "Aus dem Gespräch werden klare Kriterien. Du siehst, was erkannt wurde, und kannst nachziehen.",
  },
  {
    n: "03",
    title: "Treffer mit Begründung",
    body: "Keine endlose Liste. Jede Rolle zeigt, warum sie passt — und wo sie nicht passt.",
  },
];

export default function Home() {
  return (
    <div id="top" className="flex min-h-full flex-col bg-canvas">
      <SiteNav />

      <main>
        <section className="hero-wash">
          <div className="mx-auto max-w-[920px] px-5 pt-20 pb-10 text-center md:pt-28">
            <a
              href="#produkt"
              className="inline-flex items-center gap-2 rounded-md bg-surface-soft px-3 py-2 text-[15px] font-medium tracking-[-0.16px] text-ink"
            >
              Neu: Jobsuche im Gespräch
              <span aria-hidden="true">›</span>
            </a>
            <h1 className="font-display mx-auto mt-7 max-w-[18ch] text-[40px] leading-none font-semibold tracking-[-0.04em] text-ink sm:text-[56px] sm:tracking-[-0.84px] lg:text-[64px] lg:tracking-[-1.28px]">
              Finde den Job, der wirklich zu dir passt.
            </h1>
            <p className="mx-auto mt-5 max-w-[52ch] text-[17px] leading-7 text-body">
              Sag, was du suchst. Aria versteht Anforderungen, filtert präzise
              und zeigt Treffer mit Begründung — nicht nur nach Keywords.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <a
                href="#start"
                className="inline-flex h-11 items-center rounded-md bg-ink px-4 text-[15px] font-medium tracking-[-0.16px] text-white hover:bg-ink-soft"
              >
                Frühzugang sichern
              </a>
              <a
                href="#so-funktionierts"
                className="inline-flex h-11 items-center rounded-md bg-canvas px-4 text-[15px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline"
              >
                So funktioniert’s
              </a>
            </div>
          </div>

          <div className="mx-auto max-w-[1080px] px-5 pb-8">
            <ProductPreview />
          </div>

          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 pt-6 pb-16">
            <p className="w-full text-center text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              Rollen aus Teams wie
            </p>
            {logos.map((logo) => (
              <span
                key={logo}
                className="text-[15px] font-medium tracking-[-0.16px] text-muted"
              >
                {logo}
              </span>
            ))}
          </div>
        </section>

        {features.map((feature, index) => (
          <section
            key={feature.id}
            id={feature.id}
            className={`scroll-mt-[84px] ${index % 2 === 1 ? "bg-surface-faint" : "bg-canvas"}`}
          >
            <div className="mx-auto grid max-w-[1080px] items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-8">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
                  {feature.eyebrow}
                </p>
                <h2 className="font-display mt-3 text-[32px] leading-[1.18] font-semibold tracking-[-0.32px] text-ink md:text-[40px] md:tracking-[-0.6px]">
                  {feature.title}
                </h2>
                <p className="mt-4 max-w-[46ch] text-[16px] leading-7 text-body">
                  {feature.body}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-[15px] tracking-[-0.16px] text-ink-soft"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-ink" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              {index === 0 ? <ChatPanel /> : <MatchPanel />}
            </div>
          </section>
        ))}

        <section id="so-funktionierts" className="scroll-mt-[84px] bg-canvas">
          <div className="mx-auto max-w-[1080px] px-5 py-24 md:px-8">
            <p className="text-center text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              Ablauf
            </p>
            <h2 className="font-display mx-auto mt-3 max-w-[16ch] text-center text-[36px] leading-[1.1] font-semibold tracking-[-0.6px] text-ink md:text-[48px]">
              Weniger suchen. Besser finden.
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <article
                  key={step.n}
                  className="rounded-lg bg-canvas p-6 ring-1 ring-hairline-soft"
                >
                  <p className="text-[12px] font-semibold tracking-[0.72px] text-muted">
                    {step.n}
                  </p>
                  <h3 className="font-display mt-4 text-[22px] leading-7 font-semibold tracking-[-0.32px]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-6 text-body">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-faint">
          <div className="mx-auto max-w-[1080px] px-5 py-24 md:px-8">
            <div className="grid items-start gap-10 md:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
                  Ausgabe
                </p>
                <h2 className="font-display mt-3 text-[36px] leading-[1.1] font-semibold tracking-[-0.6px] md:text-[48px]">
                  Treffer, die erklären, warum sie passen.
                </h2>
                <p className="mt-4 max-w-[48ch] text-[16px] leading-7 text-body">
                  Klassische Jobboards listen alles, was irgendein Keyword
                  enthält. Aria zeigt weniger Rollen — dafür mit Fit, Lücken und
                  einer Begründung, die du nachvollziehen kannst.
                </p>
              </div>
              <aside className="rounded-lg bg-canvas p-5 ring-1 ring-hairline-soft">
                <p className="text-[13px] font-medium text-ink">
                  Senior Product Designer · Linear
                </p>
                <p className="mt-1 text-[13px] text-body">
                  Berlin · Hybrid · 85–110k
                </p>
                <div className="mt-4 space-y-2 text-[13px] leading-5 text-body">
                  <p>
                    <span className="font-medium text-ink">Passt:</span>{" "}
                    Senior-Level, Hybrid in Berlin, Gehalt über 80k, kleines
                    Design-Team.
                  </p>
                  <p>
                    <span className="font-medium text-ink">Offen:</span>{" "}
                    Teamgröße unter 20 — bitte im Gespräch nachfragen.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="start" className="scroll-mt-[84px] bg-canvas">
          <div className="mx-auto max-w-[720px] px-5 py-24 text-center md:px-8">
            <h2 className="font-display text-[36px] leading-[1.1] font-semibold tracking-[-0.6px] text-ink md:text-[56px] md:tracking-[-0.84px]">
              Starte mit einem Satz.
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-[16px] leading-7 text-body">
              Aria ist in Vorbereitung. Trag dich ein — wir öffnen den Chat
              zuerst für eine kleine Runde.
            </p>
            <div className="mt-8 flex justify-center">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function ChatPanel() {
  return (
    <div className="rounded-lg bg-canvas p-4 ring-1 ring-hairline-soft">
      <div className="space-y-4">
        <div className="ml-auto max-w-[90%] rounded-[10px] bg-surface-soft px-3.5 py-3 text-[14px] leading-5 text-ink-soft">
          Remote, 4-Tage-Woche, Backend in Go, Team in DACH, kein On-Call.
        </div>
        <div>
          <p className="text-[12px] font-medium text-muted">Aria</p>
          <p className="mt-1.5 text-[14px] leading-6 text-ink-soft">
            Ich filtere auf Remote in DACH, 4-Tage-Woche, Go, ohne Bereitschaft.
            14 Rollen fallen raus, weil On-Call Pflicht ist.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Remote", "DACH", "Go", "4 Tage", "kein On-Call"].map((chip) => (
            <span
              key={chip}
              className="rounded-[6px] bg-surface-faint px-2 py-1 text-[12px] font-medium ring-1 ring-hairline-soft"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatchPanel() {
  return (
    <div className="space-y-3">
      {[
        {
          title: "Staff Engineer · Polar",
          note: "Passt: Remote, Go, keine Bereitschaft, 4-Tage-Option.",
          score: "94%",
        },
        {
          title: "Backend Engineer · Scale-up",
          note: "Teilweise: Go und Remote. On-Call rotiert alle 6 Wochen.",
          score: "61%",
        },
      ].map((item) => (
        <article
          key={item.title}
          className="rounded-lg bg-canvas p-4 ring-1 ring-hairline-soft"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-[15px] font-medium tracking-[-0.16px]">
              {item.title}
            </p>
            <span className="rounded-[6px] bg-surface-soft px-1.5 py-0.5 text-[12px] font-medium">
              {item.score}
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-5 text-body">{item.note}</p>
        </article>
      ))}
    </div>
  );
}
