"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  COMPANIES,
  DIRECTORY_CITIES,
  companiesForFilter,
  resolveDirectoryFilter,
  type Company,
  type DirectoryFilter,
} from "@/lib/companies";
import {
  readSearchLocation,
  subscribeSearchLocation,
  type SearchLocation,
} from "@/lib/search-location";

const EMPTY_LOCATION: SearchLocation = {
  cities: [],
  remote: false,
  dach: false,
};

export function EmployerDirectory() {
  const location = useSyncExternalStore(
    subscribeSearchLocation,
    readSearchLocation,
    () => EMPTY_LOCATION,
  );
  const [override, setOverride] = useState<DirectoryFilter | null>(null);

  useEffect(() => {
    setOverride(null);
  }, [location]);

  const filter = resolveDirectoryFilter(location, override);
  const companies = useMemo(
    () => companiesForFilter(filter, location, override),
    [filter, location, override],
  );
  const fromSearch = location.cities.length > 0 || location.remote || location.dach;
  const headline =
    filter === "all"
      ? "Entdecke Teams"
      : filter === "Remote"
        ? "Teams remote"
        : `Teams in ${filter}`;
  const subtitle = override
    ? "Standort über die Filter gewählt."
    : fromSearch
      ? "Passend zum Standort aus deiner Suche."
      : "Ohne Suche zeigen wir Teams in Berlin.";

  return (
    <div className="mx-auto max-w-[1080px] px-5 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
            Arbeitgeber
          </p>
          <h2 className="font-display mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] md:text-[40px]">
            {headline}
          </h2>
          <p className="mt-2 text-[14px] text-body">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setOverride("all")}
          className={
            filter === "all"
              ? "text-[15px] font-medium tracking-[-0.16px] text-ink"
              : "text-[15px] font-medium tracking-[-0.16px] text-muted"
          }
        >
          Alle Firmen
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {DIRECTORY_CITIES.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => setOverride(city)}
            className={
              filter === city
                ? "rounded-md bg-ink px-2.5 py-1 text-[12px] font-medium text-white"
                : "rounded-md bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink-soft ring-1 ring-hairline-soft"
            }
          >
            {city}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <article
            key={company.name}
            className="rounded-lg bg-canvas p-5 ring-1 ring-hairline-soft"
          >
            <CompanyLogo company={company} />
            <h3 className="mt-4 text-[15px] font-medium tracking-[-0.16px]">
              {company.name}
            </h3>
            <p className="mt-1 text-[14px] text-body">{company.field}</p>
            <p className="mt-1 text-[13px] text-muted">
              {company.cities.join(" · ")} · {company.size} Mitarbeitende
            </p>
            <p className="mt-4 text-[14px] font-medium text-ink">
              {company.jobs} {company.jobs === 1 ? "Job" : "Jobs"}
            </p>
          </article>
        ))}
        {companies.length === 0 ? (
          <p className="text-[14px] text-body sm:col-span-2 lg:col-span-3">
            Keine Firmen für diesen Standort.{" "}
            <button
              type="button"
              onClick={() => setOverride("all")}
              className="font-medium text-ink"
            >
              Alle {COMPANIES.length} Firmen zeigen
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function CompanyLogo({ company }: { company: Company }) {
  const [failed, setFailed] = useState(false);

  if (failed || !company.logo) {
    return (
      <div className="flex size-10 items-center justify-center rounded-md bg-ink text-[13px] font-medium text-white">
        {company.name.slice(0, 1)}
      </div>
    );
  }

  return (
    <div className="flex size-10 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-hairline-soft">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={company.logo}
        alt=""
        width={40}
        height={40}
        className="size-8 object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
