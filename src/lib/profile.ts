import type { Culture, JobFunction, Seniority, WorkMode } from "./jobs";
import {
  EMPTY_CRITERIA,
  mergeCriteria,
  type Criteria,
} from "./search";
import { writeSearchLocation } from "./search-location";

export type ProfileCv = {
  name: string;
  type: string;
  size: number;
};

export type ProfilePrefs = {
  cities: string[];
  workModes: WorkMode[];
  functions: JobFunction[];
  seniority: Seniority[];
  salaryMin: number;
  stack: string[];
  cultures: Culture[];
  noOnCall: boolean;
  fourDayWeek: boolean;
  dach: boolean;
};

export type UserProfile = {
  name: string;
  bio: string;
  email: string;
  photo: string;
  cv: ProfileCv | null;
  prefs: ProfilePrefs;
};

const STORAGE_KEY = "aria.profile";
export const PROFILE_EVENT = "aria-profile";

export const EMPTY_PREFS: ProfilePrefs = {
  cities: [],
  workModes: [],
  functions: [],
  seniority: [],
  salaryMin: 0,
  stack: [],
  cultures: [],
  noOnCall: false,
  fourDayWeek: false,
  dach: false,
};

export const EMPTY_PROFILE: UserProfile = {
  name: "",
  bio: "",
  email: "",
  photo: "",
  cv: null,
  prefs: EMPTY_PREFS,
};

let rawCache: string | null = null;
let snapshot: UserProfile = EMPTY_PROFILE;

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function prefsFromCriteria(criteria: Criteria): ProfilePrefs {
  return {
    cities: criteria.cities,
    workModes: criteria.workModes?.length
      ? criteria.workModes
      : criteria.workMode
        ? [criteria.workMode]
        : [],
    functions: criteria.functions,
    seniority: criteria.seniority ?? [],
    salaryMin: criteria.salaryMin ?? 0,
    stack: criteria.stack,
    cultures: criteria.cultures ?? [],
    noOnCall: criteria.onCall === false,
    fourDayWeek: Boolean(criteria.fourDayWeek),
    dach: Boolean(criteria.dach),
  };
}

function parsePrefs(value: unknown, bio: string): ProfilePrefs {
  if (!value || typeof value !== "object") {
    return bio.trim()
      ? prefsFromCriteria(mergeCriteria(EMPTY_CRITERIA, bio))
      : EMPTY_PREFS;
  }
  const raw = value as Partial<ProfilePrefs>;
  return {
    cities: asStringArray(raw.cities),
    workModes: asStringArray(raw.workModes) as WorkMode[],
    functions: asStringArray(raw.functions) as JobFunction[],
    seniority: asStringArray(raw.seniority) as Seniority[],
    salaryMin:
      typeof raw.salaryMin === "number" && raw.salaryMin > 0 ? raw.salaryMin : 0,
    stack: asStringArray(raw.stack),
    cultures: asStringArray(raw.cultures) as Culture[],
    noOnCall: Boolean(raw.noOnCall),
    fourDayWeek: Boolean(raw.fourDayWeek),
    dach: Boolean(raw.dach),
  };
}

function parse(raw: string | null): UserProfile {
  if (!raw) return EMPTY_PROFILE;
  try {
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    const bio = typeof parsed.bio === "string" ? parsed.bio : "";
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      bio,
      email: typeof parsed.email === "string" ? parsed.email : "",
      photo: typeof parsed.photo === "string" ? parsed.photo : "",
      cv: parseCv(parsed.cv),
      prefs: parsePrefs(parsed.prefs, bio),
    };
  } catch {
    return EMPTY_PROFILE;
  }
}

function loadFromStorage(): UserProfile {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === rawCache) return snapshot;
  rawCache = raw;
  snapshot = parse(raw);
  return snapshot;
}

export function readProfile(): UserProfile {
  return loadFromStorage();
}

export function subscribeProfile(onStoreChange: () => void) {
  function onChange() {
    loadFromStorage();
    onStoreChange();
  }
  window.addEventListener(PROFILE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PROFILE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function profileCriteria(profile: UserProfile): Criteria {
  const fromBio = profile.bio.trim()
    ? mergeCriteria(EMPTY_CRITERIA, profile.bio)
    : { ...EMPTY_CRITERIA };
  const prefs = profile.prefs ?? EMPTY_PREFS;
  const workModes = prefs.workModes.length
    ? prefs.workModes
    : fromBio.workMode
      ? [fromBio.workMode]
      : fromBio.workModes ?? [];
  const cultures = prefs.cultures.length ? prefs.cultures : fromBio.cultures;
  return {
    functions: prefs.functions.length ? prefs.functions : fromBio.functions,
    cities: prefs.cities.length ? prefs.cities : fromBio.cities,
    workMode: workModes.length === 1 ? workModes[0] : undefined,
    workModes: workModes.length ? workModes : undefined,
    salaryMin: prefs.salaryMin || fromBio.salaryMin,
    seniority: prefs.seniority.length ? prefs.seniority : fromBio.seniority,
    noCorporate: cultures?.length
      ? cultures.every((item) => item !== "corporate")
      : fromBio.noCorporate,
    cultures,
    stack: prefs.stack.length ? prefs.stack : fromBio.stack,
    onCall: prefs.noOnCall ? false : fromBio.onCall,
    fourDayWeek: prefs.fourDayWeek || fromBio.fourDayWeek,
    dach: prefs.dach || fromBio.dach,
  };
}

function parseCv(value: unknown): ProfileCv | null {
  if (!value || typeof value !== "object") return null;
  const cv = value as Partial<ProfileCv>;
  if (typeof cv.name !== "string" || !cv.name.trim()) return null;
  return {
    name: cv.name.trim(),
    type: typeof cv.type === "string" ? cv.type : "",
    size: typeof cv.size === "number" && cv.size >= 0 ? cv.size : 0,
  };
}

export function prefsAreSet(prefs: ProfilePrefs) {
  return Boolean(
    prefs.cities.length ||
      prefs.workModes.length ||
      prefs.functions.length ||
      prefs.seniority.length ||
      prefs.salaryMin ||
      prefs.stack.length ||
      prefs.cultures.length ||
      prefs.noOnCall ||
      prefs.fourDayWeek ||
      prefs.dach,
  );
}

export function profileIsSet(profile: UserProfile) {
  return Boolean(
    profile.name.trim() ||
      profile.bio.trim() ||
      profile.email.trim() ||
      profile.photo ||
      profile.cv ||
      prefsAreSet(profile.prefs ?? EMPTY_PREFS),
  );
}

export function isRegistered(profile: UserProfile) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(profile.email.trim());
}

export function profileInitials(profile: UserProfile) {
  const parts = profile.name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const first = profile.bio.trim().split(/\s+/).find(Boolean);
  return first ? first[0].toUpperCase() : "";
}

export function writeProfile(profile: UserProfile) {
  const payload: UserProfile = {
    name: profile.name.trim(),
    bio: profile.bio.trim(),
    email: profile.email.trim(),
    photo: typeof profile.photo === "string" ? profile.photo : "",
    cv: parseCv(profile.cv),
    prefs: {
      cities: profile.prefs.cities,
      workModes: profile.prefs.workModes,
      functions: profile.prefs.functions,
      seniority: profile.prefs.seniority,
      salaryMin: profile.prefs.salaryMin > 0 ? profile.prefs.salaryMin : 0,
      stack: profile.prefs.stack,
      cultures: profile.prefs.cultures,
      noOnCall: Boolean(profile.prefs.noOnCall),
      fourDayWeek: Boolean(profile.prefs.fourDayWeek),
      dach: Boolean(profile.prefs.dach),
    },
  };
  const raw = JSON.stringify(payload);
  rawCache = raw;
  snapshot = payload;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(PROFILE_EVENT));

  const criteria = profileCriteria(payload);
  writeSearchLocation(criteria, payload.bio);
}
