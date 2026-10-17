"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { paths } from "@/lib/demo/paths";
import { completeSignIn } from "@/lib/demo/store";

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  function finish() {
    completeSignIn(email.trim() || "alex@gmail.com");
    window.location.assign(paths.account);
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
        Sign in
      </p>
      <h1 className="font-display mt-2 text-[32px] font-semibold tracking-[-0.32px] text-ink">
        Welcome back.
      </h1>
      <p className="mt-3 text-[16px] leading-7 text-body">
        Sign in to open your saved jobs, applications, and profile.
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
            autoComplete="current-password"
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
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-[14px] text-body">
        New here?{" "}
        <Link href={paths.signup} className="font-medium text-ink underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
