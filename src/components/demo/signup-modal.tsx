"use client";

import { FormEvent, useState } from "react";
import { completeSignup, dismissSignup } from "@/lib/demo/store";

export function SignupModal({
  open,
  onDone,
}: {
  open: boolean;
  onDone?: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  function finish() {
    completeSignup(email.trim() || "alex@gmail.com");
    onDone?.();
    window.location.assign("/konto");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => finish(), 420);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/30 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-[0_16px_60px_rgba(0,0,0,0.12)] ring-1 ring-hairline">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Sign in
        </p>
        <h2 className="font-display mt-2 text-[24px] font-semibold tracking-[-0.32px] text-ink">
          Welcome back.
        </h2>
        <p className="mt-3 text-[15px] leading-6 text-body">
          Sign in with your email to save jobs and pick up where you left off.
        </p>
        <form noValidate onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label className="grid gap-1.5 text-[12px] font-medium text-muted">
            Email
            <input
              type="text"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              className="h-11 rounded-xl bg-canvas px-3.5 text-[15px] text-ink outline-none ring-1 ring-hairline placeholder:text-muted-soft focus:ring-2 focus:ring-accent"
            />
          </label>
          <label className="grid gap-1.5 text-[12px] font-medium text-muted">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="h-11 rounded-xl bg-canvas px-3.5 text-[15px] text-ink outline-none ring-1 ring-hairline placeholder:text-muted-soft focus:ring-2 focus:ring-accent"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-1 inline-flex h-11 items-center justify-center rounded-xl bg-accent text-[14px] font-medium text-white transition hover:bg-accent-hover disabled:opacity-70"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              dismissSignup();
              onDone?.();
            }}
            className="inline-flex h-11 items-center justify-center rounded-xl text-[14px] text-muted"
          >
            Maybe later
          </button>
        </form>
      </div>
    </div>
  );
}
