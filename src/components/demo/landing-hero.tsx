"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { setSearch } from "@/lib/demo/store";

export function LandingHero() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const nextRole = role.trim() || "Software Engineer";
    const nextLocation = location.trim() || "Berlin";
    setSearch(nextRole, nextLocation);
    const params = new URLSearchParams({
      role: nextRole,
      location: nextLocation,
    });
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <section id="suche" className="hero-wash scroll-mt-[72px]">
      <div className="relative mx-auto max-w-[920px] px-5 pt-20 pb-16 text-center md:pt-28 md:pb-20">
        <p className="inline-flex items-center rounded-md bg-accent-soft px-3 py-2 text-[15px] font-medium tracking-[-0.16px] text-ink">
          Atheniks · Career Copilot
        </p>
        <h1 className="font-display mx-auto mt-7 max-w-[16ch] text-[40px] leading-none font-semibold tracking-[-0.04em] text-ink sm:text-[56px] lg:text-[64px]">
          Fewer listings. Better matches.
        </h1>
        <p className="mx-auto mt-5 max-w-[48ch] text-[17px] leading-7 text-body">
          Tell Atheniks what you want. It shows roles that fit the title and city
          — and later, why they fit you. No account required.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-10 max-w-[640px] rounded-lg bg-surface p-3 text-left shadow-[0_12px_40px_rgba(0,0,0,0.04)] ring-1 ring-hairline"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1.5 px-2 pt-2 text-[12px] font-medium text-muted">
              What job are you looking for?
              <input
                value={role}
                onChange={(event) => setRole(event.target.value)}
                placeholder="Software Engineer"
                className="h-11 rounded-md bg-canvas px-3 text-[15px] text-ink outline-none placeholder:text-muted-soft"
              />
            </label>
            <label className="grid gap-1.5 px-2 pt-2 text-[12px] font-medium text-muted">
              Where do you want to work?
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Berlin"
                className="h-11 rounded-md bg-canvas px-3 text-[15px] text-ink outline-none placeholder:text-muted-soft"
              />
            </label>
          </div>
          <div className="mt-3 flex flex-col gap-2 px-2 pb-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="inline-flex h-12 flex-1 items-center justify-center rounded-md bg-ink px-5 text-[15px] font-medium tracking-[-0.16px] text-white hover:bg-ink-soft"
            >
              Find matching jobs
            </button>
            <a
              href="#ablauf"
              className="inline-flex h-12 items-center justify-center rounded-md px-4 text-[14px] font-medium text-ink"
            >
              See how it works
            </a>
          </div>
        </form>
        <p className="mx-auto mt-3 max-w-[52ch] text-[13px] text-muted">
          You can search right away. CV and account come later, if you want them.
        </p>

        <ul className="mx-auto mt-12 grid max-w-[800px] gap-3 text-left sm:grid-cols-3">
          {[
            {
              title: "Only roles that match the search",
              text: "No feed of everything that vaguely says engineer.",
            },
            {
              title: "See why a job fits",
              text: "Fit and gaps in plain language. No fake match percentages.",
            },
            {
              title: "Keep the search in one place",
              text: "Save roles, prepare applications, track status.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-lg bg-surface px-4 py-4 ring-1 ring-hairline-soft"
            >
              <p className="text-[14px] font-medium text-ink">{item.title}</p>
              <p className="mt-1 text-[13px] leading-5 text-body">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="ablauf" className="scroll-mt-[84px] bg-surface py-24">
      <div className="mx-auto max-w-[1080px] px-5 md:px-8">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          How it works
        </p>
        <h2 className="font-display mt-2 max-w-[20ch] text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] md:text-[40px]">
          From first search to application.
        </h2>
        <ol className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Search",
              text: "Role and city. Results immediately. No account.",
            },
            {
              step: "02",
              title: "Refine",
              text: "Set filters. Optional profile — then personal fit labels.",
            },
            {
              step: "03",
              title: "Decide",
              text: "Open a role, save it, prepare an application. Next step is obvious.",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="rounded-lg bg-canvas px-5 py-5 ring-1 ring-hairline-soft"
            >
              <p className="text-[12px] font-medium text-accent">{item.step}</p>
              <p className="mt-3 text-[17px] font-medium text-ink">{item.title}</p>
              <p className="mt-2 text-[14px] leading-6 text-body">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
