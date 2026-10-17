"use client";

import Link from "next/link";
import { inboxReplyFor, MAIL_DECISION_LABEL, mailDecisionClass } from "@/lib/demo/inbox";
import { demoJobById } from "@/lib/demo/jobs";
import { WORK_MODE_LABEL, salaryLabel } from "@/lib/demo/match";
import { paths } from "@/lib/demo/paths";
import {
  removeApplication,
  toggleSave,
  upsertApplication,
  useDemo,
  type ApplicationStatus,
} from "@/lib/demo/store";

const TRACKER_OPTIONS: { id: ApplicationStatus | "saved"; label: string }[] = [
  { id: "saved", label: "Saved" },
  { id: "interested", label: "Interested" },
  { id: "preparing", label: "Preparing" },
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];

export function SavedBoard() {
  const demo = useDemo();
  const jobs = demo.savedIds.map(demoJobById).filter((job) => job != null);

  return (
    <div className="mx-auto w-full max-w-[1080px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Saved
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        Your jobs.
      </h1>
      <p className="mt-2 text-[14px] text-body">
        {jobs.length} {jobs.length === 1 ? "saved role" : "saved roles"}
      </p>
      {jobs.length === 0 ? (
        <p className="mt-8 text-[15px] text-body">
          Nothing saved yet.{" "}
          <Link href="/jobs" className="text-ink underline">
            Discover jobs
          </Link>
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl bg-surface ring-1 ring-hairline-soft">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline-soft text-[11px] font-medium tracking-[0.06em] text-muted uppercase">
                <th className="px-3 py-3 font-medium">Role</th>
                <th className="px-3 py-3 font-medium">Company</th>
                <th className="px-3 py-3 font-medium">Location</th>
                <th className="px-3 py-3 font-medium">Salary</th>
                <th className="px-3 py-3 font-medium">Tracker</th>
                <th className="px-3 py-3 font-medium">Inbox</th>
                <th className="px-3 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const application = demo.applications.find((item) => item.jobId === job.id);
                return (
                  <tr key={job.id} className="border-b border-hairline-soft last:border-b-0">
                    <td className="px-3 py-3 align-middle whitespace-nowrap">
                      <Link href={`${paths.job(job.id)}?from=saved`} className="text-[14px] font-medium text-ink hover:underline">
                        {job.title}
                      </Link>
                    </td>
                    <td className="px-3 py-3 align-middle text-[14px] whitespace-nowrap text-body">{job.company}</td>
                    <td className="px-3 py-3 align-middle text-[14px] whitespace-nowrap text-body">
                      {job.location.toLowerCase() === WORK_MODE_LABEL[job.workMode].toLowerCase()
                        ? job.location
                        : `${job.location} · ${WORK_MODE_LABEL[job.workMode]}`}
                    </td>
                    <td className="px-3 py-3 align-middle text-[14px] whitespace-nowrap text-ink">{salaryLabel(job)}</td>
                    <td className="px-3 py-3 align-middle whitespace-nowrap">
                      <select
                        aria-label={`Tracker status for ${job.title} at ${job.company}`}
                        value={application?.status ?? "saved"}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (next === "saved") {
                            removeApplication(job.id);
                            return;
                          }
                          upsertApplication(job.id, { status: next as ApplicationStatus });
                        }}
                        className="h-8 rounded-md bg-canvas pr-7 pl-2 text-[13px] text-ink ring-1 ring-hairline outline-none focus:ring-2 focus:ring-accent"
                      >
                        {TRACKER_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 align-middle whitespace-nowrap">
                      <InboxCell connected={demo.inbox.connected} jobId={job.id} />
                    </td>
                    <td className="px-3 py-3 align-middle">
                      <div className="flex justify-end gap-3 whitespace-nowrap">
                        <Link
                          href={paths.savedJob(job.id)}
                          className="text-[13px] font-medium text-ink hover:underline"
                        >
                          Prepare
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleSave(job.id)}
                          className="text-[13px] text-muted hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InboxCell({ connected, jobId }: { connected: boolean; jobId: string }) {
  if (!connected) return <span className="text-[13px] text-muted">Not connected</span>;
  const reply = inboxReplyFor(jobId);
  if (!reply) return <span className="text-[13px] text-muted">No reply</span>;
  return (
    <span className={`rounded-full px-2 py-0.5 text-[12px] font-medium ${mailDecisionClass(reply.decision)}`}>
      {MAIL_DECISION_LABEL[reply.decision]}
    </span>
  );
}
