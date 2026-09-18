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
        Danke. Wir schalten Pro für diese Adresse frei.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-2 ${stacked ? "" : "max-w-md sm:flex-row"}`}
    >
      <label className="sr-only" htmlFor="waitlist-email">
        E-Mail
      </label>
      <input
        id="waitlist-email"
        name="email"
        type="email"
        required
        placeholder="E-Mail-Adresse"
        className="h-11 w-full rounded-md bg-canvas px-3.5 text-[15px] tracking-[-0.16px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft focus:ring-ink"
      />
      <button
        type="submit"
        className={`inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-ink px-4 text-[15px] font-medium tracking-[-0.16px] text-white hover:bg-ink-soft ${
          stacked ? "w-full" : "w-full sm:w-auto"
        }`}
      >
        Pro starten
      </button>
    </form>
  );
}
