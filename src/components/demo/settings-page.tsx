"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { demoJobById } from "@/lib/demo/jobs";
import {
  INBOX_REPLIES,
  MAIL_DECISION_LABEL,
  mailDecisionClass,
} from "@/lib/demo/inbox";
import {
  clearPassedJobs,
  connectInbox,
  disconnectInbox,
  resetDemo,
  setEmail,
  setPreferences,
  setSort,
  signOut,
  useDemo,
  type DemoSort,
} from "@/lib/demo/store";

export function SettingsPage() {
  const demo = useDemo();
  const router = useRouter();
  const [email, setEmailDraft] = useState(demo.email);
  const [savedNote, setSavedNote] = useState("");
  const passed = demo.jobFeedback.filter((item) => item.action === "not_interested").length;

  useEffect(() => {
    setEmailDraft(demo.email);
  }, [demo.email]);

  function onEmail(event: FormEvent) {
    event.preventDefault();
    setEmail(email);
    setSavedNote("Email saved on this browser.");
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Settings
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        How this workspace behaves.
      </h1>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-6 text-body">
        Search order, alerts, your inbox, and what stays hidden. Everything here is
        stored in this browser.
      </p>

      <Section title="Account" hint="Shown in the sidebar and on alerts.">
        <form noValidate onSubmit={onEmail} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-1.5 text-[13px] font-medium text-ink">
            Email
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmailDraft(event.target.value);
                setSavedNote("");
              }}
              placeholder="you@email.com"
              className="h-11 rounded-md bg-canvas px-3 text-[14px] font-normal text-ink ring-1 ring-hairline outline-none focus:ring-2 focus:ring-accent"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-4 text-[14px] text-white"
          >
            Save email
          </button>
        </form>
        {savedNote ? <p className="mt-3 text-[13px] text-muted">{savedNote}</p> : null}
        <button
          type="button"
          onClick={() => {
            signOut();
            router.push("/");
          }}
          className="mt-5 inline-flex h-11 items-center rounded-md px-4 text-[14px] text-ink ring-1 ring-hairline"
        >
          Sign out
        </button>
      </Section>

      <Section title="Search" hint="Used the next time you open Discover jobs.">
        <label className="grid max-w-[240px] gap-1.5 text-[13px] font-medium text-ink">
          Default sort
          <select
            value={demo.sort}
            onChange={(event) => setSort(event.target.value as DemoSort)}
            className="h-11 rounded-md bg-canvas px-3 text-[14px] font-normal ring-1 ring-hairline outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="relevant">Most relevant</option>
            <option value="recent">Most recent</option>
            <option value="salary">Salary</option>
          </select>
        </label>
        <Toggle
          on={demo.preferences.hidePassedJobs}
          label="Hide jobs you passed on"
          hint="Roles marked not interested stay off Discover jobs until you show them again."
          onChange={(hidePassedJobs) => setPreferences({ hidePassedJobs })}
        />
      </Section>

      <Section title="Alerts" hint="Does not delete the searches on the Job alerts page.">
        <Toggle
          on={demo.preferences.emailAlerts}
          label="Email me about new matches"
          hint="When this is off, saved searches stay, and new-match mail stays quiet."
          onChange={(emailAlerts) => setPreferences({ emailAlerts })}
        />
      </Section>

      <Section
        title="Inbox"
        hint="Offers and rejections from this mailbox show on Saved jobs and Applications."
      >
        <InboxConnection />
      </Section>

      <Section title="Data on this browser" hint="Profile, saved jobs, and applications included.">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={passed === 0}
            onClick={() => clearPassedJobs()}
            className="inline-flex h-11 items-center rounded-md px-4 text-[14px] text-ink ring-1 ring-hairline disabled:text-muted"
          >
            {passed ? `Show ${passed} hidden ${passed === 1 ? "job" : "jobs"}` : "No hidden jobs"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetDemo();
              router.push("/");
            }}
            className="inline-flex h-11 items-center rounded-md px-4 text-[14px] text-ink ring-1 ring-hairline"
          >
            Clear saved data
          </button>
        </div>
      </Section>
    </div>
  );
}

function InboxConnection() {
  const demo = useDemo();
  const address = demo.email.trim();
  const replies = INBOX_REPLIES.filter(
    (reply) =>
      demo.savedIds.includes(reply.jobId) ||
      demo.applications.some((item) => item.jobId === reply.jobId),
  );

  if (!demo.inbox.connected) {
    return (
      <div>
        <p className="text-[14px] text-body">
          {address
            ? `Connect ${address}. This demo matches sample replies to roles you saved or applied for. No password is stored.`
            : "Save an email in Account first. Connecting never asks for a mailbox password."}
        </p>
        <button
          type="button"
          disabled={!address}
          onClick={() => connectInbox()}
          className="mt-4 inline-flex h-11 items-center rounded-md bg-ink px-4 text-[14px] text-white disabled:bg-hairline disabled:text-muted"
        >
          Connect inbox
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-[14px] text-ink">Connected · {demo.inbox.address}</p>
      {replies.length === 0 ? (
        <p className="mt-3 text-[14px] text-body">No replies matched your saved jobs yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-hairline-soft">
          {replies.map((reply) => {
            const job = demoJobById(reply.jobId);
            const when = new Date(`${reply.receivedOn}T00:00:00`).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            });
            return (
              <li key={reply.jobId} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="text-[14px] font-medium text-ink">
                    {job ? `${job.title} · ${job.company}` : reply.subject}
                  </p>
                  <p className="mt-1 text-[13px] text-body">
                    {reply.subject} · {when}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-medium ${mailDecisionClass(reply.decision)}`}
                >
                  {MAIL_DECISION_LABEL[reply.decision]}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <button
        type="button"
        onClick={() => disconnectInbox()}
        className="mt-4 inline-flex h-11 items-center rounded-md px-4 text-[14px] text-ink ring-1 ring-hairline"
      >
        Disconnect
      </button>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 rounded-xl bg-surface p-5 ring-1 ring-hairline-soft">
      <h2 className="text-[16px] font-medium text-ink">{title}</h2>
      <p className="mt-1 text-[13px] leading-5 text-body">{hint}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Toggle({
  on,
  label,
  hint,
  onChange,
}: {
  on: boolean;
  label: string;
  hint: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="mt-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-[14px] font-medium text-ink">{label}</p>
        <p className="mt-1 max-w-[46ch] text-[13px] leading-5 text-body">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={
          on
            ? "relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-ink"
            : "relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-hairline"
        }
      >
        <span
          className={
            on
              ? "absolute top-0.5 left-5 size-5 rounded-full bg-white"
              : "absolute top-0.5 left-0.5 size-5 rounded-full bg-white"
          }
        />
      </button>
    </div>
  );
}
