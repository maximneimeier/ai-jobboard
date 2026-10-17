import { demoJobById } from "./jobs";
import type { CareerProfile, DemoApplication } from "./store";

export type CopilotMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type CopilotContext = {
  profile: CareerProfile | null;
  savedIds: string[];
  applications: DemoApplication[];
  roleTags: string[];
  locationTags: string[];
};

function firstName(profile: CareerProfile | null) {
  const name = profile?.fullName.trim();
  if (!name) return "";
  return name.split(" ")[0] ?? "";
}

function jobLabel(jobId: string) {
  const job = demoJobById(jobId);
  return job ? `${job.title} at ${job.company}` : "this role";
}

function applicationByStatus(ctx: CopilotContext, status: DemoApplication["status"]) {
  return ctx.applications.find((item) => item.status === status) ?? null;
}

function savedJobs(ctx: CopilotContext) {
  return ctx.savedIds.map(demoJobById).filter(Boolean);
}

export function copilotPrompts(ctx: CopilotContext) {
  const interview = applicationByStatus(ctx, "interview");
  const preparing = applicationByStatus(ctx, "preparing");
  const interviewJob = interview ? demoJobById(interview.jobId) : null;
  const preparingJob = preparing ? demoJobById(preparing.jobId) : null;
  return [
    interviewJob
      ? `How should I prepare for the ${interviewJob.company} interview?`
      : "What should I do next this week?",
    "Which saved jobs are the strongest fit?",
    preparingJob
      ? `How can I improve my application for ${preparingJob.company}?`
      : "How can I improve my application?",
    "Find more jobs like my saved roles.",
  ];
}

export function openingMessage(ctx: CopilotContext) {
  const name = firstName(ctx.profile);
  const greeting = name ? `${name}, ` : "";
  const interview = applicationByStatus(ctx, "interview");
  const preparing = applicationByStatus(ctx, "preparing");
  const saved = savedJobs(ctx);
  const roles =
    ctx.roleTags[0] ||
    ctx.profile?.desiredRoles[0] ||
    ctx.profile?.headline ||
    "your target roles";
  const city =
    ctx.locationTags[0] || ctx.profile?.desiredLocations[0] || ctx.profile?.location || "";

  if (interview && preparing) {
    return `${greeting}you have an interview for ${jobLabel(interview.jobId)} and a draft in progress for ${jobLabel(preparing.jobId)}. I can help you prepare, compare your ${saved.length} saved jobs, or pick what to do next.`;
  }
  if (interview) {
    return `${greeting}your next concrete step is the interview for ${jobLabel(interview.jobId)}. Ask me how to prepare, or we can look at similar ${roles}${city ? ` in ${city}` : ""}.`;
  }
  if (saved.length) {
    return `${greeting}you have ${saved.length} saved jobs around ${roles}${city ? ` in ${city}` : ""}. Ask about fit, similar roles, or what to do next.`;
  }
  return `${greeting}ask about fit, similar roles, or what to do next. Start with one of the prompts below.`;
}

export function copilotReply(prompt: string, ctx: CopilotContext) {
  const text = prompt.toLowerCase();
  const profile = ctx.profile;
  const skills = profile?.skills.slice(0, 4).join(", ") || "your core stack";
  const roles = ctx.roleTags.slice(0, 2).join(" and ") || profile?.desiredRoles.slice(0, 2).join(" and ") || "your target roles";
  const city = ctx.locationTags[0] || profile?.desiredLocations[0] || "your preferred locations";
  const interview = applicationByStatus(ctx, "interview");
  const preparing = applicationByStatus(ctx, "preparing");
  const saved = savedJobs(ctx);
  const interviewJob = interview ? demoJobById(interview.jobId) : null;
  const preparingJob = preparing ? demoJobById(preparing.jobId) : null;
  const topSaved = saved[0];

  if (text.includes("interview") || text.includes("prepare for")) {
    if (interviewJob) {
      return `For ${interviewJob.company}, lead with two shipped ${interviewJob.skills.slice(0, 2).join(" and ")} examples from your current work. They hired for ${interviewJob.title} in ${interviewJob.location}, so be ready on hybrid days, product ownership, and how you work with design. Keep a short story for mentoring if they ask about seniority.`;
    }
    return "Pick the interview in your tracker first. Then prepare two shipped examples, one product tradeoff, and a question about the team’s stack.";
  }
  if (text.includes("strongest") || text.includes("saved jobs") || text.includes("which saved")) {
    if (topSaved) {
      return `${topSaved.title} at ${topSaved.company} is the closest saved role: ${skills} overlap the posting, and it sits in ${topSaved.location}. Keep ${saved.length > 1 ? saved.slice(1, 3).map((job) => job && job.company).filter(Boolean).join(" and ") : "the rest"} as backups and go deep on the strongest one this week.`;
    }
    return "Save two strong fits from your results first. Then I can compare them against your profile.";
  }
  if (text.includes("like this") || text.includes("more jobs") || text.includes("like my saved")) {
    return `Other ${roles} in ${city} sit close to what you already saved. Stay on hybrid product teams if that still matches, and keep TypeScript and React in the filters so the list does not drift into adjacent functions.`;
  }
  if (text.includes("why") || text.includes("fit")) {
    return `This looks like a fit because of ${roles}, ${skills}, and ${city}. Confirm language requirements and on-site days before you apply. Your notes already flag product teams over pure maintenance — use that as a filter, not a maybe.`;
  }
  if (text.includes("salary") || text.includes("higher")) {
    return "Sort results by salary. Senior Software Engineer at Northline sits higher and is already in interview. Treat that as stretch-plus-upside, not a replacement for the mid-level Software Engineer applications you already started.";
  }
  if (text.includes("application") || text.includes("improve")) {
    if (preparingJob) {
      return `For ${preparingJob.company}, lead with shipped product work in ${preparingJob.skills.slice(0, 2).join(" and ")}, two concrete features, and why hybrid in ${preparingJob.location} works for you. Keep the letter short and specific to that team — you already noted to tailor the resume that way.`;
    }
    return "Lead with shipped product work, two concrete features, and TypeScript or React in context. Keep the letter short and specific to the team.";
  }
  if (text.includes("next")) {
    if (interviewJob && preparingJob) {
      return `This week: prepare the ${interviewJob.company} conversation, finish the ${preparingJob.company} draft, and leave follow-ups on the roles you already marked applied. Do not start a fifth application until those three move.`;
    }
    if (interviewJob) {
      return `Prepare the ${interviewJob.company} interview first. Then check follow-ups on applied roles and only then open new matches.`;
    }
    return `Save two strong ${roles} fits, mark one as preparing, and set a follow-up. Then check the posting against your deal-breakers.`;
  }
  return `I can help with similar ${roles}, fit against ${skills}, salary, and next steps on your saved jobs. Try one of the suggested prompts, or go back to your results.`;
}
