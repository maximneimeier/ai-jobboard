import { EMPTY_CRITERIA, mergeCriteria, type Criteria } from "./search";

export type SearchLocation = {
  cities: string[];
  remote: boolean;
  dach: boolean;
};

const STORAGE_KEY = "aria.searchLocation";
export const LOCATION_EVENT = "aria-search-location";

const EMPTY: SearchLocation = {
  cities: [],
  remote: false,
  dach: false,
};

let rawCache: string | null = null;
let snapshot: SearchLocation = EMPTY;

function parse(raw: string | null): SearchLocation {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Partial<SearchLocation>;
    return {
      cities: Array.isArray(parsed.cities)
        ? parsed.cities.filter((city): city is string => typeof city === "string")
        : [],
      remote: Boolean(parsed.remote),
      dach: Boolean(parsed.dach),
    };
  } catch {
    return EMPTY;
  }
}

function loadFromStorage(): SearchLocation {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === rawCache) return snapshot;
  rawCache = raw;
  snapshot = parse(raw);
  return snapshot;
}

export function readSearchLocation(): SearchLocation {
  return loadFromStorage();
}

export function subscribeSearchLocation(onStoreChange: () => void) {
  function onChange() {
    loadFromStorage();
    onStoreChange();
  }
  window.addEventListener(LOCATION_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LOCATION_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function writeSearchLocation(criteria: Criteria, message: string) {
  const latest = mergeCriteria(EMPTY_CRITERIA, message);
  const cities = (criteria.cities.length ? criteria.cities : latest.cities).filter(
    (city) => city !== "Remote",
  );
  const remote =
    criteria.workModes?.includes("remote") ||
    criteria.workMode === "remote" ||
    latest.workMode === "remote" ||
    criteria.cities.includes("Remote");
  const payload: SearchLocation = {
    cities,
    remote,
    dach: Boolean(criteria.dach || latest.dach),
  };
  const raw = JSON.stringify(payload);
  rawCache = raw;
  snapshot = payload;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(LOCATION_EVENT));
}
