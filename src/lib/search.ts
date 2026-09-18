import {
  JOBS,
  type Culture,
  type Job,
  type JobFunction,
  type Seniority,
  type WorkMode,
} from "./jobs";

export type Criteria = {
  functions: JobFunction[];
  cities: string[];
  workMode?: WorkMode;
  workModes?: WorkMode[];
  salaryMin?: number;
  seniority?: Seniority[];
  noCorporate?: boolean;
  cultures?: Culture[];
  stack: string[];
  onCall?: boolean;
  fourDayWeek?: boolean;
  dach?: boolean;
};

export type DetailCheck = {
  text: string;
  fit: boolean;
};

export type RankedJob = Job & {
  match: number;
  why: string;
  gap?: string;
  fits: string[];
  gaps: string[];
  responsibilityChecks: DetailCheck[];
  requirementChecks: DetailCheck[];
};

const CITY_ALIASES: Record<string, string> = {
  berlin: "Berlin",
  muenchen: "München",
  munich: "München",
  hamburg: "Hamburg",
  koeln: "Köln",
  cologne: "Köln",
  frankfurt: "Frankfurt",
  stuttgart: "Stuttgart",
  duesseldorf: "Düsseldorf",
  dusseldorf: "Düsseldorf",
  leipzig: "Leipzig",
  chemnitz: "Chemnitz",
  wien: "Wien",
  vienna: "Wien",
  zuerich: "Zürich",
  zurich: "Zürich",
  amsterdam: "Amsterdam",
  remote: "Remote",
};

export const CITY_OPTIONS = [
  "Berlin",
  "München",
  "Hamburg",
  "Köln",
  "Frankfurt",
  "Stuttgart",
  "Düsseldorf",
  "Leipzig",
  "Chemnitz",
  "Wien",
  "Zürich",
  "Amsterdam",
  "Remote",
];

const FUNCTION_WORDS: { fn: JobFunction; words: string[] }[] = [
  {
    fn: "design",
    words: ["design", "designer", "ux", "ui", "product designer"],
  },
  {
    fn: "engineering",
    words: [
      "engineer",
      "entwickler",
      "developer",
      "backend",
      "frontend",
      "fullstack",
      "software",
      "ios",
      "android",
    ],
  },
  {
    fn: "product",
    words: ["product manager", "produktmanager", "produkt manager", "produktleitung"],
  },
  {
    fn: "data",
    words: ["data", "analyst", "analytics", "scientist", "daten"],
  },
  {
    fn: "marketing",
    words: ["marketing", "growth", "seo"],
  },
  {
    fn: "sales",
    words: ["sales", "account executive", "vertrieb", "ae "],
  },
];

const STACK_WORDS = [
  "go",
  "golang",
  "react",
  "typescript",
  "nextjs",
  "next.js",
  "python",
  "java",
  "kotlin",
  "swift",
  "figma",
  "sql",
  "node",
  "kafka",
  "spark",
  "ios",
];

export function normalizeCity(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const alias = CITY_ALIASES[fold(trimmed)];
  if (alias) return alias;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function fold(value: string) {
  return value
    .toLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss");
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function mergeCriteria(previous: Criteria, message: string): Criteria {
  const text = fold(message);
  const next: Criteria = {
    functions: [...previous.functions],
    cities: [...previous.cities],
    workMode: previous.workMode,
    workModes: previous.workModes ? [...previous.workModes] : undefined,
    salaryMin: previous.salaryMin,
    seniority: previous.seniority ? [...previous.seniority] : undefined,
    noCorporate: previous.noCorporate,
    cultures: previous.cultures ? [...previous.cultures] : undefined,
    stack: [...previous.stack],
    onCall: previous.onCall,
    fourDayWeek: previous.fourDayWeek,
    dach: previous.dach,
  };

  for (const group of FUNCTION_WORDS) {
    if (group.words.some((word) => text.includes(word))) {
      next.functions = unique([...next.functions, group.fn]);
    }
  }

  for (const [alias, city] of Object.entries(CITY_ALIASES)) {
    if (text.includes(alias)) {
      next.cities = unique([...next.cities, city]);
    }
  }

  if (/(remote|voll remote|homeoffice)/.test(text)) next.workMode = "remote";
  else if (/hybrid/.test(text)) next.workMode = "hybrid";
  else if (/(vor ort|onsite|praesenz|büro|buero)/.test(text)) {
    next.workMode = "onsite";
  }

  const salary = text.match(
    /(?:ab\s*)?(\d{2,3})\s*(?:k|000|\.\d{3})|(?:mind(?:estens)?\.?\s*)(\d{2,3})\s*k/,
  );
  if (salary) {
    next.salaryMin = Number(salary[1] ?? salary[2]);
  }

  const seniority: Seniority[] = [];
  if (/junior/.test(text)) seniority.push("junior");
  if (/(mid|middle|professional)/.test(text)) seniority.push("mid");
  if (/senior/.test(text)) seniority.push("senior");
  if (/\blead\b/.test(text)) seniority.push("lead");
  if (/staff/.test(text)) seniority.push("staff");
  if (seniority.length) next.seniority = unique(seniority);

  if (/(kein konzern|nicht zu corporate|kein corporate|startup)/.test(text)) {
    next.noCorporate = true;
    next.cultures = unique([...(next.cultures ?? []), "startup"]);
  }
  if (/scale-?up/.test(text)) {
    next.cultures = unique([...(next.cultures ?? []), "scaleup"]);
  }
  if (/(konzern|corporate)/.test(text) && !/(kein konzern|kein corporate)/.test(text)) {
    next.cultures = unique([...(next.cultures ?? []), "corporate"]);
  }

  if (/(dach|deutschland|d-a-ch|deutschsprachig)/.test(text)) next.dach = true;

  if (
    /(kein on-?call|ohne bereitschaft|keine bereitschaft|kein bereitschaft)/.test(
      text,
    )
  ) {
    next.onCall = false;
  } else if (/(on-?call|bereitschaft)/.test(text)) {
    next.onCall = true;
  }

  if (/(4[- ]tage|vier ?tage)/.test(text)) next.fourDayWeek = true;

  for (const word of STACK_WORDS) {
    if (text.includes(fold(word))) {
      const normalized = word === "golang" || word === "go" ? "go" : word.replace(".", "");
      next.stack = unique([...next.stack, normalized]);
    }
  }

  return next;
}

export function criteriaChips(criteria: Criteria): string[] {
  const chips: string[] = [];
  const fnLabel: Record<JobFunction, string> = {
    design: "Design",
    engineering: "Engineering",
    product: "Product",
    data: "Data",
    marketing: "Marketing",
    sales: "Sales",
  };
  const seniorLabel: Record<Seniority, string> = {
    junior: "Junior",
    mid: "Mid",
    senior: "Senior",
    lead: "Lead",
    staff: "Staff",
  };

  chips.push(...criteria.functions.map((item) => fnLabel[item]));
  chips.push(...(criteria.seniority ?? []).map((item) => seniorLabel[item]));
  chips.push(...criteria.cities);
  if (criteria.dach) chips.push("DACH");
  const modes = criteria.workModes?.length
    ? criteria.workModes
    : criteria.workMode
      ? [criteria.workMode]
      : [];
  if (modes.includes("remote")) chips.push("Remote");
  if (modes.includes("hybrid")) chips.push("Hybrid");
  if (modes.includes("onsite")) chips.push("Vor Ort");
  if (criteria.cultures?.includes("startup")) chips.push("Startup");
  if (criteria.cultures?.includes("scaleup")) chips.push("Scale-up");
  if (criteria.cultures?.includes("corporate")) chips.push("Konzern");
  if (criteria.salaryMin) chips.push(`ab ${criteria.salaryMin}k`);
  if (criteria.noCorporate) chips.push("kein Konzern");
  if (criteria.onCall === false) chips.push("kein On-Call");
  if (criteria.fourDayWeek) chips.push("4-Tage-Woche");
  chips.push(...criteria.stack.map((item) => item));
  return unique(chips);
}

function criteriaHasSignal(criteria: Criteria) {
  return (
    criteria.functions.length +
      criteria.cities.length +
      criteria.stack.length +
      (criteria.seniority?.length ?? 0) +
      (criteria.workModes?.length ?? 0) +
      (criteria.cultures?.length ?? 0) >
      0 ||
    Boolean(
      criteria.workMode ||
        criteria.salaryMin ||
        criteria.noCorporate ||
        criteria.dach ||
        criteria.onCall !== undefined ||
        criteria.fourDayWeek,
    )
  );
}

export function rankJobs(criteria: Criteria): RankedJob[] {
  const hasAny = criteriaHasSignal(criteria);

  const ranked = JOBS.map((job) => scoreJob(job, criteria, hasAny)).sort(
    (a, b) => b.match - a.match,
  );

  return hasAny ? ranked.filter((job) => job.match >= 45).slice(0, 8) : [];
}

function scoreJob(job: Job, criteria: Criteria, hasAny: boolean): RankedJob {
  if (!hasAny) {
    return {
      ...job,
      match: 0,
      why: job.summary,
      fits: [],
      gaps: [],
      responsibilityChecks: annotateLines(job.responsibilities, criteria, job),
      requirementChecks: annotateLines(job.requirements, criteria, job),
    };
  }

  let score = 38;
  const fits: string[] = [];
  const gaps: string[] = [];
  const seniorLabel: Record<Seniority, string> = {
    junior: "Junior",
    mid: "Professional",
    senior: "Senior",
    lead: "Lead",
    staff: "Staff",
  };

  if (criteria.functions.length) {
    if (criteria.functions.includes(job.fn)) {
      score += 22;
      fits.push(labelForFunction(job.fn));
    } else {
      score -= 28;
      gaps.push("andere Funktion");
    }
  }

  if (criteria.seniority?.length) {
    if (criteria.seniority.includes(job.seniority) || nearSeniority(criteria.seniority, job.seniority)) {
      score += 12;
      fits.push(seniorLabel[job.seniority]);
    } else {
      score -= 10;
      gaps.push("Level weicht ab");
    }
  }

  if (criteria.cities.length) {
    if (criteria.cities.includes(job.city)) {
      score += 12;
      fits.push(job.city);
    } else if (job.workMode === "remote" || job.city === "Remote") {
      score += 12;
      fits.push("Remote möglich");
    } else {
      score -= 16;
      gaps.push(`Standort ${job.city}`);
    }
  }

  if (criteria.dach && (job.city === "Remote" || job.workMode === "remote")) {
    score += 6;
    fits.push("DACH / Remote");
  }

  const wantedModes = criteria.workModes?.length
    ? criteria.workModes
    : criteria.workMode
      ? [criteria.workMode]
      : [];
  if (wantedModes.length) {
    if (wantedModes.includes(job.workMode)) {
      score += 10;
      const label = workModeLabel(job.workMode);
      if (!fits.includes(label) && !fits.includes("Remote möglich")) {
        fits.push(label);
      }
    } else if (wantedModes.includes("hybrid") && job.workMode === "remote") {
      score += 6;
      if (!fits.includes("Remote möglich")) {
        fits.push("Remote statt Hybrid");
      }
    } else {
      score -= 14;
      gaps.push(workModeLabel(job.workMode));
    }
  }

  if (criteria.cultures?.length) {
    if (criteria.cultures.includes(job.culture)) {
      score += 8;
      fits.push(
        job.culture === "startup"
          ? "Startup"
          : job.culture === "scaleup"
            ? "Scale-up"
            : "Konzern",
      );
    } else {
      score -= 12;
      gaps.push(
        job.culture === "startup"
          ? "Startup"
          : job.culture === "scaleup"
            ? "Scale-up"
            : "Konzernsetup",
      );
    }
  }

  if (criteria.salaryMin) {
    if (job.salaryMax >= criteria.salaryMin) {
      score += 10;
      fits.push(`Gehalt ${job.salaryMin} bis ${job.salaryMax}k`);
    } else {
      score -= 18;
      gaps.push("Gehalt darunter");
    }
  }

  if (criteria.noCorporate) {
    if (job.culture === "corporate") {
      score -= 24;
      gaps.push("Konzernsetup");
    } else {
      score += 10;
      fits.push(job.culture === "startup" ? "Startup" : "kein Konzern");
    }
  }

  if (criteria.onCall === false) {
    if (job.onCall) {
      score -= 20;
      gaps.push("On-Call Pflicht");
    } else {
      score += 8;
      fits.push("keine Bereitschaft");
    }
  }

  if (criteria.fourDayWeek) {
    if (job.fourDayWeek) {
      score += 8;
      fits.push("4-Tage-Woche");
    } else {
      score -= 8;
      gaps.push("Vollzeit 5 Tage");
    }
  }

  if (criteria.stack.length) {
    const hit = criteria.stack.filter((item) =>
      job.stack.some((stack) => fold(stack).includes(fold(item))),
    );
    if (hit.length) {
      score += Math.min(14, hit.length * 7);
      fits.push(...hit.map((item) => item.charAt(0).toUpperCase() + item.slice(1)));
    } else {
      score -= 8;
      gaps.push("anderer Stack");
    }
  }

  const match = Math.max(32, Math.min(98, Math.round(score)));
  return {
    ...job,
    match,
    why: fits.length ? `Passt: ${fits.slice(0, 3).join(", ")}.` : job.summary,
    gap: gaps[0],
    fits,
    gaps,
    responsibilityChecks: annotateLines(job.responsibilities, criteria, job),
    requirementChecks: annotateLines(job.requirements, criteria, job),
  };
}

export function annotateLines(
  lines: string[],
  criteria: Criteria,
  job: Job,
): DetailCheck[] {
  return lines.map((text) => ({
    text,
    fit: lineFitsProfile(text, criteria, job),
  }));
}

function lineFitsProfile(text: string, criteria: Criteria, job: Job) {
  const t = fold(text);
  const hasSignal = criteriaHasSignal(criteria);
  if (!hasSignal) return true;

  if (criteria.onCall === false && /(bereitschaft|on-?call|rufbereitschaft)/.test(t)) {
    return false;
  }
  if (
    criteria.fourDayWeek &&
    /(5.?tage|fuenf.?tage|vollzeit)/.test(t) &&
    !/4.?tage/.test(t)
  ) {
    return false;
  }
  if (criteria.noCorporate && /(konzern|enterprise|viele stakeholder)/.test(t)) {
    return false;
  }

  if (criteria.workMode === "remote") {
    if (
      /(im office|ins office|tage im office|vor ort|buero|büro|onsite)/.test(t) &&
      !/remote/.test(t)
    ) {
      return false;
    }
    if (/hybrid/.test(t) && !/remote/.test(t)) {
      return false;
    }
  }
  if (criteria.workMode === "onsite" && /remote/.test(t) && !/hybrid/.test(t)) {
    return false;
  }

  const cityHit = Object.values(CITY_ALIASES).find((city) => t.includes(fold(city)));
  if (cityHit && criteria.cities.length) {
    const remoteOk = job.workMode === "remote" || job.city === "Remote" || /remote/.test(t);
    if (!criteria.cities.includes(cityHit) && !remoteOk) {
      return false;
    }
  }

  if (criteria.stack.length) {
    const mentioned = STACK_WORDS.filter((item) => t.includes(fold(item)));
    if (mentioned.length) {
      const hit = mentioned.some((item) =>
        criteria.stack.some(
          (wanted) => fold(item).includes(fold(wanted)) || fold(wanted).includes(fold(item)),
        ),
      );
      if (!hit) return false;
    }
  }

  if (criteria.functions.length) {
    const mentioned = FUNCTION_WORDS.filter(({ words }) =>
      words.some((word) => t.includes(word)),
    );
    if (mentioned.length && !mentioned.some((item) => criteria.functions.includes(item.fn))) {
      return false;
    }
  }

  if (criteria.seniority?.length) {
    const juniorOnly = criteria.seniority.every((item) => item === "junior" || item === "mid");
    if (juniorOnly && /(fuehrungserfahrung|lead|staff|principal|direktion)/.test(t)) {
      return false;
    }
  }

  if (criteria.salaryMin && /(\d+)\s*k/.test(t)) {
    const amount = Number(t.match(/(\d+)\s*k/)?.[1]);
    if (Number.isFinite(amount) && amount < criteria.salaryMin && amount < 40) {
      return false;
    }
  }

  return true;
}

function nearSeniority(wanted: Seniority[], actual: Seniority) {
  if (wanted.includes("senior") && (actual === "lead" || actual === "staff")) {
    return true;
  }
  if (wanted.includes("lead") && actual === "staff") return true;
  return false;
}

function labelForFunction(fn: JobFunction) {
  const map: Record<JobFunction, string> = {
    design: "Design",
    engineering: "Engineering",
    product: "Product",
    data: "Data",
    marketing: "Marketing",
    sales: "Sales",
  };
  return map[fn];
}

function workModeLabel(mode: WorkMode) {
  if (mode === "remote") return "Remote";
  if (mode === "hybrid") return "Hybrid";
  return "Vor Ort";
}

export function replyFor(criteria: Criteria, results: RankedJob[]) {
  const chips = criteriaChips(criteria);
  if (!chips.length) {
    return "Beschreib die Rolle ein bisschen genauer. Ort, Gehalt, Stack oder Kultur helfen mir, schärfer zu filtern.";
  }

  if (!results.length) {
    return `Ich habe nach ${chips.join(", ")} gesucht und gerade nichts Passendes gefunden. Schärf einen Punkt nach, zum Beispiel Ort oder Gehalt.`;
  }

  const top = results[0];
  const extra = results.length > 1 ? ` Daneben ${results.length - 1} weitere Treffer, sortiert nach Fit.` : "";
  return `Verstanden: ${chips.join(", ")}. Stärkster Treffer ist ${top.role} bei ${top.company} mit ${top.match}% Fit.${extra}`;
}

export const EMPTY_CRITERIA: Criteria = {
  functions: [],
  cities: [],
  stack: [],
};
