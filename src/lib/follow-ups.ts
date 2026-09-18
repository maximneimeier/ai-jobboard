import type { Criteria, RankedJob } from "./search";

export type FollowUpOption = {
  label: string;
  query?: string;
};

export type FollowUp = {
  id: string;
  prompt: string;
  options: FollowUpOption[];
};

export function followUpsFor(
  criteria: Criteria,
  results: RankedJob[],
  asked: string[],
): FollowUp[] {
  const pool: FollowUp[] = [];
  const modes = criteria.workModes?.length
    ? criteria.workModes
    : criteria.workMode
      ? [criteria.workMode]
      : [];

  if (!criteria.functions.length) {
    pool.push({
      id: "function",
      prompt: "Welche Richtung soll ich schärfer suchen?",
      options: [
        { label: "Design", query: "Design" },
        { label: "Engineering", query: "Engineering, Software" },
        { label: "Product", query: "Product Manager" },
        { label: "Data", query: "Data, Analytics" },
      ],
    });
  }

  if (!criteria.cities.length && !modes.includes("remote") && !criteria.dach) {
    pool.push({
      id: "city",
      prompt: "Wo soll die Stelle sitzen?",
      options: [
        { label: "Berlin", query: "Berlin" },
        { label: "München", query: "München" },
        { label: "Remote", query: "Remote" },
        { label: "DACH", query: "DACH" },
      ],
    });
  }

  if (!modes.length) {
    pool.push({
      id: "mode",
      prompt: "Wie willst du arbeiten?",
      options: [
        { label: "Remote", query: "Remote" },
        { label: "Hybrid", query: "Hybrid" },
        { label: "Vor Ort", query: "vor Ort" },
      ],
    });
  }

  if (!criteria.salaryMin) {
    pool.push({
      id: "salary",
      prompt: "Ab welchem Gehalt soll ich filtern?",
      options: [
        { label: "ab 70k", query: "ab 70k" },
        { label: "ab 90k", query: "ab 90k" },
        { label: "ab 110k", query: "ab 110k" },
      ],
    });
  }

  if (!criteria.seniority?.length) {
    pool.push({
      id: "level",
      prompt: "Welches Level passt?",
      options: [
        { label: "Junior", query: "Junior" },
        { label: "Professional", query: "Professional, Mid" },
        { label: "Senior", query: "Senior" },
        { label: "Lead", query: "Lead" },
      ],
    });
  }

  if (!criteria.cultures?.length && !criteria.noCorporate) {
    pool.push({
      id: "culture",
      prompt: "Welche Teamkultur suchst du?",
      options: [
        { label: "Startup", query: "Startup, kein Konzern" },
        { label: "Scale-up", query: "Scale-up" },
        { label: "Konzern", query: "Konzern, Corporate" },
      ],
    });
  }

  if (criteria.onCall === undefined && results.some((job) => job.onCall)) {
    pool.push({
      id: "oncall",
      prompt: "Ein paar Treffer haben Bereitschaft. Wie gehst du damit um?",
      options: [
        { label: "Ohne Bereitschaft", query: "ohne Bereitschaft" },
        { label: "Ist okay" },
      ],
    });
  }

  if (!criteria.fourDayWeek && results.some((job) => job.fourDayWeek)) {
    pool.push({
      id: "week",
      prompt: "Es gibt Treffer mit 4-Tage-Woche. Ist das wichtig?",
      options: [
        { label: "Ja, wichtig", query: "4-Tage-Woche" },
        { label: "Egal" },
      ],
    });
  }

  if (!criteria.stack.length && criteria.functions.includes("engineering")) {
    pool.push({
      id: "eng-stack",
      prompt: "Welcher Stack soll mit rein?",
      options: [
        { label: "TypeScript", query: "TypeScript, React, Node" },
        { label: "Go", query: "Go, Golang" },
        { label: "Python", query: "Python" },
        { label: "iOS", query: "iOS, Swift" },
      ],
    });
  }

  if (!criteria.stack.length && criteria.functions.includes("design")) {
    pool.push({
      id: "design-stack",
      prompt: "Worauf soll ich im Design achten?",
      options: [
        { label: "Figma und Systems", query: "Figma, Systems" },
        { label: "Research", query: "Research" },
        { label: "Beides", query: "Figma, Research, Systems" },
      ],
    });
  }

  if (criteria.cities.length === 1 && !modes.includes("remote")) {
    const city = criteria.cities[0];
    pool.push({
      id: "more-cities",
      prompt: `Nur ${city}, oder kommen weitere Orte infrage?`,
      options: [
        { label: "Auch Remote", query: "Remote" },
        { label: "Auch München", query: "München" },
        { label: "Auch Hamburg", query: "Hamburg" },
        { label: `Nur ${city}` },
      ],
    });
  }

  const gap = commonGap(results);
  if (gap && !asked.includes(`gap-${gap}`)) {
    pool.push({
      id: `gap-${gap}`,
      prompt: `Bei mehreren Stellen hakt ${gap}. Soll ich die rausnehmen?`,
      options: [
        { label: "Ja, rausfiltern", query: excludeQuery(gap) },
        { label: "Behalten" },
      ],
    });
  }

  pool.push({
    id: "priority",
    prompt: "Was soll ich als Nächstes schärfer machen?",
    options: [
      { label: "Mehr Gehalt", query: "höheres Gehalt, ab 110k" },
      { label: "Nur Remote", query: "Remote" },
      { label: "Kleineres Team", query: "Startup, kein Konzern" },
    ],
  });

  return pool.filter((item) => !asked.includes(item.id)).slice(0, 1);
}

function commonGap(results: RankedJob[]) {
  const counts = new Map<string, number>();
  for (const job of results) {
    for (const gap of job.gaps) {
      counts.set(gap, (counts.get(gap) ?? 0) + 1);
    }
  }
  let best = "";
  let max = 0;
  for (const [gap, count] of counts) {
    if (count >= 2 && count > max) {
      best = gap;
      max = count;
    }
  }
  return best;
}

function excludeQuery(gap: string) {
  const text = gap.toLowerCase();
  if (text.includes("gehalt")) return "höheres Gehalt, ab 110k";
  if (text.includes("standort")) return "Remote";
  if (text.includes("konzern")) return "kein Konzern, Startup";
  if (text.includes("on-call") || text.includes("bereitschaft")) {
    return "ohne Bereitschaft";
  }
  if (text.includes("5 tage") || text.includes("vollzeit")) return "4-Tage-Woche";
  if (text.includes("funktion")) return "gleiche Funktion";
  if (text.includes("level")) return "passendes Level";
  if (text.includes("stack")) return "passender Stack";
  return `ohne ${gap}`;
}
