import {
  CITY_COUNTRY,
  DEMO_JOBS,
  catalogJobTitles,
  catalogLocations,
  type DemoJob,
  type Level,
} from "./jobs";
import { profileSkills, type CareerProfile, type DemoFilters, type DemoSort } from "./store";

export type SearchLabel = "match" | "similar" | "outside";
export type FitLabel = "strong" | "good" | "stretch" | "review";
export type MatchStatus = "confirmed" | "unverified";

export type RankedDemoJob = DemoJob & {
  score: number;
  searchLabel: SearchLabel;
  fit?: FitLabel;
  why: string[];
  consider: string[];
  summaryLine: string;
};

export type MatchCheck = {
  label: string;
  status: MatchStatus;
  kind: "skill" | "language";
};

export type RequirementRow = {
  label: string;
  state: "fulfilled" | "clarify" | "listed";
};

export type MatchAnalysis = {
  confirmedSkills: string[];
  unverifiedSkills: string[];
  confirmedLanguages: string[];
  unverifiedLanguages: string[];
  requirements: RequirementRow[];
  career: string;
  challenges: string[];
  nextSteps: string[];
  summary: string;
};

export type SuggestedRole = {
  title: string;
  reason: string;
  recommended: boolean;
};

export type SuggestedPlace = {
  label: string;
  kind: "city" | "country" | "remote";
  reason: string;
  recommended: boolean;
};

const KNOWN_LANGUAGES = ["English", "German", "French", "Dutch", "Spanish", "Italian"];

const CITY_ALIASES: Record<string, string> = {
  munich: "Munich",
  muenchen: "Munich",
  münchen: "Munich",
  berlin: "Berlin",
  london: "London",
  amsterdam: "Amsterdam",
  hamburg: "Hamburg",
  zurich: "Zurich",
  zürich: "Zurich",
  remote: "Remote",
};

export function fold(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss");
}

export function normalizeCity(value: string) {
  const first = value.split(",")[0]?.trim() || value.trim();
  const key = fold(first);
  return CITY_ALIASES[key] ?? first;
}

function tokens(value: string) {
  return fold(value)
    .split(/[^a-z0-9]+/)
    .filter((item) => item.length > 2);
}

const INDUSTRY_KEYWORDS: Record<DemoJob["industry"], string[]> = {
  technology: ["software", "engineer", "developer", "engineering", "tech", "product", "typescript", "react"],
  finance: ["finance", "investment", "analyst", "banking", "equity", "valuation", "controller"],
  consulting: ["consulting", "consultant", "strategy", "advisory"],
  marketing: ["marketing", "brand", "growth", "content", "campaign"],
  healthcare: ["healthcare", "clinical", "medical", "hospital", "trial"],
  marketplace: ["marketplace", "seller", "two-sided"],
  industrial: ["industrial", "operations", "manufacturing", "supply", "plant"],
  media: ["media", "editorial", "publisher", "newsroom"],
};

function closeMatch(hay: string, needle: string) {
  if (!needle) return false;
  if (hay.includes(needle)) return true;
  if (needle.endsWith("ing") && hay.includes(needle.slice(0, -3))) return true;
  if (needle.endsWith("ing") && hay.includes(`${needle.slice(0, -3)}er`)) return true;
  if (needle.endsWith("ment") && hay.includes(`${needle.slice(0, -4)}er`)) return true;
  return false;
}

function titleHit(job: DemoJob, query: string) {
  const q = fold(query);
  const title = fold(job.title);
  if (!q) return 0;
  if (closeMatch(title, q)) return 40;
  const parts = tokens(query);
  return parts.reduce((sum, part) => sum + (closeMatch(title, part) ? 12 : 0), 0);
}

function queryHit(job: DemoJob, query: string) {
  if (!query.trim()) return 0;
  let score = titleHit(job, query);
  const q = fold(query);
  const industry = fold(INDUSTRY_LABEL[job.industry]);
  if (q === industry || closeMatch(industry, q) || closeMatch(q, industry)) {
    score = Math.max(score, 36);
  }
  if ((INDUSTRY_KEYWORDS[job.industry] ?? []).some((key) => closeMatch(q, key) || closeMatch(key, q))) {
    score = Math.max(score, 32);
  }
  const blob = fold([job.title, job.summary, job.description, ...job.skills].join(" "));
  if (closeMatch(blob, q)) score = Math.max(score, 18);
  const parts = tokens(query);
  score += parts.filter((part) => closeMatch(blob, part)).length * 4;
  return score;
}

function placeMatchesJob(job: DemoJob, place: string) {
  const wanted = normalizeCity(place);
  const wantedFold = fold(wanted);
  if (!wantedFold) return { score: 0, match: true };
  if (fold(job.location) === wantedFold) return { score: 24, match: true };
  const jobCountry = CITY_COUNTRY[job.location];
  if (jobCountry && fold(jobCountry) === wantedFold) return { score: 20, match: true };
  if (wantedFold === "remote" && (job.location === "Remote" || job.workMode === "remote")) {
    return { score: 16, match: true };
  }
  if (wantedFold !== "remote" && (job.location === "Remote" || job.workMode === "remote")) {
    return { score: 8, match: true };
  }
  return { score: 0, match: false };
}

function locationHit(job: DemoJob, location: string | string[]) {
  const places = (Array.isArray(location) ? location : [location])
    .map((item) => item.trim())
    .filter(Boolean);
  if (!places.length) return { score: 0, match: true };
  let best = { score: 0, match: false };
  for (const place of places) {
    const hit = placeMatchesJob(job, place);
    if (hit.match && hit.score >= best.score) best = hit;
  }
  return best;
}

function uniqueByFold<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();
  const next: T[] = [];
  for (const item of items) {
    const folded = fold(key(item));
    if (!folded || seen.has(folded)) continue;
    seen.add(folded);
    next.push(item);
  }
  return next;
}

function skillOverlap(job: DemoJob, skills: string[]) {
  const jobSkills = job.skills.map(fold);
  return skills.filter((skill) =>
    jobSkills.some((item) => item.includes(fold(skill)) || fold(skill).includes(item)),
  );
}

function hasSkill(have: string[], skill: string) {
  const needle = fold(skill);
  return have.some((item) => {
    const hay = fold(item);
    return hay.includes(needle) || needle.includes(hay);
  });
}

function jobLanguageMentions(job: DemoJob) {
  const blob = fold(
    [...job.requirements, job.description, job.summary, job.title].join(" "),
  );
  return KNOWN_LANGUAGES.filter((language) => blob.includes(fold(language)));
}

export function matchChecks(
  job: DemoJob,
  profile: CareerProfile | null,
): MatchCheck[] {
  const haveSkills = profile ? profileSkills(profile).map(fold) : [];
  const haveLanguages = profile ? profile.languages.map(fold) : [];
  const skills: MatchCheck[] = job.skills.map((skill) => ({
    label: skill,
    status: hasSkill(haveSkills, skill) ? "confirmed" : "unverified",
    kind: "skill",
  }));
  const languages: MatchCheck[] = jobLanguageMentions(job).map((language) => ({
    label: language,
    status: hasSkill(haveLanguages, language) ? "confirmed" : "unverified",
    kind: "language",
  }));
  return [...skills, ...languages];
}

export function suggestedRoles(profile: CareerProfile | null): SuggestedRole[] {
  const catalog = catalogJobTitles();
  const seeds = uniqueByFold(
    profile
      ? [
          profile.headline,
          profile.currentRole,
          ...profile.desiredRoles,
          ...profile.experience.map((item) => item.title),
        ]
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
    (item) => item,
  );
  const skillList = profile ? profileSkills(profile).map(fold) : [];

  const scored = catalog.map((title) => {
    let score = 4;
    let reason = "Open on the board right now.";
    for (const seed of seeds) {
      const a = fold(title);
      const b = fold(seed);
      if (a === b || a.includes(b) || b.includes(a)) {
        score += 48;
        reason = `Close to ${seed}.`;
        break;
      }
    }
    const related = DEMO_JOBS.filter((job) => job.title === title);
    const overlap = related.reduce((sum, job) => {
      return sum + job.skills.filter((skill) => hasSkill(skillList, skill)).length;
    }, 0);
    if (overlap) {
      score += overlap * 4;
      if (reason === "Open on the board right now.") {
        reason = "Uses skills from your profile.";
      }
    }
    return { title, reason, score };
  });

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const top = scored.slice(0, 12);
  const extra = seeds.filter(
    (seed) => !top.some((item) => fold(item.title) === fold(seed)),
  );
  return uniqueByFold(
    [
      ...extra.slice(0, 4).map((title) => ({
        title,
        reason: "From your profile.",
        recommended: true,
      })),
      ...top.map((item, index) => ({
        title: item.title,
        reason: item.reason,
        recommended: item.score >= 20 && index < 5,
      })),
    ],
    (item) => item.title,
  );
}

export function suggestedLocations(profile: CareerProfile | null): SuggestedPlace[] {
  const { cities, countries } = catalogLocations();
  const seedText = profile
    ? [
        profile.location,
        ...profile.desiredLocations,
        ...profile.experience.map((item) => item.location),
      ]
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
  const expanded: string[] = [];
  for (const seed of seedText) {
    const city = normalizeCity(seed);
    expanded.push(city);
    const country = CITY_COUNTRY[city];
    if (country && country !== "Remote") expanded.push(country);
    for (const [name, nation] of Object.entries(CITY_COUNTRY)) {
      if (fold(seed).includes(fold(name))) expanded.push(name);
      if (fold(seed).includes(fold(nation))) expanded.push(nation);
    }
  }
  const seeds = uniqueByFold(expanded, (item) => item);
  const catalog: SuggestedPlace[] = [
    ...cities.map((label) => ({
      label,
      kind: (label === "Remote" ? "remote" : "city") as SuggestedPlace["kind"],
      reason: seeds.some((seed) => fold(seed) === fold(label))
        ? "From your profile."
        : label === "Remote"
          ? "Remote roles."
          : "City on the board.",
      recommended: seeds.some((seed) => fold(seed) === fold(label)),
    })),
    ...countries.map((label) => ({
      label,
      kind: "country" as const,
      reason: seeds.some((seed) => fold(seed) === fold(label))
        ? "From your profile."
        : "Country with open roles.",
      recommended: seeds.some((seed) => fold(seed) === fold(label)),
    })),
  ];
  catalog.sort((a, b) => Number(b.recommended) - Number(a.recommended) || a.label.localeCompare(b.label));
  const extra = seeds
    .filter((seed) => !catalog.some((item) => fold(item.label) === fold(seed)))
    .map((label) => ({
      label,
      kind: CITY_COUNTRY[label] ? ("city" as const) : ("country" as const),
      reason: "From your profile.",
      recommended: true,
    }));
  return uniqueByFold([...extra, ...catalog], (item) => item.label);
}

function levelGap(profileYears: number, level: Level) {
  if (level === "senior" || level === "lead") return profileYears < 4;
  if (level === "mid") return profileYears < 1;
  return false;
}

export function rankDemoJobs(
  query: string,
  location: string,
  filters: DemoFilters,
  sort: DemoSort,
  profile: CareerProfile | null,
  personalized: boolean,
  roleTags: string[] = [],
  locationTags: string[] = [],
): RankedDemoJob[] {
  const filterLocation = filters.location || location;
  const filterTitle = filters.title || query;
  const roleQueries = roleTags.length
    ? roleTags
    : filterTitle.trim()
      ? [filterTitle]
      : [];
  const locationQueries = locationTags.length
    ? locationTags
    : filterLocation.trim()
      ? [filterLocation]
      : [];

  const ranked = DEMO_JOBS.map((job) => {
    const titleScore = roleQueries.length
      ? Math.max(...roleQueries.map((role) => queryHit(job, role)))
      : queryHit(job, filterTitle);
    const loc = locationHit(job, locationQueries);
    let score = 20 + titleScore + loc.score;

    const skillQuery = tokens(filterTitle);
    const skillHits = job.skills.filter((skill) =>
      skillQuery.some((part) => fold(skill).includes(part)),
    ).length;
    score += skillHits * 6;

    let searchLabel: SearchLabel = "similar";
    if (titleScore >= 24 && loc.match) searchLabel = "match";
    else if (titleScore >= 24 && !loc.match) searchLabel = "outside";

    const why: string[] = [];
    const consider: string[] = [];
    let fit: FitLabel | undefined;

    if (personalized && profile) {
      const roles = profile.desiredRoles.map(fold);
      const roleHit = roles.some(
        (role) => fold(job.title).includes(role) || role.includes(fold(job.title)),
      );
      const skillList = profileSkills(profile);
      const skills = skillOverlap(job, skillList);
      const locMatch = locationHit(
        job,
        locationQueries.length ? locationQueries : profile.desiredLocations.length
          ? profile.desiredLocations
          : profile.location,
      ).match;
      const stretchLevel = levelGap(profile.years, job.level);
      const salaryGap =
        job.salaryMin !== undefined && profile.salaryMin
          ? job.salaryMax !== undefined && job.salaryMax < profile.salaryMin
          : false;

      if (roleHit) why.push(`This role sits close to ${profile.desiredRoles[0]}.`);
      if (skills.length) {
        why.push(
          `Your ${skills.slice(0, 2).join(" and ")} experience matches the listing.`,
        );
      }
      if (locMatch) why.push("The location matches your preference.");
      if (profile.years && !stretchLevel) {
        why.push("Your experience level is relevant for this role.");
      }

      const missing = job.skills.filter((skill) => !hasSkill(skillList, skill));
      if (missing[0]) {
        consider.push(`${missing[0]} is listed and not yet on your profile.`);
      }
      if (job.salaryMin === undefined) consider.push("Salary is not listed.");
      const languages = jobLanguageMentions(job);
      const haveLanguages = profile.languages.map(fold);
      const languageHit = languages.filter((language) => hasSkill(haveLanguages, language));
      const languageMiss = languages.filter((language) => !hasSkill(haveLanguages, language));
      if (languageHit.length) {
        why.push(`You cover ${languageHit.slice(0, 2).join(" and ")}.`);
      }
      if (languageMiss[0]) {
        consider.push(`${languageMiss[0]} is listed on this posting.`);
      }
      if (stretchLevel) consider.push("The role is aimed at more years of experience.");
      if (salaryGap) consider.push("The listed salary is below your expectation.");
      if (
        (profile.notes || profile.dealBreakers) &&
        (fold(job.summary).includes("on-call") || fold(job.description).includes("on-call"))
      ) {
        consider.push("Check how heavy the on-call load is.");
      }
      if (!consider.length) consider.push("Confirm the remaining requirements in the posting.");

      const incompleteProfile =
        skillList.length < 2 || (languages.length > 0 && profile.languages.length === 0);
      const salaryUnknown = job.salaryMin === undefined && profile.salaryMin > 0;

      if (roleHit && skills.length >= 2 && locMatch && !stretchLevel && !salaryGap) {
        fit = "strong";
      } else if (incompleteProfile || salaryUnknown) {
        fit = "review";
      } else if (stretchLevel || (!roleHit && skills.length < 2)) {
        fit = "stretch";
      } else {
        fit = "good";
      }

      score += roleHit ? 18 : 0;
      score += skills.length * 8;
      score += locMatch ? 10 : 0;
      if (stretchLevel) score -= 12;
    } else {
      if (titleScore >= 24) why.push("The title matches your search.");
      if (loc.match && locationQueries.length) why.push("The location matches your search.");
      if (!why.length) why.push("Similar role to your search.");
      if (!loc.match && locationQueries.length) consider.push("The location differs from your search.");
      if (!job.salaryMin) consider.push("Salary is not listed.");
      if (!consider.length) {
        consider.push("Without a profile we only show search closeness, not fit.");
      }
    }

    if (roleQueries.length && titleScore < 12) score = -1;
    if (filters.title.trim() && queryHit(job, filters.title) < 12) score = -1;
    if (locationQueries.length && !loc.match) score = -1;
    if (filters.location.trim() && !locationHit(job, filters.location).match) {
      score = -1;
    }
    if (filters.workModes.length && !filters.workModes.includes(job.workMode)) {
      score = -1;
    }
    if (filters.levels.length && !filters.levels.includes(job.level)) score = -1;
    if (filters.industries.length && !filters.industries.includes(job.industry)) {
      score = -1;
    }
    if (filters.employment.length && !filters.employment.includes(job.employment)) {
      score = -1;
    }
    if (filters.salaryMin && (job.salaryMax ?? 0) < filters.salaryMin) score = -1;
    if (filters.maxAgeDays && job.postedDaysAgo > filters.maxAgeDays) score = -1;

    const ranked = { ...job, score, searchLabel, fit, why, consider, summaryLine: "" };
    ranked.summaryLine = matchSummary(ranked, profile, personalized);

    if (filters.fits?.length && (!fit || !filters.fits.includes(fit))) score = -1;
    ranked.score = score;

    return ranked;
  }).filter((job) => job.score >= 0);

  ranked.sort((a, b) => {
    if (sort === "recent") return a.postedDaysAgo - b.postedDaysAgo;
    if (sort === "salary") return (b.salaryMax ?? 0) - (a.salaryMax ?? 0);
    return b.score - a.score;
  });

  return ranked;
}

export const SEARCH_LABEL: Record<SearchLabel, string> = {
  match: "Matches your search",
  similar: "Similar role",
  outside: "Outside selected location",
};

export const FIT_LABEL: Record<FitLabel, string> = {
  strong: "Strong match",
  good: "Good match",
  stretch: "Stretch opportunity",
  review: "Needs review",
};

export const FIT_CLASS: Record<FitLabel, string> = {
  strong: "bg-success-soft text-success-text",
  good: "bg-accent-soft text-accent",
  stretch: "bg-warning-soft text-warning-text",
  review: "bg-surface-soft text-ink ring-1 ring-hairline",
};

export const FIT_OPTIONS: FitLabel[] = ["strong", "good", "stretch", "review"];

export const WORK_MODE_LABEL: Record<DemoJob["workMode"], string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export const LEVEL_LABEL: Record<Level, string> = {
  intern: "Intern",
  junior: "Junior",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
};

export const EMPLOYMENT_LABEL: Record<DemoJob["employment"], string> = {
  fulltime: "Full-time",
  parttime: "Part-time",
  contract: "Contract",
};

export const INDUSTRY_LABEL: Record<DemoJob["industry"], string> = {
  technology: "Technology",
  finance: "Finance",
  consulting: "Consulting",
  marketing: "Marketing",
  healthcare: "Healthcare",
  marketplace: "Marketplace",
  industrial: "Industrial",
  media: "Media",
};

export function salaryLabel(job: DemoJob) {
  if (!job.salaryMin || !job.salaryMax) return "Salary on request";
  return `${job.salaryMin}–${job.salaryMax}k`;
}

export function postedLabel(days: number) {
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "Last 14 days";
  return `${days} days ago`;
}

export function matchSummary(
  job: RankedDemoJob,
  profile: CareerProfile | null,
  personalized: boolean,
) {
  if (personalized && profile) {
    const skills = skillOverlap(job, profileSkills(profile)).slice(0, 2);
    const locMatch = locationHit(
      job,
      profile.desiredLocations.length ? profile.desiredLocations : profile.location,
    ).match;
    const skillLine =
      skills.length === 2
        ? `Your ${skills[0]} and ${skills[1]} experience aligns with the core requirements.`
        : skills.length === 1
          ? `Your ${skills[0]} experience aligns with this listing.`
          : "";
    if (job.fit === "stretch") {
      return skillLine
        ? `${skillLine} Seniority is a step up from your current experience.`
        : "This role could support your next step, with more seniority than your current experience.";
    }
    if (job.fit === "review") {
      if (!job.salaryMin && profile.salaryMin) {
        return skillLine
          ? `${skillLine} Compensation is not listed, so the salary fit is unclear.`
          : "Compensation is not listed, so this match needs a closer look.";
      }
      if (profileSkills(profile).length < 2) {
        return "Add more skills to your profile to judge this listing with more confidence.";
      }
      return skillLine || "Some listed requirements still need confirmation against your profile.";
    }
    if (skillLine && locMatch) {
      return `${skillLine} The role also matches your preferred location.`;
    }
    if (skillLine) return skillLine;
    if (locMatch) {
      return `This role is in ${job.location}, which matches your location preference.`;
    }
    return "This title is related to the roles you selected.";
  }
  if (job.searchLabel === "match") return "The title and location match your current search.";
  if (job.searchLabel === "outside") {
    return "The title matches your search, in a different location.";
  }
  return "Similar to roles in your current search.";
}

export function analyzeMatch(
  job: RankedDemoJob,
  profile: CareerProfile | null,
): MatchAnalysis {
  const checks = matchChecks(job, profile);
  const confirmedSkills = checks
    .filter((item) => item.kind === "skill" && item.status === "confirmed")
    .map((item) => item.label);
  const unverifiedSkills = checks
    .filter((item) => item.kind === "skill" && item.status === "unverified")
    .map((item) => item.label);
  const confirmedLanguages = checks
    .filter((item) => item.kind === "language" && item.status === "confirmed")
    .map((item) => item.label);
  const unverifiedLanguages = checks
    .filter((item) => item.kind === "language" && item.status === "unverified")
    .map((item) => item.label);
  const skillList = profile ? profileSkills(profile) : [];

  const requirements: RequirementRow[] = job.requirements.map((label) => {
    const mentioned = job.skills.find((skill) => fold(label).includes(fold(skill)));
    if (mentioned && hasSkill(skillList, mentioned)) {
      return { label, state: "fulfilled" as const };
    }
    if (mentioned) return { label, state: "clarify" as const };
    return { label, state: "listed" as const };
  });

  const notes = profile?.notes.trim() ?? "";
  let career = "No career goal is saved on your profile yet.";
  if (profile?.desiredRoles[0]) {
    const close = profile.desiredRoles.some(
      (role) => fold(job.title).includes(fold(role)) || fold(role).includes(fold(job.title)),
    );
    career = close
      ? `This listing sits close to ${profile.desiredRoles[0]}, which you selected as a target role.`
      : `Your target roles are ${profile.desiredRoles.slice(0, 2).join(" and ")}. This title is adjacent, not an exact match.`;
  } else if (notes) {
    career = `From your notes: “${notes.slice(0, 140)}${notes.length > 140 ? "…" : ""}”`;
  }
  if (notes && profile?.desiredRoles[0]) {
    career = `${career} Your notes: “${notes.slice(0, 140)}${notes.length > 140 ? "…" : ""}”`;
  }

  const nextSteps: string[] = [];
  for (const skill of unverifiedSkills.slice(0, 2)) {
    nextSteps.push(`Check whether you can show ${skill} on your profile or in an application.`);
  }
  if (unverifiedLanguages[0]) {
    nextSteps.push(`Confirm the ${unverifiedLanguages[0]} requirement against the original posting.`);
  }
  if (job.salaryMin === undefined) {
    nextSteps.push("Confirm compensation on the original posting.");
  }
  if (job.fit === "stretch") {
    nextSteps.push("Decide if you want this as a stretch, then highlight the closest experience you have.");
  }
  if (profile && nextSteps.length < 3) {
    nextSteps.push("Prepare a tailored application that leads with relevant shipped work.");
  }
  if (!nextSteps.length) {
    nextSteps.push("Open the original posting and confirm the remaining details before you apply.");
  }

  return {
    confirmedSkills,
    unverifiedSkills,
    confirmedLanguages,
    unverifiedLanguages,
    requirements,
    career,
    challenges: job.consider,
    nextSteps: nextSteps.slice(0, 4),
    summary: job.summaryLine,
  };
}

export function rankingHint(personalized: boolean) {
  return personalized
    ? "Ranked by skills, role, location, seniority, and how recently the job was posted."
    : "Ranked by how closely the title and location match your search.";
}
