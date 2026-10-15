"use client";

import { FormEvent, useState } from "react";
import { COPILOT_PROMPTS, copilotReply, type CopilotMessage } from "@/lib/demo/copilot";
import { DemoBanner } from "./demo-banner";

export function CopilotChat() {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: "hello",
      role: "assistant",
      text: "Ask about fit, similar roles, or what to do next. Start with one of the prompts below.",
    },
  ]);
  const [input, setInput] = useState("");

  function ask(prompt: string) {
    const user: CopilotMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: prompt,
    };
    const assistant: CopilotMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: copilotReply(prompt),
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
    <div className="mx-auto flex min-h-[70vh] w-full max-w-[720px] flex-col px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Career Copilot
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        Career Copilot
      </h1>
      <div className="mt-4">
        <DemoBanner>
          Answers use your profile and the roles currently in your search.
        </DemoBanner>
      </div>
      <div className="mt-6 flex-1 space-y-4">
        {messages.map((item) => (
          <div
            key={item.id}
            className={item.role === "user" ? "flex justify-end" : ""}
          >
            <p
              className={
                item.role === "user"
                  ? "max-w-[85%] rounded-lg bg-ink px-4 py-3 text-[15px] leading-6 text-white"
                  : "max-w-[85%] rounded-lg bg-surface px-4 py-3 text-[15px] leading-6 text-ink ring-1 ring-hairline-soft"
              }
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {COPILOT_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => ask(prompt)}
            className="inline-flex h-9 items-center rounded-md px-3 text-[13px] ring-1 ring-hairline"
          >
            {prompt}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question"
          className="h-11 flex-1 rounded-md bg-surface px-3 text-[14px] ring-1 ring-hairline outline-none"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center rounded-md bg-ink px-4 text-[14px] text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}
