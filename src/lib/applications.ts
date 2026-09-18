import { generateApplication, type JobSource } from "./generate-application";
import { jobById } from "./jobs";
import { readProfileCvText } from "./profile-files";
import { readProfile } from "./profile";
import { readSavedJobs, saveJob } from "./saved-jobs";
import type { RankedJob } from "./search";

export type ApplicationDocs = {
  jobId: string;
  cv: string;
  letter: string;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "aria.applications";
export const APPLICATIONS_EVENT = "aria-applications";

let rawCache: string | null = null;
let snapshot: ApplicationDocs[] = [];
const EMPTY: ApplicationDocs[] = [];

function isApplication(value: unknown): value is ApplicationDocs {
  if (!value || typeof value !== "object") return false;
  const doc = value as ApplicationDocs;
  return (
    typeof doc.jobId === "string" &&
    typeof doc.cv === "string" &&
    typeof doc.letter === "string"
  );
}

function parse(raw: string | null): ApplicationDocs[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isApplication);
  } catch {
    return [];
  }
}

function loadFromStorage(): ApplicationDocs[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === rawCache) return snapshot;
  rawCache = raw;
  snapshot = parse(raw);
  return snapshot;
}

function persist(next: ApplicationDocs[]) {
  snapshot = next;
  const raw = JSON.stringify(next);
  rawCache = raw;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(APPLICATIONS_EVENT));
}

export function readApplications(): ApplicationDocs[] {
  return loadFromStorage();
}

export function readApplicationsSnapshot(): ApplicationDocs[] {
  return EMPTY;
}

export function subscribeApplications(onStoreChange: () => void) {
  function onChange() {
    loadFromStorage();
    onStoreChange();
  }
  window.addEventListener(APPLICATIONS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(APPLICATIONS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function readApplication(jobId: string) {
  return loadFromStorage().find((item) => item.jobId === jobId) ?? null;
}

export function writeApplication(
  jobId: string,
  docs: Pick<ApplicationDocs, "cv" | "letter">,
) {
  const current = loadFromStorage();
  const existing = current.find((item) => item.jobId === jobId);
  const next: ApplicationDocs = {
    jobId,
    cv: docs.cv,
    letter: docs.letter,
    createdAt: existing?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  };
  persist([next, ...current.filter((item) => item.jobId !== jobId)].slice(0, 40));
  return next;
}

export function removeApplication(jobId: string) {
  persist(loadFromStorage().filter((item) => item.jobId !== jobId));
}

export function jobSourceFromRanked(job: RankedJob): JobSource {
  return {
    id: job.id,
    role: job.role,
    company: job.company,
    city: job.city,
    workMode: job.workMode,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    stack: job.stack,
    description: job.description,
    responsibilities: job.responsibilities,
    requirements: job.requirements,
    fits: job.fits,
    gaps: job.gaps,
    responsibilityChecks: job.responsibilityChecks,
    requirementChecks: job.requirementChecks,
  };
}

export function resolveJobSource(jobId: string): JobSource | null {
  const catalog = jobById(jobId);
  const saved =
    typeof window === "undefined"
      ? undefined
      : readSavedJobs().find((item) => item.id === jobId);
  if (catalog) {
    return {
      id: catalog.id,
      role: catalog.role,
      company: catalog.company,
      city: catalog.city,
      workMode: catalog.workMode,
      salaryMin: catalog.salaryMin,
      salaryMax: catalog.salaryMax,
      stack: catalog.stack,
      description: catalog.description,
      responsibilities: catalog.responsibilities,
      requirements: catalog.requirements,
    };
  }
  if (!saved) return null;
  return {
    id: saved.id,
    role: saved.role,
    company: saved.company,
    city: saved.city,
    workMode: saved.workMode,
    salaryMin: saved.salaryMin,
    salaryMax: saved.salaryMax,
    stack: saved.stack,
    description: saved.description,
    responsibilities: saved.responsibilities,
    requirements: saved.requirements,
  };
}

export async function buildApplication(
  source: JobSource,
  options?: { replace?: boolean },
) {
  if (!options?.replace) {
    const existing = readApplication(source.id);
    if (existing) return existing;
  }
  const profile = readProfile();
  const sourceCv = await readProfileCvText();
  const generated = generateApplication(source, profile, sourceCv);
  return writeApplication(source.id, generated);
}

export async function openApplicationFromJob(job: RankedJob) {
  saveJob(job);
  return buildApplication(jobSourceFromRanked(job));
}
