import type { DemoJob } from "./jobs";
import { WORK_MODE_LABEL } from "./match";
import type { CareerProfile } from "./store";

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function displayName(profile: CareerProfile | null) {
  return profile?.fullName.trim() || "Your name";
}

function skillOverlap(job: DemoJob, profile: CareerProfile | null) {
  if (!profile) return job.skills.slice(0, 6);
  const hay = [...profile.skills, ...profile.abilities]
    .join(" ")
    .toLowerCase();
  const confirmed = job.skills.filter((skill) => hay.includes(skill.toLowerCase()));
  return [...new Set([...confirmed, ...job.skills.slice(0, 4)])].slice(0, 8);
}

function experienceLines(profile: CareerProfile | null) {
  if (!profile?.experience.length) return [];
  return profile.experience
    .filter((item) => item.title.trim() || item.company.trim())
    .slice(0, 4)
    .map((item) => {
      const when = item.current
        ? `${item.start || "Recent"} – Present`
        : [item.start, item.end].filter(Boolean).join(" – ");
      const role = [item.title, item.company].filter((part) => part.trim()).join(" at ");
      return [role, when, item.description].filter(Boolean).join(". ");
    });
}

export function generateDemoApplication(
  job: DemoJob,
  profile: CareerProfile | null,
) {
  const name = displayName(profile);
  const skills = skillOverlap(job, profile);
  const experience = experienceLines(profile);
  const headline =
    profile?.headline.trim() ||
    profile?.currentRole.trim() ||
    job.title;
  const location = [job.location, WORK_MODE_LABEL[job.workMode]]
    .filter(Boolean)
    .join(", ");
  const languages = profile?.languages.filter(Boolean).join(", ");
  const education = profile?.education.trim();

  const cv = [
    name,
    [headline, profile?.location || job.location].filter(Boolean).join(" · "),
    "",
    "## Profile",
    profile?.notes.trim() ||
      `Software professional targeting ${job.title} roles. Comfortable shipping product work and collaborating with design and engineering.`,
    "",
    "## Skills",
    ...skills.map((item) => `- ${item}`),
    ...(languages ? ["", "## Languages", `- ${languages}`] : []),
    ...(experience.length
      ? ["", "## Experience", ...experience.map((item) => `- ${item}`)]
      : []),
    ...(education ? ["", "## Education", `- ${education}`] : []),
    "",
    `## Why ${job.company}`,
    ...job.requirements.slice(0, 4).map((item) => `- ${item}`),
    "",
    "## Role context",
    `${location}. ${job.summary}`,
  ]
    .filter((line, index, list) => !(line === "" && list[index - 1] === ""))
    .join("\n")
    .trim();

  const letter = [
    `${job.location}, ${todayLabel()}`,
    "",
    job.company,
    `Application: ${job.title}`,
    "",
    "Hello,",
    "",
    `I am applying for the ${job.title} role at ${job.company}. ${
      profile?.notes.trim() ||
      "I want to work on product teams where I can own features end to end."
    }`,
    "",
    skills.length
      ? `The posting is a strong fit with my background in ${skills.slice(0, 4).join(", ")}.`
      : `The ${job.title} description matches the kind of work I want to do next.`,
    "",
    job.responsibilities[0]
      ? `I can contribute quickly to work like ${job.responsibilities[0].replace(/\.$/, "").toLowerCase()}.`
      : "",
    "",
    `I am available ${WORK_MODE_LABEL[job.workMode].toLowerCase()} and can start on a reasonable timeline. I would welcome a conversation.`,
    "",
    "Kind regards,",
    name,
  ]
    .filter((line, index, list) => !(line === "" && list[index - 1] === ""))
    .join("\n")
    .trim();

  return { cv, letter };
}
