"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { paths } from "@/lib/demo/paths";
import {
  addAlert,
  clearAlertMatches,
  removeAlert,
  toggleAlert,
  useDemo,
} from "@/lib/demo/store";
import { DemoBanner } from "./demo-banner";

export function AlertsPage() {
  const demo = useDemo();
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  function onAdd(event: FormEvent) {
    event.preventDefault();
    addAlert(role, location);
    setRole("");
    setLocation("");
  }

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Job alerts
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        Get new matches as they appear.
      </h1>
      <div className="mt-4">
        <DemoBanner>
          Alerts use your saved searches. Turn them on for roles you want to keep watching.
        </DemoBanner>
      </div>

      <form noValidate onSubmit={onAdd} className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="grid gap-1 text-[12px] font-medium text-muted">
          Role
          <input
            type="text"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            placeholder="Software Engineer"
            className="h-11 rounded-md bg-surface px-3 text-[14px] font-normal text-ink ring-1 ring-hairline outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <label className="grid gap-1 text-[12px] font-medium text-muted">
          Location
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Berlin"
            className="h-11 rounded-md bg-surface px-3 text-[14px] font-normal text-ink ring-1 ring-hairline outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <button
          type="submit"
          className="h-11 self-end rounded-md bg-ink px-4 text-[14px] font-medium text-white"
        >
          Add alert
        </button>
      </form>

      {demo.alerts.length === 0 ? (
        <p className="mt-10 text-[15px] text-body">
          No alerts yet. Add a role and location to watch new matches.
        </p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {demo.alerts.map((alert) => (
            <li
              key={alert.id}
              className="rounded-lg bg-surface p-5 ring-1 ring-hairline-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{alert.role}</p>
                  <p className="mt-1 text-[14px] text-body">{alert.location}</p>
                  <p className="mt-2 text-[12px] font-medium text-muted">
                    {alert.enabled ? "On" : "Paused"}
                    {alert.enabled && alert.newMatches
                      ? ` · ${alert.newMatches} new ${alert.newMatches === 1 ? "match" : "matches"}`
                      : null}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {alert.enabled && alert.newMatches ? (
                    <Link
                      href={paths.jobsSearch(alert.role, alert.location)}
                      onClick={() => clearAlertMatches(alert.id)}
                      className="inline-flex h-9 items-center rounded-md bg-ink px-3 text-[13px] text-white"
                    >
                      View new matches
                    </Link>
                  ) : (
                    <Link
                      href={paths.jobsSearch(alert.role, alert.location)}
                      className="inline-flex h-9 items-center rounded-md px-3 text-[13px] ring-1 ring-hairline"
                    >
                      Open search
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleAlert(alert.id)}
                    className="inline-flex h-9 items-center rounded-md px-3 text-[13px] ring-1 ring-hairline"
                  >
                    {alert.enabled ? "Pause" : "Turn on"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAlert(alert.id)}
                    className="inline-flex h-9 items-center rounded-md px-3 text-[13px] text-muted hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
