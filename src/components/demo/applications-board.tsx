"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { inboxReplyFor, MAIL_DECISION_LABEL, mailDecisionClass } from "@/lib/demo/inbox";
import { demoJobById } from "@/lib/demo/jobs";
import { paths } from "@/lib/demo/paths";
import {
  upsertApplication,
  useDemo,
  type ApplicationStatus,
  type DemoApplication,
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

function followUpLabel(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function ApplicationsBoard() {
  const demo = useDemo();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<ApplicationStatus | null>(null);
  const grouped = useMemo(() => {
    return STAGES.map((stage) => ({
      ...stage,
      items: demo.applications.filter((item) => item.status === stage.id),
    }));
  }, [demo.applications]);

  function moveCard(jobId: string, status: ApplicationStatus) {
    const current = demo.applications.find((item) => item.jobId === jobId);
    if (!current || current.status === status) return;
    upsertApplication(jobId, { status });
  }

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
          Drag a card into another column to update its status.
        </DemoBanner>
      </div>

      {demo.applications.length === 0 ? (
        <p className="mt-10 text-[15px] text-body">
          No applications yet. Open a job and click Prepare application.
        </p>
      ) : (
        <div className="mt-6 -mx-5 overflow-x-auto px-5 pb-2 md:-mx-8 md:px-8">
          <div className="flex min-h-[440px] w-max gap-3">
            {grouped.map((column) => (
              <section
                key={column.id}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (overStage !== column.id) setOverStage(column.id);
                }}
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOverStage((current) => (current === column.id ? null : current));
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const jobId = event.dataTransfer.getData("text/plain") || draggingId;
                  if (jobId) moveCard(jobId, column.id);
                  setDraggingId(null);
                  setOverStage(null);
                }}
                className={`flex w-[250px] shrink-0 flex-col rounded-xl p-2 ${
                  overStage === column.id ? "bg-accent-soft" : "bg-surface-faint ring-1 ring-hairline-soft"
                }`}
              >
                <header className="flex items-center justify-between px-2 py-1.5">
                  <h2 className="text-[13px] font-medium text-ink">{column.label}</h2>
                  <span className="text-[12px] text-muted">{column.items.length}</span>
                </header>
                <ul className="mt-1 flex flex-1 flex-col gap-2">
                  {column.items.map((item) => (
                    <KanbanCard
                      key={item.jobId}
                      item={item}
                      showMail={demo.inbox.connected}
                      dragging={draggingId === item.jobId}
                      onDragStart={() => setDraggingId(item.jobId)}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setOverStage(null);
                      }}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function KanbanCard({
  item,
  showMail,
  dragging,
  onDragStart,
  onDragEnd,
}: {
  item: DemoApplication;
  showMail: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  const listing = demoJobById(item.jobId);
  if (!listing) return null;
  const followUp = followUpLabel(item.followUp);
  const reply = showMail ? inboxReplyFor(item.jobId) : null;

  return (
    <li
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/plain", item.jobId);
        event.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className={`cursor-grab rounded-lg bg-surface px-3 py-3 shadow-sm ring-1 ring-hairline-soft active:cursor-grabbing ${
        dragging ? "opacity-50" : ""
      }`}
    >
      <Link href={paths.savedJob(item.jobId)} className="text-[14px] font-medium text-ink hover:underline">
        {listing.title}
      </Link>
      <p className="mt-1 text-[12px] text-body">{listing.company}</p>
      {reply ? (
        <p className="mt-2">
          <span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${mailDecisionClass(reply.decision)}`}>
            {MAIL_DECISION_LABEL[reply.decision]}
          </span>
        </p>
      ) : null}
      <p className="mt-2 text-[12px] text-muted">
        {listing.location}
        {followUp ? ` · Follow up ${followUp}` : ""}
      </p>
    </li>
  );
}
