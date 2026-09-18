import type { RankedJob } from "./search";

export const JOB_STATUSES = [
  { id: "saved", label: "Gemerkt" },
  { id: "applied", label: "Beworben" },
  { id: "interview", label: "Gespräch" },
  { id: "rejected", label: "Absage" },
  { id: "offer", label: "Zusage" },
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number]["id"];

export type SavedJob = {
  id: string;
  role: string;
  company: string;
  city: string;
  workMode: RankedJob["workMode"];
  salaryMin: number;
  salaryMax: number;
  match: number;
  status: JobStatus;
  savedAt: number;
  stack: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
};

const STORAGE_KEY = "aria.savedJobs";
export const SAVED_JOBS_EVENT = "aria-saved-jobs";

let rawCache: string | null = null;
let snapshot: SavedJob[] = [];
const EMPTY_SAVED: SavedJob[] = [];

function isSavedJob(value: unknown): value is SavedJob {
  if (!value || typeof value !== "object") return false;
  const job = value as SavedJob;
  return (
    typeof job.id === "string" &&
    typeof job.role === "string" &&
    typeof job.company === "string" &&
    typeof job.status === "string"
  );
}

function parse(raw: string | null): SavedJob[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedJob).map(normalizeSavedJob);
  } catch {
    return [];
  }
}

function loadFromStorage(): SavedJob[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === rawCache) return snapshot;
  rawCache = raw;
  snapshot = parse(raw);
  return snapshot;
}

function persist(next: SavedJob[]) {
  snapshot = next;
  const raw = JSON.stringify(next);
  rawCache = raw;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(SAVED_JOBS_EVENT));
}

export function readSavedJobs(): SavedJob[] {
  return loadFromStorage();
}

export function readSavedJobsSnapshot(): SavedJob[] {
  return EMPTY_SAVED;
}

export function subscribeSavedJobs(onStoreChange: () => void) {
  function onChange() {
    loadFromStorage();
    onStoreChange();
  }
  window.addEventListener(SAVED_JOBS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(SAVED_JOBS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeSavedJob(job: SavedJob): SavedJob {
  return {
    ...job,
    stack: asStringArray(job.stack),
    description: typeof job.description === "string" ? job.description : "",
    responsibilities: asStringArray(job.responsibilities),
    requirements: asStringArray(job.requirements),
  };
}

export function jobFromRanked(job: RankedJob, status: JobStatus = "saved"): SavedJob {
  return {
    id: job.id,
    role: job.role,
    company: job.company,
    city: job.city,
    workMode: job.workMode,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    match: job.match,
    status,
    savedAt: Date.now(),
    stack: job.stack,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
  };
}

export function saveJob(job: RankedJob, status?: JobStatus) {
  const current = loadFromStorage();
  const existing = current.find((item) => item.id === job.id);
  const nextJob: SavedJob = {
    ...jobFromRanked(job, status ?? existing?.status ?? "saved"),
    status: status ?? existing?.status ?? "saved",
    savedAt: existing?.savedAt ?? Date.now(),
    stack: job.stack.length ? job.stack : existing?.stack ?? [],
    description: job.description || existing?.description || "",
    responsibilities: job.responsibilities.length
      ? job.responsibilities
      : existing?.responsibilities ?? [],
    requirements: job.requirements.length
      ? job.requirements
      : existing?.requirements ?? [],
  };
  persist([nextJob, ...current.filter((item) => item.id !== job.id)].slice(0, 40));
}

export function setJobStatus(id: string, status: JobStatus) {
  persist(
    loadFromStorage().map((item) =>
      item.id === id ? { ...item, status } : item,
    ),
  );
}

export function removeSavedJob(id: string) {
  persist(loadFromStorage().filter((item) => item.id !== id));
}

export function savedJobStatusLabel(status: JobStatus) {
  return JOB_STATUSES.find((item) => item.id === status)?.label ?? "Gemerkt";
}
