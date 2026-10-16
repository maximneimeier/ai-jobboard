"use client";

import { FormEvent, useState } from "react";
import { completeSignup } from "@/lib/demo/store";

export function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  function finish() {
    completeSignup(email.trim() || "alex@gmail.com");
    window.location.assign("/onboarding");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => finish(), 420);
  }

  return (
    <div className="mx-auto w-full max-w-[480px] px-5 py-16 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Create your account
      </p>
      <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
        Start with an account.
      </h1>
      <p className="mt-3 text-[16px] leading-7 text-body">
        Create an account to save your profile and start matching jobs.
      </p>
      <form noValidate onSubmit={onSubmit} className="mt-8 grid gap-4">
        <label className="grid gap-1.5 text-[13px] font-medium text-ink">
          Email
          <input
            type="text"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            className="h-12 rounded-xl bg-surface px-3.5 text-[15px] font-normal text-ink outline-none ring-1 ring-hairline placeholder:text-muted-soft focus:ring-2 focus:ring-accent"
          />
        </label>
        <label className="grid gap-1.5 text-[13px] font-medium text-ink">
          Password
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="h-12 rounded-xl bg-surface px-3.5 text-[15px] font-normal text-ink outline-none ring-1 ring-hairline placeholder:text-muted-soft focus:ring-2 focus:ring-accent"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-2 inline-flex h-12 items-center justify-center rounded-xl bg-accent text-[15px] font-medium text-white transition hover:bg-accent-hover disabled:opacity-70"
        >
          {busy ? "Creating account…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
