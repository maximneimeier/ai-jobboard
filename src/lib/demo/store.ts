import { useEffect, useSyncExternalStore } from "react";
import type { Employment, Industry, Level, WorkMode } from "./jobs";

export type WorkExperience = {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
};

export type EducationEntry = {
  id: string;
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  current: boolean;
};

export type CareerProfile = {
  fullName: string;
  headline: string;
  currentRole: string;
  years: number;
  education: string;
  skills: string[];
  abilities: string[];
  languages: string[];
  desiredRoles: string[];
  desiredLocations: string[];
  location: string;
  remote: WorkMode | "flexible";
  salaryMin: number;
  experience: WorkExperience[];
  educationHistory: EducationEntry[];
  notes: string;
  dealBreakers: string;
};

export type ApplicationStatus =
  | "interested"
  | "preparing"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export type DemoApplication = {
  jobId: string;
  status: ApplicationStatus;
  notes: string;
  followUp: string;
  updatedAt: number;
};

export type FitFilter = "strong" | "good" | "stretch" | "review";

export type DemoFilters = {
  title: string;
  location: string;
  workModes: WorkMode[];
  levels: Level[];
  industries: Industry[];
  salaryMin: number;
  employment: Employment[];
  maxAgeDays: number;
  fits: FitFilter[];
};

export type FeedbackAction = "interested" | "not_interested" | "save_later";
export type FeedbackReason =
  | "wrong_role"
  | "wrong_location"
  | "salary"
  | "seniority"
  | "industry"
  | "other";

export type JobFeedback = {
  jobId: string;
  action: FeedbackAction;
  reason?: FeedbackReason;
  updatedAt: number;
};

export type DemoSort = "relevant" | "recent" | "salary";

export type DemoState = {
  query: string;
  location: string;
  filters: DemoFilters;
  sort: DemoSort;
  profile: CareerProfile | null;
  personalized: boolean;
  roleTags: string[];
  locationTags: string[];
  savedIds: string[];
  signedUp: boolean;
  email: string;
  applications: DemoApplication[];
  pendingSaveId: string | null;
  jobFeedback: JobFeedback[];
};

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyExperience(): WorkExperience {
  return {
    id: newId("exp"),
    title: "",
    company: "",
    location: "",
    start: "",
    end: "",
    current: false,
    description: "",
  };
}

export function emptyEducation(): EducationEntry {
  return {
    id: newId("edu"),
    school: "",
    degree: "",
    field: "",
    start: "",
    end: "",
    current: false,
  };
}

export const SAMPLE_PROFILE: CareerProfile = {
  fullName: "Alex Weber",
  headline: "Software Engineer",
  currentRole: "Software Engineer",
  years: 2,
  education: "BSc · Computer Science · Technical University of Berlin",
  skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Next.js", "Git", "CSS"],
  abilities: ["Product thinking", "Stakeholder communication", "Mentoring"],
  languages: ["English", "German"],
  desiredRoles: ["Software Engineer", "Frontend Engineer", "Full Stack Engineer"],
  desiredLocations: ["Berlin", "Germany", "Amsterdam"],
  location: "Berlin",
  remote: "hybrid",
  salaryMin: 70,
  experience: [
    {
      id: "exp-northline",
      title: "Software Engineer",
      company: "Northline",
      location: "Berlin, Germany",
      start: "2024-01",
      end: "",
      current: true,
      description:
        "Build customer-facing product features in TypeScript and React. Own frontend delivery, work with design on UX details, and ship with a small product team.",
    },
    {
      id: "exp-spree",
      title: "Junior Frontend Developer",
      company: "Spree Labs",
      location: "Berlin, Germany",
      start: "2022-07",
      end: "2023-12",
      current: false,
      description:
        "Shipped UI components and internal tools with React and Node.js. Improved page performance and helped introduce a shared component library.",
    },
  ],
  educationHistory: [
    {
      id: "edu-tub",
      school: "Technical University of Berlin",
      degree: "BSc",
      field: "Computer Science",
      start: "2018",
      end: "2022",
      current: false,
    },
  ],
  notes:
    "Open to hybrid roles in Berlin. Prefer product teams over pure on-call maintenance. Comfortable in English, conversational German.",
  dealBreakers:
    "Open to hybrid roles in Berlin. Prefer product teams over pure on-call maintenance. Comfortable in English, conversational German.",
};

export function blankProfile(): CareerProfile {
  return {
    fullName: "",
    headline: "",
    currentRole: "",
    years: 0,
    education: "",
    skills: [],
    abilities: [],
    languages: [],
    desiredRoles: [],
    desiredLocations: [],
    location: "",
    remote: "flexible",
    salaryMin: 0,
    experience: [],
    educationHistory: [],
    notes: "",
    dealBreakers: "",
  };
}

export function matchedJobsPath(profile: CareerProfile) {
  const role = profile.desiredRoles[0] || profile.headline || profile.currentRole || "";
  const city = profile.desiredLocations[0] || profile.location || "";
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (city) params.set("location", city);
  const qs = params.toString();
  return qs ? `/jobs?${qs}` : "/jobs";
}

export const EMPTY_FILTERS: DemoFilters = {
  title: "",
  location: "",
  workModes: [],
  levels: [],
  industries: [],
  salaryMin: 0,
  employment: [],
  maxAgeDays: 0,
  fits: [],
};

const STORAGE_KEY = "atheniks.demo.v2";
export const DEMO_EVENT = "atheniks-demo";

export const INITIAL_STATE: DemoState = {
  query: "",
  location: "",
  filters: EMPTY_FILTERS,
  sort: "relevant",
  profile: null,
  personalized: false,
  roleTags: [],
  locationTags: [],
  savedIds: [],
  signedUp: false,
  email: "",
  applications: [],
  pendingSaveId: null,
  jobFeedback: [],
};

let rawCache: string | null = null;
let snapshot: DemoState = INITIAL_STATE;
let clientReady = false;

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function parseExperienceList(value: unknown): WorkExperience[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = asObject(item) ?? {};
    return {
      id: typeof row.id === "string" ? row.id : newId("exp"),
      title: typeof row.title === "string" ? row.title : "",
      company: typeof row.company === "string" ? row.company : "",
      location: typeof row.location === "string" ? row.location : "",
      start: typeof row.start === "string" ? row.start : "",
      end: typeof row.end === "string" ? row.end : "",
      current: Boolean(row.current),
      description: typeof row.description === "string" ? row.description : "",
    };
  });
}

function parseEducationList(value: unknown): EducationEntry[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = asObject(item) ?? {};
    return {
      id: typeof row.id === "string" ? row.id : newId("edu"),
      school: typeof row.school === "string" ? row.school : "",
      degree: typeof row.degree === "string" ? row.degree : "",
      field: typeof row.field === "string" ? row.field : "",
      start: typeof row.start === "string" ? row.start : "",
      end: typeof row.end === "string" ? row.end : "",
      current: Boolean(row.current),
    };
  });
}

function parseMonth(value: string): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [year, month] = value.split("-").map(Number);
    return new Date(year, month - 1, 1);
  }
  if (/^\d{4}$/.test(value)) return new Date(Number(value), 0, 1);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function yearsFromExperience(experience: WorkExperience[]): number {
  let months = 0;
  const now = new Date();
  for (const job of experience) {
    const start = parseMonth(job.start);
    if (!start) continue;
    const end = job.current ? now : parseMonth(job.end) ?? now;
    const diff =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    months += Math.max(0, diff);
  }
  if (months <= 0) return 0;
  return Math.max(1, Math.round(months / 12));
}

export function profileSkills(profile: CareerProfile) {
  return [...profile.skills, ...profile.abilities].filter(Boolean);
}

export function hydrateProfile(raw: Partial<CareerProfile> | null | undefined): CareerProfile {
  const base = raw && typeof raw === "object" ? raw : {};
  let experience = parseExperienceList(base.experience);
  let educationHistory = parseEducationList(base.educationHistory);
  if (!experience.length && (base.currentRole || base.headline)) {
    experience = [
      {
        ...emptyExperience(),
        title: String(base.headline || base.currentRole || ""),
        location: typeof base.location === "string" ? base.location : "",
        current: true,
      },
    ];
  }
  if (!educationHistory.length && typeof base.education === "string" && base.education.trim()) {
    educationHistory = [
      {
        ...emptyEducation(),
        degree: base.education,
      },
    ];
  }
  const notes =
    (typeof base.notes === "string" && base.notes) ||
    (typeof base.dealBreakers === "string" && base.dealBreakers) ||
    "";
  return syncProfile({
    ...SAMPLE_PROFILE,
    ...base,
    fullName: typeof base.fullName === "string" ? base.fullName : "",
    headline:
      typeof base.headline === "string"
        ? base.headline
        : typeof base.currentRole === "string"
          ? base.currentRole
          : "",
    skills: asStringArray(base.skills),
    abilities: asStringArray(base.abilities),
    languages: asStringArray(base.languages),
    desiredRoles: asStringArray(base.desiredRoles),
    desiredLocations: asStringArray(base.desiredLocations).length
      ? asStringArray(base.desiredLocations)
      : typeof base.location === "string" && base.location.trim()
        ? [base.location.split(",")[0]?.trim() || base.location]
        : [],
    experience,
    educationHistory,
    notes,
    dealBreakers: notes,
  });
}

export function syncProfile(profile: CareerProfile): CareerProfile {
  const experience = profile.experience ?? [];
  const educationHistory = profile.educationHistory ?? [];
  const headline =
    profile.headline?.trim() ||
    experience.find((item) => item.title.trim())?.title ||
    profile.currentRole ||
    "";
  const firstEdu = educationHistory.find(
    (item) => item.school.trim() || item.degree.trim() || item.field.trim(),
  );
  const education = firstEdu
    ? [firstEdu.degree, firstEdu.field, firstEdu.school].filter((part) => part.trim()).join(" · ")
    : profile.education;
  const notes = profile.notes ?? "";
  const years = yearsFromExperience(experience) || profile.years || 0;
  return {
    ...profile,
    headline,
    currentRole: headline,
    years,
    education,
    skills: asStringArray(profile.skills),
    abilities: asStringArray(profile.abilities),
    languages: asStringArray(profile.languages),
    desiredRoles: asStringArray(profile.desiredRoles),
    desiredLocations: asStringArray(profile.desiredLocations),
    experience,
    educationHistory,
    notes,
    dealBreakers: notes,
  };
}

function parse(raw: string | null): DemoState {
  if (!raw) return INITIAL_STATE;
  try {
    const data = JSON.parse(raw) as Partial<DemoState>;
    return {
      query: typeof data.query === "string" ? data.query : "",
      location: typeof data.location === "string" ? data.location : "",
      filters: {
        ...EMPTY_FILTERS,
        ...(data.filters ?? {}),
        workModes: asStringArray(data.filters?.workModes) as WorkMode[],
        levels: asStringArray(data.filters?.levels) as Level[],
        industries: asStringArray(data.filters?.industries) as Industry[],
        employment: asStringArray(data.filters?.employment) as Employment[],
        title: typeof data.filters?.title === "string" ? data.filters.title : "",
        location:
          typeof data.filters?.location === "string" ? data.filters.location : "",
        salaryMin:
          typeof data.filters?.salaryMin === "number" ? data.filters.salaryMin : 0,
        maxAgeDays:
          typeof data.filters?.maxAgeDays === "number" ? data.filters.maxAgeDays : 0,
        fits: asStringArray(data.filters?.fits).filter((item): item is FitFilter =>
          item === "strong" ||
          item === "good" ||
          item === "stretch" ||
          item === "review",
        ),
      },
      sort: data.sort === "recent" || data.sort === "salary" ? data.sort : "relevant",
      profile:
        data.profile && typeof data.profile === "object"
          ? hydrateProfile(data.profile)
          : null,
      personalized: Boolean(data.personalized),
      roleTags: asStringArray(data.roleTags).length
        ? asStringArray(data.roleTags)
        : asStringArray(
            data.profile && typeof data.profile === "object"
              ? (data.profile as CareerProfile).desiredRoles
              : [],
          ),
      locationTags: asStringArray(data.locationTags).length
        ? asStringArray(data.locationTags)
        : asStringArray(
            data.profile && typeof data.profile === "object"
              ? (data.profile as CareerProfile).desiredLocations
              : [],
          ),
      savedIds: asStringArray(data.savedIds),
      signedUp: Boolean(data.signedUp),
      email: typeof data.email === "string" ? data.email : "",
      applications: Array.isArray(data.applications)
        ? data.applications.filter(
            (item): item is DemoApplication =>
              Boolean(item && typeof item.jobId === "string"),
          )
        : [],
      pendingSaveId:
        typeof data.pendingSaveId === "string" ? data.pendingSaveId : null,
      jobFeedback: Array.isArray(data.jobFeedback)
        ? data.jobFeedback.filter(
            (item): item is JobFeedback =>
              Boolean(item && typeof item.jobId === "string" && typeof item.action === "string"),
          )
        : [],
    };
  } catch {
    return INITIAL_STATE;
  }
}

function load(): DemoState {
  if (typeof window === "undefined") return INITIAL_STATE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === rawCache) return snapshot;
  rawCache = raw;
  snapshot = parse(raw);
  return snapshot;
}

function persist(next: DemoState) {
  snapshot = next;
  const raw = JSON.stringify(next);
  rawCache = raw;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(DEMO_EVENT));
}

function patch(partial: Partial<DemoState>) {
  persist({ ...load(), ...partial });
}

export function subscribeDemo(onChange: () => void) {
  const handler = () => {
    load();
    onChange();
  };
  window.addEventListener(DEMO_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(DEMO_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function readDemo() {
  return load();
}

export function readDemoSnapshot() {
  return INITIAL_STATE;
}

function readDemoClient() {
  return clientReady ? load() : INITIAL_STATE;
}

export function useDemo() {
  const state = useSyncExternalStore(
    subscribeDemo,
    readDemoClient,
    readDemoSnapshot,
  );
  useEffect(() => {
    if (clientReady) return;
    clientReady = true;
    rawCache = null;
    load();
    window.dispatchEvent(new Event(DEMO_EVENT));
  }, []);
  return state;
}

export function setSearch(query: string, location: string) {
  patch({ query, location });
}

export function setFilters(filters: DemoFilters) {
  patch({ filters });
}

export function resetFilters() {
  patch({ filters: EMPTY_FILTERS, sort: "relevant" });
}

export function setSort(sort: DemoSort) {
  patch({ sort });
}

export function applySampleProfile(profile: CareerProfile = SAMPLE_PROFILE) {
  patch({ profile: syncProfile(profile), personalized: true });
}

export function writeProfile(profile: CareerProfile) {
  patch({ profile: syncProfile(profile), personalized: true });
}

export function completeProfile(profile: CareerProfile) {
  const next = syncProfile(profile);
  patch({
    profile: next,
    personalized: true,
    location: next.location || "",
  });
  return "/onboarding/roles";
}

function uniqueLabels(values: string[]) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(trimmed);
  }
  return next;
}

export type RoleSelectionPrefs = {
  workModes: WorkMode[];
  levels: Level[];
  employment: Employment[];
  industries: Industry[];
  salaryMin: number;
};

export function completeRoleSelection(
  roles: string[],
  locations: string[],
  prefs: RoleSelectionPrefs,
) {
  const current = load();
  const unique = uniqueLabels(roles);
  const places = uniqueLabels(locations);
  const base = current.profile ?? blankProfile();
  const remote =
    prefs.workModes.length === 1 ? prefs.workModes[0] : base.remote || "flexible";
  const next = syncProfile({
    ...base,
    desiredRoles: unique,
    desiredLocations: places,
    location: places[0] || base.location,
    remote,
    salaryMin: prefs.salaryMin || base.salaryMin,
  });
  patch({
    profile: next,
    personalized: true,
    roleTags: unique,
    locationTags: places,
    query: unique[0] || "",
    location: places[0] || "",
    filters: {
      ...current.filters,
      title: "",
      location: "",
      workModes: prefs.workModes,
      levels: prefs.levels,
      employment: prefs.employment,
      industries: prefs.industries,
      salaryMin: prefs.salaryMin,
    },
  });
  return matchedJobsPath(next);
}

export function toggleRoleTag(role: string) {
  const current = load();
  const roleTags = current.roleTags.includes(role)
    ? current.roleTags.filter((item) => item !== role)
    : [...current.roleTags, role];
  const profile = current.profile;
  const desired = uniqueLabels([
    ...(profile?.desiredRoles ?? []),
    ...(roleTags.includes(role) ? [role] : []),
  ]);
  patch({
    roleTags,
    query: roleTags[0] || "",
    profile: profile
      ? syncProfile({ ...profile, desiredRoles: desired })
      : profile,
  });
}

export function toggleLocationTag(place: string) {
  const current = load();
  const locationTags = current.locationTags.includes(place)
    ? current.locationTags.filter((item) => item !== place)
    : [...current.locationTags, place];
  const profile = current.profile;
  const desired = uniqueLabels([
    ...(profile?.desiredLocations ?? []),
    ...(locationTags.includes(place) ? [place] : []),
  ]);
  patch({
    locationTags,
    location: locationTags[0] || "",
    profile: profile
      ? syncProfile({
          ...profile,
          desiredLocations: desired,
          location: locationTags[0] || profile.location,
        })
      : profile,
  });
}

export function addRoleTag(role: string) {
  const trimmed = uniqueLabels([role])[0];
  if (!trimmed) return;
  const current = load();
  const profile = current.profile ?? blankProfile();
  const desiredRoles = uniqueLabels([...profile.desiredRoles, trimmed]);
  const roleTags = uniqueLabels([...current.roleTags, trimmed]);
  patch({
    profile: syncProfile({ ...profile, desiredRoles }),
    roleTags,
    query: roleTags[0] || "",
  });
}

export function addLocationTag(place: string) {
  const trimmed = uniqueLabels([place])[0];
  if (!trimmed) return;
  const current = load();
  const profile = current.profile ?? blankProfile();
  const desiredLocations = uniqueLabels([...profile.desiredLocations, trimmed]);
  const locationTags = uniqueLabels([...current.locationTags, trimmed]);
  patch({
    profile: syncProfile({
      ...profile,
      desiredLocations,
      location: locationTags[0] || profile.location,
    }),
    locationTags,
    location: locationTags[0] || "",
  });
}

export function skipPersonalize() {
  patch({ personalized: false, profile: null });
}

export function toggleSave(jobId: string) {
  const current = load();
  if (current.savedIds.includes(jobId)) {
    patch({
      savedIds: current.savedIds.filter((id) => id !== jobId),
      applications: current.applications.filter((item) => item.jobId !== jobId),
    });
    return { needsSignup: false, saved: false };
  }
  patch({ savedIds: [jobId, ...current.savedIds] });
  return { needsSignup: false, saved: true };
}

export function completeSignup(email = "alex@gmail.com") {
  const current = load();
  const savedIds = current.pendingSaveId
    ? [current.pendingSaveId, ...current.savedIds.filter((id) => id !== current.pendingSaveId)]
    : current.savedIds;
  patch({
    signedUp: true,
    email,
    savedIds,
    pendingSaveId: null,
  });
}

export function dismissSignup() {
  patch({ pendingSaveId: null });
}

export const FEEDBACK_REASON_LABEL: Record<FeedbackReason, string> = {
  wrong_role: "Wrong role",
  wrong_location: "Wrong location",
  salary: "Salary too low",
  seniority: "Seniority mismatch",
  industry: "Industry not interesting",
  other: "Other",
};

export function setJobFeedback(
  jobId: string,
  action: FeedbackAction,
  reason?: FeedbackReason,
) {
  const current = load();
  const next: JobFeedback = {
    jobId,
    action,
    reason,
    updatedAt: Date.now(),
  };
  const jobFeedback = [
    next,
    ...current.jobFeedback.filter((item) => item.jobId !== jobId),
  ];
  const extra: Partial<DemoState> = {};
  if (action === "save_later" && !current.savedIds.includes(jobId)) {
    extra.savedIds = [jobId, ...current.savedIds];
  }
  if (action === "interested") {
    const existing = current.applications.find((item) => item.jobId === jobId);
    extra.applications = [
      {
        jobId,
        status: existing?.status && existing.status !== "interested" ? existing.status : "interested",
        notes: existing?.notes ?? "",
        followUp: existing?.followUp ?? "",
        updatedAt: Date.now(),
      },
      ...current.applications.filter((item) => item.jobId !== jobId),
    ];
    extra.savedIds = current.savedIds.includes(jobId)
      ? current.savedIds
      : [jobId, ...current.savedIds];
  }
  patch({ jobFeedback, ...extra });
}

export function clearJobFeedback(jobId: string) {
  patch({
    jobFeedback: load().jobFeedback.filter((item) => item.jobId !== jobId),
  });
}

export function upsertApplication(
  jobId: string,
  update: Partial<Pick<DemoApplication, "status" | "notes" | "followUp">>,
) {
  const current = load();
  const existing = current.applications.find((item) => item.jobId === jobId);
  const next: DemoApplication = {
    jobId,
    status: update.status ?? existing?.status ?? "preparing",
    notes: update.notes ?? existing?.notes ?? "",
    followUp: update.followUp ?? existing?.followUp ?? "",
    updatedAt: Date.now(),
  };
  const savedIds = current.savedIds.includes(jobId)
    ? current.savedIds
    : [jobId, ...current.savedIds];
  patch({
    savedIds,
    applications: [next, ...current.applications.filter((item) => item.jobId !== jobId)],
  });
}

export function resetDemo() {
  persist(INITIAL_STATE);
}
