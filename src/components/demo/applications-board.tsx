"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { demoJobById } from "@/lib/demo/jobs";
import {
  upsertApplication,
  useDemo,
  type ApplicationStatus,
} from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";

const STAGES: { id: ApplicationStatus; label: string }[] = [
  { id: "interested", label: "Interested" },
  { id: "preparing", label: "Preparing" },
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];

export function ApplicationsBoard() {
  const demo = useDemo();
  const [openId, setOpenId] = useState<string | null>(null);
  const grouped = useMemo(() => {
    return STAGES.map((stage) => ({
      ...stage,
      items: demo.applications.filter((item) => item.status === stage.id),
    }));
  }, [demo.applications]);
  const selectedId = openId ?? demo.applications[0]?.jobId ?? null;
  const selected = demo.applications.find((item) => item.jobId === selectedId);
  const job = selected ? demoJobById(selected.jobId) : null;

  return (
    <div className="px-5 py-8 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Applications
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        Tracker
      </h1>
      <div className="mt-4 max-w-xl">
        <DemoBanner>
          Track status, notes, and follow-ups next to each role.
        </DemoBanner>
      </div>

      {demo.applications.length === 0 ? (
        <p className="mt-10 text-[15px] text-body">
          No applications yet. Open a job and click Prepare application.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {grouped.map((column) => (
              <section
                key={column.id}
                className="rounded-lg bg-surface p-3 ring-1 ring-hairline-soft"
              >
                <h2 className="px-1 text-[13px] font-medium text-ink">
                  {column.label} · {column.items.length}
                </h2>
                <ul className="mt-2 grid gap-2">
                  {column.items.map((item) => {
                    const listing = demoJobById(item.jobId);
                    if (!listing) return null;
                    return (
                      <li key={item.jobId}>
                        <button
                          type="button"
                          onClick={() => setOpenId(item.jobId)}
                          className="w-full rounded-md bg-canvas px-3 py-3 text-left ring-1 ring-hairline-soft"
                        >
                          <p className="text-[14px] font-medium text-ink">
                            {listing.title}
                          </p>
                          <p className="mt-1 text-[12px] text-muted">
                            {listing.company}
                          </p>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          {selected && job ? (
            <aside className="rounded-lg bg-surface p-5 ring-1 ring-hairline-soft">
              <p className="text-[12px] text-muted">Details</p>
              <h2 className="mt-1 text-[17px] font-medium text-ink">{job.title}</h2>
              <p className="mt-1 text-[14px] text-body">{job.company}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex text-[13px] text-ink underline"
                >
                  Open job
                </Link>
                <Link
                  href={`/konto/gemerkt/${job.id}`}
                  className="inline-flex text-[13px] text-ink underline"
                >
                  Resume and cover letter
                </Link>
              </div>
              <label className="mt-5 grid gap-1 text-[12px] font-medium text-muted">
                Status
                <select
                  value={selected.status}
                  onChange={(event) =>
                    upsertApplication(job.id, {
                      status: event.target.value as ApplicationStatus,
                    })
                  }
                  className="h-10 rounded-md bg-canvas px-3 text-[14px] text-ink ring-1 ring-hairline"
                >
                  {STAGES.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-4 grid gap-1 text-[12px] font-medium text-muted">
                Follow-up
                <input
                  type="date"
                  value={selected.followUp}
                  onChange={(event) =>
                    upsertApplication(job.id, { followUp: event.target.value })
                  }
                  className="h-10 rounded-md bg-canvas px-3 text-[14px] text-ink ring-1 ring-hairline"
                />
              </label>
              <label className="mt-4 grid gap-1 text-[12px] font-medium text-muted">
                Notes
                <textarea
                  value={selected.notes}
                  onChange={(event) =>
                    upsertApplication(job.id, { notes: event.target.value })
                  }
                  rows={5}
                  className="rounded-md bg-canvas px-3 py-2 text-[14px] text-ink ring-1 ring-hairline"
                />
              </label>
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}
