"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { matchBrowseJobs, readingFromFile, type BrowseJob } from "@/lib/demo/browse";

type Bubble =
  | { id: string; kind: "text"; role: "user" | "assistant"; text: string }
  | { id: string; kind: "jobs"; jobs: BrowseJob[] };

const OPENING =
  "No account needed. Describe your experience, skills, and where you want to work, or attach a CV. I will pick roles from this board.";

const PROMPTS = [
  "4 years of React and TypeScript, open to Berlin and remote",
  "Product manager in healthcare, London",
  "I work on night trains and operations in Vienna",
];

export function BrowseChat() {
  const [messages, setMessages] = useState<Bubble[]>([
    { id: "hello", kind: "text", role: "assistant", text: OPENING },
  ]);
  const [input, setInput] = useState("");
  const [reading, setReading] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const started = messages.some((item) => item.kind === "text" && item.role === "user");

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTop = thread.scrollHeight;
  }, [messages, reading]);

  function replyTo(source: string, userText: string) {
    const jobs = matchBrowseJobs(source);
    const note = jobs.length
      ? `I picked ${jobs.length} ${jobs.length === 1 ? "role" : "roles"} from what you shared.`
      : "I need a role, a skill, or a city before I can pick anything. Try React in Berlin, or product work in London.";
    const next: Bubble[] = [
      { id: `u-${Date.now()}`, kind: "text", role: "user", text: userText },
      { id: `a-${Date.now()}`, kind: "text", role: "assistant", text: note },
    ];
    if (jobs.length) next.push({ id: `j-${Date.now()}`, kind: "jobs", jobs });
    setMessages((current) => [...current, ...next]);
  }

  function onSubmit(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || reading) return;
    setInput("");
    replyTo(text, text);
  }

  async function onFile(file?: File) {
    if (!file || reading) return;
    setReading(true);
    const text =
      file.type.startsWith("text") || /\.(txt|md|csv)$/i.test(file.name) ? await file.text() : "";
    const readingText = readingFromFile(file.name, text);
    setReading(false);
    const jobs = matchBrowseJobs(readingText);
    const note = jobs.length
      ? `I read ${file.name}. Used this: ${readingText}`
      : `I read ${file.name}, but it did not point at a role, a skill, or a city.`;
    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, kind: "text", role: "user", text: `CV · ${file.name}` },
      { id: `a-${Date.now()}`, kind: "text", role: "assistant", text: note },
      ...(jobs.length
        ? [{ id: `j-${Date.now()}`, kind: "jobs" as const, jobs }]
        : []),
    ]);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4">
          {messages.map((item) => {
            if (item.kind === "jobs") {
              return (
                <ul key={item.id} className="ml-9 grid gap-2">
                  {item.jobs.map((job) => (
                    <li key={job.id} className="rounded-xl bg-surface px-4 py-3 ring-1 ring-hairline-soft">
                      <p className="text-[15px] font-medium text-ink">{job.title}</p>
                      <p className="mt-1 text-[13px] text-body">
                        {job.company} · {job.place} · {job.mode} · {job.salary}
                      </p>
                      <p className="mt-2 text-[14px] leading-6 text-body">{job.summary}</p>
                    </li>
                  ))}
                </ul>
              );
            }
            if (item.role === "assistant") {
              return (
                <div key={item.id} className="flex items-end gap-2.5">
                  <span className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                    <Sparkles className="size-3.5" strokeWidth={1.75} />
                  </span>
                  <p className="max-w-[min(100%,38rem)] rounded-2xl rounded-bl-md bg-surface px-4 py-3 text-[15px] leading-6 text-ink ring-1 ring-hairline-soft">
                    {item.text}
                  </p>
                </div>
              );
            }
            return (
              <div key={item.id} className="flex items-end justify-end gap-2.5">
                <p className="max-w-[min(100%,32rem)] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[15px] leading-6 text-white">
                  {item.text}
                </p>
              </div>
            );
          })}
          {reading ? (
            <p className="ml-9 text-[14px] text-muted">Reading the file…</p>
          ) : null}
        </div>
      </div>

      <div className="shrink-0 border-t border-hairline-soft bg-surface px-4 py-3 md:px-6">
        <div className="mx-auto w-full max-w-[760px]">
          {started ? null : (
            <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1">
              {PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => replyTo(prompt, prompt)}
                  className="inline-flex h-8 shrink-0 items-center rounded-full bg-canvas px-3 text-[13px] text-ink ring-1 ring-hairline hover:bg-surface-faint"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
          <form
            noValidate
            onSubmit={onSubmit}
            className="flex items-end gap-2 rounded-2xl bg-canvas px-2 py-2 ring-1 ring-hairline focus-within:ring-2 focus-within:ring-accent"
          >
            <label className="mb-0.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-surface hover:text-ink">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach a CV</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md"
                className="hidden"
                onChange={(event) => {
                  void onFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            <label className="sr-only" htmlFor="browse-input">
              Describe your experience
            </label>
            <textarea
              id="browse-input"
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  onSubmit();
                }
              }}
              placeholder="Experience, skills, city…"
              className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-[15px] text-ink outline-none placeholder:text-muted-soft"
            />
            <button
              type="submit"
              disabled={!input.trim() || reading}
              aria-label="Send"
              className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white disabled:bg-hairline disabled:text-muted"
            >
              <ArrowUp className="size-4" />
            </button>
          </form>
          <p className="mt-2 text-[12px] text-muted">
            A PDF uses the file name for this demo. A text file uses what is written in it.{" "}
            <Link href="/signup" className="text-ink underline">
              Create an account
            </Link>{" "}
            to save roles and track them.
          </p>
        </div>
      </div>
    </div>
  );
}
