"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DocumentPreview } from "@/components/landing/document-preview";
import { generateDemoApplication } from "@/lib/demo/application";
import { demoJobById } from "@/lib/demo/jobs";
import { paths } from "@/lib/demo/paths";
import { downloadApplicationPdf } from "@/lib/pdf";
import { upsertApplication, useDemo } from "@/lib/demo/store";

type Tab = "cv" | "letter";

export function ApplicationEditor({ jobId }: { jobId: string }) {
  const demo = useDemo();
  const job = demoJobById(jobId);
  const stored = demo.applications.find((item) => item.jobId === jobId) ?? null;
  const [tab, setTab] = useState<Tab>("cv");
  const [cv, setCv] = useState(stored?.cv ?? "");
  const [letter, setLetter] = useState(stored?.letter ?? "");
  const [busy, setBusy] = useState(!stored?.cv && !stored?.letter);
  const [note, setNote] = useState("");
  const skipSave = useRef(true);

  useEffect(() => {
    if (!job) {
      setBusy(false);
      return;
    }
    const existing = stored;
    if (existing?.cv || existing?.letter) {
      setCv(existing.cv);
      setLetter(existing.letter);
      setBusy(false);
      return;
    }
    const generated = generateDemoApplication(job, demo.profile);
    skipSave.current = true;
    setCv(generated.cv);
    setLetter(generated.letter);
    upsertApplication(job.id, {
      status: existing?.status ?? "preparing",
      cv: generated.cv,
      letter: generated.letter,
    });
    setBusy(false);
    // Seed once per job so later saves do not rewrite the editor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    if (!job || (!cv && !letter)) return;
    const timer = window.setTimeout(() => {
      upsertApplication(job.id, { cv, letter, status: stored?.status ?? "preparing" });
      setNote("Saved.");
    }, 400);
    return () => window.clearTimeout(timer);
  }, [cv, job, letter, stored?.status]);

  function regenerate() {
    if (!job) return;
    setBusy(true);
    setNote("");
    const generated = generateDemoApplication(job, demo.profile);
    skipSave.current = true;
    setCv(generated.cv);
    setLetter(generated.letter);
    upsertApplication(job.id, {
      status: stored?.status ?? "preparing",
      cv: generated.cv,
      letter: generated.letter,
    });
    setNote("Regenerated. You can keep editing the text.");
    setBusy(false);
  }

  function exportPdf() {
    if (!job) return;
    upsertApplication(job.id, { cv, letter, status: stored?.status ?? "preparing" });
    downloadApplicationPdf({
      name: demo.profile?.fullName.trim() || "Profile",
      company: job.company,
      role: job.title,
      cv,
      letter,
    });
    setNote("PDF saved to your downloads.");
  }

  if (!job) {
    return (
      <section className="flex-1 bg-canvas">
        <div className="mx-auto w-full max-w-[1080px] px-5 py-16 md:px-8 md:py-20">
          <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
            Application
          </p>
          <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
            Job not found.
          </h1>
          <Link
            href={paths.saved}
            className="mt-6 inline-flex h-10 items-center rounded-md px-4 text-[14px] font-medium text-ink ring-1 ring-hairline"
          >
            Back to saved jobs
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
              href={paths.saved}
              className="text-[13px] font-medium tracking-[-0.16px] text-ink"
            >
              Back to saved jobs
            </Link>
            <p className="mt-4 text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
              Application
            </p>
            <h1 className="font-display mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
              {job.title}
            </h1>
            <p className="mt-2 text-[15px] text-body">
              {job.company} · {job.location}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={regenerate}
              disabled={busy}
              className="inline-flex h-10 items-center rounded-md px-3 text-[14px] font-medium text-ink ring-1 ring-hairline disabled:opacity-50"
            >
              Regenerate
            </button>
            <button
              type="button"
              onClick={exportPdf}
              disabled={busy}
              className="inline-flex h-10 items-center rounded-md bg-ink px-4 text-[14px] font-medium tracking-[-0.16px] text-white disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="no-print mt-8 flex gap-2">
          <TabButton active={tab === "cv"} onClick={() => setTab("cv")}>
            Resume
          </TabButton>
          <TabButton active={tab === "letter"} onClick={() => setTab("letter")}>
            Cover letter
          </TabButton>
        </div>

        {busy ? (
          <p className="mt-8 text-[14px] text-body">Preparing your documents…</p>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="no-print block">
              <span className="sr-only">
                {tab === "cv" ? "Edit resume" : "Edit cover letter"}
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
          {note || "Edit on the left. The preview updates as you type, and it saves automatically."}
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
