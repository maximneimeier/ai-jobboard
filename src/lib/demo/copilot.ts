export type CopilotMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export const COPILOT_PROMPTS = [
  "Find more jobs like this.",
  "Why does this role fit me?",
  "Show jobs with higher salaries.",
  "How can I improve my application?",
  "What should I do next?",
];

export function copilotReply(prompt: string) {
  const text = prompt.toLowerCase();
  if (text.includes("like this") || text.includes("more jobs")) {
    return "Other TypeScript product roles in Berlin sit close to Software Engineer. Filter to hybrid or on-site if remote is less relevant, or keep remote in if you want more range.";
  }
  if (text.includes("why") || text.includes("fit")) {
    return "This looks like a fit because of your desired role, TypeScript and React, Berlin, and junior level. Confirm language requirements and on-site days before you apply.";
  }
  if (text.includes("salary") || text.includes("higher")) {
    return "Sort results by salary. Staff Software Engineer and Engineering Manager sit higher and are usually a stretch at two years of experience.";
  }
  if (text.includes("application") || text.includes("improve")) {
    return "Lead with shipped product work, two concrete features, and TypeScript or React in context. Keep the letter short and specific to the team.";
  }
  if (text.includes("next")) {
    return "Save two strong fits, mark one as preparing, and set a follow-up. Then check the posting against your deal-breakers.";
  }
  return "I can help with similar roles, fit, salary, and next steps. Try one of the suggested prompts, or go back to your results.";
}
