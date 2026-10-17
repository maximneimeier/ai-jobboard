"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import {
  copilotPrompts,
  copilotReply,
  openingMessage,
  type CopilotMessage,
} from "@/lib/demo/copilot";
import { useDemo } from "@/lib/demo/store";

export function CopilotChat() {
  const demo = useDemo();
  const ctx = useMemo(
    () => ({
      profile: demo.profile,
      savedIds: demo.savedIds,
      applications: demo.applications,
      roleTags: demo.roleTags,
      locationTags: demo.locationTags,
    }),
    [demo.applications, demo.locationTags, demo.profile, demo.roleTags, demo.savedIds],
  );
  const prompts = useMemo(() => copilotPrompts(ctx), [ctx]);
  const [messages, setMessages] = useState<CopilotMessage[]>(() => [
    {
      id: "hello",
      role: "assistant",
      text: openingMessage(ctx),
    },
  ]);
  const [input, setInput] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const you = demo.profile?.fullName.trim().slice(0, 1).toUpperCase() || "Y";

  useEffect(() => {
    setMessages((current) => {
      if (current.length !== 1 || current[0]?.id !== "hello") return current;
      return [{ id: "hello", role: "assistant", text: openingMessage(ctx) }];
    });
  }, [ctx]);

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTop = thread.scrollHeight;
  }, [messages]);

  function ask(prompt: string) {
    const user: CopilotMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: prompt,
    };
    const assistant: CopilotMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: copilotReply(prompt, ctx),
    };
    setMessages((current) => [...current, user, assistant]);
    setInput("");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    ask(text);
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-canvas">
      <header className="flex shrink-0 items-center gap-3 border-b border-hairline-soft bg-surface px-5 py-3.5 md:px-6">
        <span className="flex size-9 items-center justify-center rounded-full bg-ink text-white">
          <Sparkles className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <h1 className="text-[15px] font-medium text-ink">Career Copilot</h1>
          <p className="truncate text-[12px] text-muted">
            Profile, saved jobs, and your applications
          </p>
        </div>
      </header>

      <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-6">
        <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4">
          {messages.map((item) =>
            item.role === "assistant" ? (
              <div key={item.id} className="flex items-end gap-2.5">
                <span className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <Sparkles className="size-3.5" strokeWidth={1.75} />
                </span>
                <p className="max-w-[min(100%,38rem)] rounded-2xl rounded-bl-md bg-surface px-4 py-3 text-[15px] leading-6 text-ink ring-1 ring-hairline-soft">
                  {item.text}
                </p>
              </div>
            ) : (
              <div key={item.id} className="flex items-end justify-end gap-2.5">
                <p className="max-w-[min(100%,32rem)] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[15px] leading-6 text-white">
                  {item.text}
                </p>
                <span className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-canvas text-[12px] font-medium text-ink ring-1 ring-hairline">
                  {you}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-hairline-soft bg-surface px-4 py-3 md:px-6">
        <div className="mx-auto w-full max-w-[760px]">
          <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => ask(prompt)}
                className="inline-flex h-8 shrink-0 items-center rounded-full bg-canvas px-3 text-[13px] text-ink ring-1 ring-hairline hover:bg-surface-faint"
              >
                {prompt}
              </button>
            ))}
          </div>
          <form
            noValidate
            onSubmit={onSubmit}
            className="flex items-end gap-2 rounded-2xl bg-canvas px-2 py-2 ring-1 ring-hairline focus-within:ring-2 focus-within:ring-accent"
          >
            <label className="sr-only" htmlFor="copilot-input">
              Message
            </label>
            <textarea
              id="copilot-input"
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  const text = input.trim();
                  if (text) ask(text);
                }
              }}
              placeholder="Message Career Copilot"
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-6 text-ink outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-white disabled:opacity-30"
            >
              <ArrowUp className="size-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
