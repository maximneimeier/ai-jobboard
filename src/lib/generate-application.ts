import type { WorkMode } from "./jobs";
import { profileCriteria, type UserProfile } from "./profile";
import { criteriaChips, type DetailCheck } from "./search";

export type JobSource = {
  id: string;
  role: string;
  company: string;
  city: string;
  workMode: WorkMode;
  salaryMin: number;
  salaryMax: number;
  stack: string[];
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  fits?: string[];
  gaps?: string[];
  responsibilityChecks?: DetailCheck[];
  requirementChecks?: DetailCheck[];
};

function workModeLabel(mode: WorkMode) {
  if (mode === "remote") return "Remote";
  if (mode === "hybrid") return "Hybrid";
  return "vor Ort";
}

function todayLabel() {
  return new Date().toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function displayName(profile: UserProfile) {
  return profile.name.trim() || "Dein Name";
}

function overlapping(job: JobSource, profile: UserProfile) {
  const criteria = profileCriteria(profile);
  const hay = `${profile.bio} ${criteria.stack.join(" ")} ${criteriaChips(criteria).join(" ")}`.toLowerCase();
  return job.stack.filter((item) => hay.includes(item.toLowerCase()) || profile.bio.toLowerCase().includes(item.toLowerCase()));
}

function matchingLines(lines: string[] | undefined, checks: DetailCheck[] | undefined, profile: UserProfile) {
  if (checks?.length) {
    const fitted = checks.filter((item) => item.fit).map((item) => item.text);
    if (fitted.length) return fitted.slice(0, 6);
  }
  const hay = profile.bio.toLowerCase();
  const picked = (lines ?? []).filter((line) => {
    const words = line.toLowerCase().split(/[^a-zäöüß0-9+]+/).filter((word) => word.length > 3);
    return words.some((word) => hay.includes(word));
  });
  return (picked.length ? picked : lines ?? []).slice(0, 5);
}

function sourceHighlights(sourceCv: string, job: JobSource) {
  if (!sourceCv) return [];
  const needles = [job.role, job.company, ...job.stack]
    .join(" ")
    .toLowerCase()
    .split(/[^a-zäöüß0-9+]+/)
    .filter((word) => word.length > 3);
  return sourceCv
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 12 && needles.some((word) => line.toLowerCase().includes(word)))
    .slice(0, 6);
}

function profileSentence(profile: UserProfile, job: JobSource) {
  const bio = profile.bio.trim();
  if (bio) {
    const first = bio.split(/(?<=[.!?])\s+/)[0] ?? bio;
    return `${first.replace(/\.$/, "")}. Die Rolle als ${job.role} bei ${job.company} trifft das, woran ich gerade arbeiten will.`;
  }
  return `Ich bewerbe mich als ${job.role} bei ${job.company} und richte Lebenslauf und Anschreiben auf diese Stelle aus.`;
}

export function generateApplication(
  job: JobSource,
  profile: UserProfile,
  sourceCv = "",
) {
  const name = displayName(profile);
  const criteria = profileCriteria(profile);
  const chips = criteriaChips(criteria);
  const overlap = overlapping(job, profile);
  const skills = [...new Set([...overlap, ...job.stack.slice(0, 4), ...chips.slice(0, 4)])];
  const tasks = matchingLines(job.responsibilities, job.responsibilityChecks, profile);
  const needs = matchingLines(job.requirements, job.requirementChecks, profile);
  const highlights = sourceHighlights(sourceCv, job);
  const location = [job.city, workModeLabel(job.workMode)].filter(Boolean).join(", ");
  const contact = [profile.email.trim(), profile.name.trim() ? chips[0] : ""]
    .filter(Boolean)
    .join(" · ");

  const cv = [
    name,
    contact || location,
    "",
    "## Profil",
    profileSentence(profile, job),
    "",
    "## Schwerpunkte",
    ...skills.map((item) => `- ${item}`),
    "",
    `## Passung zu ${job.company}`,
    ...needs.map((item) => `- ${item}`),
    ...(tasks.length
      ? [
          "",
          "## Aufgaben, die ich übernehmen kann",
          ...tasks.map((item) => `- ${item}`),
        ]
      : []),
    ...(highlights.length
      ? ["", "## Aus dem Lebenslauf", ...highlights.map((item) => `- ${item}`)]
      : []),
    "",
    "## Rahmen",
    `${location}. Gehalt laut Stelle ${job.salaryMin} bis ${job.salaryMax}k.`,
  ]
    .filter((line, index, list) => !(line === "" && list[index - 1] === ""))
    .join("\n")
    .trim();

  const fits = (job.fits?.length ? job.fits : needs).slice(0, 3);
  const gap = job.gaps?.[0];
  const letter = [
    `${job.city || "Berlin"}, ${todayLabel()}`,
    "",
    job.company,
    `Bewerbung als ${job.role}`,
    "",
    "Guten Tag,",
    "",
    profileSentence(profile, job),
    "",
    fits.length
      ? `Besonders nah an der Stelle sind für mich ${fits.join(", ").toLowerCase()}.`
      : `Die Beschreibung zu ${job.role} trifft meinen Schwerpunkt.`,
    gap
      ? `Wo es noch Lücken gibt, etwa ${gap.toLowerCase()}, hole ich das im Alltag schnell nach.`
      : "",
    "",
    `Ich arbeite ${workModeLabel(job.workMode)} und kann zeitnah starten. Gerne zeige ich das im Gespräch.`,
    "",
    "Mit freundlichen Grüßen",
    name,
  ]
    .filter((line, index, list) => !(line === "" && list[index - 1] === ""))
    .join("\n")
    .trim();

  return { cv, letter };
}
