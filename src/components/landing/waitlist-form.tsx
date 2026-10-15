"use client";

import { FormEvent, useState } from "react";

export function WaitlistForm({ stacked = false }: { stacked?: boolean }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-[15px] font-medium tracking-[-0.16px] text-ink">
        Thanks. We will open Pro for this address.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-2 ${stacked ? "" : "max-w-md sm:flex-row"}`}
    >
      <label className="sr-only" htmlFor="waitlist-email">
        Email
      </label>
      <input
        id="waitlist-email"
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="h-11 w-full rounded-xl bg-canvas px-3.5 text-[15px] tracking-[-0.16px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft focus:ring-2 focus:ring-accent"
      />
      <button
        type="submit"
        className={`inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-accent px-4 text-[15px] font-medium tracking-[-0.16px] text-white transition hover:bg-accent-hover ${
          stacked ? "w-full" : "w-full sm:w-auto"
        }`}
      >
        Join the list
      </button>
    </form>
  );
}
