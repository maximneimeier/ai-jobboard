"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { DocumentPreview } from "@/components/landing/document-preview";
import {
  buildApplication,
  readApplication,
  readApplications,
  readApplicationsSnapshot,
  resolveJobSource,
  subscribeApplications,
  writeApplication,
} from "@/lib/applications";
import { downloadApplicationPdf } from "@/lib/pdf";
import { EMPTY_PROFILE, readProfile, subscribeProfile } from "@/lib/profile";

type Tab = "cv" | "letter";

export function ApplicationEditor({ jobId }: { jobId: string }) {
  const applications = useSyncExternalStore(
    subscribeApplications,
    readApplications,
    readApplicationsSnapshot,
  );
  const profile = useSyncExternalStore(
    subscribeProfile,
    readProfile,
    () => EMPTY_PROFILE,
  );
  const stored = applications.find((item) => item.jobId === jobId) ?? null;
  const source = useMemo(() => resolveJobSource(jobId), [jobId, stored]);
  const [tab, setTab] = useState<Tab>("cv");
  const [cv, setCv] = useState(stored?.cv ?? "");
  const [letter, setLetter] = useState(stored?.letter ?? "");
  const [busy, setBusy] = useState(!stored);
  const [note, setNote] = useState("");
  const skipSave = useRef(true);

  useEffect(() => {
    const current = readApplication(jobId);
    if (current) {
      setCv(current.cv);
      setLetter(current.letter);
      setBusy(false);
      return;
    }
    const nextSource = resolveJobSource(jobId);
    if (!nextSource) {
      setBusy(false);
      return;
    }
    let cancelled = false;
    buildApplication(nextSource)
      .then((docs) => {
        if (cancelled) return;
        skipSave.current = true;
        setCv(docs.cv);
        setLetter(docs.letter);
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    if (!cv && !letter) return;
    const timer = window.setTimeout(() => {
      writeApplication(jobId, { cv, letter });
      setNote("Gespeichert.");
    }, 400);
    return () => window.clearTimeout(timer);
  }, [cv, letter, jobId]);

  async function regenerate() {
    if (!source) return;
    setBusy(true);
    setNote("");
    try {
      const docs = await buildApplication(source, { replace: true });
      skipSave.current = true;
      setCv(docs.cv);
      setLetter(docs.letter);
      setNote("Neu erzeugt. Du kannst den Text weiter anpassen.");
    } finally {
      setBusy(false);
    }
  }

  function exportPdf() {
    if (!source) return;
    writeApplication(jobId, { cv, letter });
    downloadApplicationPdf({
      name: profile.name.trim() || "Profil",
      company: source.company,
      role: source.role,
      cv,
      letter,
    });
    setNote("PDF liegt in den Downloads.");
  }

  if (!source && !stored) {
    return (
      <section className="flex-1 bg-canvas">
        <div className="mx-auto w-full max-w-[1080px] px-5 py-16 md:px-8 md:py-20">
          <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
            Bewerbung
          </p>
          <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
            Stelle nicht gefunden.
          </h1>
          <Link
            href="/gemerkt"
            className="mt-6 inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-ink ring-1 ring-hairline"
          >
            Zur Liste
          </Link>
        </div>
      </section>
    );
  }

  const value = tab === "cv" ? cv : letter;
  const setValue = tab === "cv" ? setCv : setLetter;

  return (
    <section className="flex-1 bg-canvas">
      <div className="mx-auto w-full max-w-[1080px] px-5 py-10 md:px-8 md:py-14">
        <div className="no-print flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/gemerkt"
              className="text-[13px] font-medium tracking-[-0.16px] text-ink"
            >
              Zurück zur Liste
            </Link>
            <p className="mt-4 text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              Bewerbung
            </p>
            <h1 className="font-display mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
              {source?.role ?? "Bewerbung"}
            </h1>
            <p className="mt-2 text-[15px] text-body">
              {source
                ? `${source.company} · ${source.city}`
                : "Lebenslauf und Anschreiben"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={regenerate}
              disabled={busy || !source}
              className="inline-flex h-10 items-center rounded-md px-3 text-[14px] font-medium text-ink ring-1 ring-hairline disabled:opacity-50"
            >
              Neu erzeugen
            </button>
            <button
              type="button"
              onClick={exportPdf}
              disabled={busy}
              className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] font-medium tracking-[-0.16px] text-white disabled:opacity-50"
            >
              Als PDF
            </button>
          </div>
        </div>

        <div className="no-print mt-8 flex gap-2">
          <TabButton active={tab === "cv"} onClick={() => setTab("cv")}>
            Lebenslauf
          </TabButton>
          <TabButton active={tab === "letter"} onClick={() => setTab("letter")}>
            Anschreiben
          </TabButton>
        </div>

        {busy ? (
          <p className="mt-8 text-[14px] text-body">Texte werden erzeugt…</p>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="no-print block">
              <span className="sr-only">
                {tab === "cv" ? "Lebenslauf bearbeiten" : "Anschreiben bearbeiten"}
              </span>
              <textarea
                value={value}
                onChange={(event) => {
                  setNote("");
                  setValue(event.target.value);
                }}
                rows={22}
                className="min-h-[640px] w-full resize-y rounded-lg px-4 py-4 text-[14px] leading-6 tracking-[-0.16px] text-ink ring-1 ring-hairline outline-none focus:ring-ink"
              />
            </label>
            <DocumentPreview text={value} titled={tab === "cv"} />
          </div>
        )}

        <p className="no-print mt-4 text-[13px] text-muted">
          {note || "Links schreiben, rechts die Vorschau. Speichert von selbst."}
        </p>
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "inline-flex h-9 items-center rounded-md bg-ink px-3 text-[13px] font-medium text-white"
          : "inline-flex h-9 items-center rounded-md px-3 text-[13px] font-medium text-ink ring-1 ring-hairline"
      }
    >
      {children}
    </button>
  );
}
