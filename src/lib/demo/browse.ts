export type BrowseJob = {
  id: string;
  title: string;
  company: string;
  place: string;
  mode: string;
  salary: string;
  summary: string;
  tags: string[];
};

export const BROWSE_JOBS: BrowseJob[] = [
  {
    id: "browse-hearth",
    title: "Frontend Engineer",
    company: "Hearth",
    place: "London",
    mode: "Remote",
    salary: "74–96k",
    summary: "Maps of home energy use for people who just want to know if the heat pump is doing its job.",
    tags: ["frontend", "react", "typescript", "css", "london", "climate", "remote", "mid"],
  },
  {
    id: "browse-atelier",
    title: "Frontend Developer",
    company: "Atelier North",
    place: "Amsterdam",
    mode: "Remote",
    salary: "68–88k",
    summary: "Timed entry for small museums. Calm screens for a Saturday crowd and a shared tablet at the door.",
    tags: ["frontend", "react", "typescript", "css", "amsterdam", "design", "remote", "mid"],
  },
  {
    id: "browse-spoke",
    title: "Frontend Engineer",
    company: "Spoke",
    place: "Munich",
    mode: "Remote",
    salary: "72–92k",
    summary: "Bike routes that prefer a quiet street. You own the map commuters open every morning.",
    tags: ["frontend", "react", "typescript", "maps", "munich", "germany", "remote", "mid"],
  },
  {
    id: "browse-reelroom",
    title: "Frontend Developer",
    company: "Reelroom",
    place: "Dublin",
    mode: "Remote",
    salary: "70–90k",
    summary: "Rehearsal rooms, drum kits, and a calendar that stops double bookings.",
    tags: ["frontend", "react", "css", "dublin", "ireland", "music", "remote", "mid"],
  },
  {
    id: "browse-wardly",
    title: "Product Manager",
    company: "Wardly",
    place: "London",
    mode: "Remote",
    salary: "82–108k",
    summary: "Night-shift rosters for hospital wards. You sit with nurses, then write the rule engineers can build.",
    tags: ["product", "manager", "healthcare", "london", "discovery", "operations", "remote", "mid"],
  },
  {
    id: "browse-platform",
    title: "Product Manager",
    company: "Platform 9",
    place: "Vienna",
    mode: "Remote",
    salary: "76–98k",
    summary: "What a passenger sees when a night train is late, and how the ticket survives the miss.",
    tags: ["product", "manager", "vienna", "austria", "operations", "rail", "remote", "mid"],
  },
  {
    id: "browse-market",
    title: "Product Manager",
    company: "Market Day",
    place: "Amsterdam",
    mode: "Remote",
    salary: "74–96k",
    summary: "Wholesale produce before the market closes. Chefs order, growers confirm, you own the cutoff.",
    tags: ["product", "manager", "amsterdam", "marketplace", "operations", "food", "remote", "mid"],
  },
  {
    id: "browse-fieldnote",
    title: "Product Manager",
    company: "Fieldnote",
    place: "Munich",
    mode: "Remote",
    salary: "78–100k",
    summary: "A notebook for investigative desks: sources, documents, and who is allowed to see them.",
    tags: ["product", "manager", "munich", "germany", "editorial", "writing", "media", "remote", "mid"],
  },
  {
    id: "browse-lattice",
    title: "Senior Software Engineer",
    company: "Lattice",
    place: "Amsterdam",
    mode: "Remote",
    salary: "110–140k",
    summary: "Simulate a floor of warehouse robots before anyone buys the hardware.",
    tags: ["senior", "software", "engineer", "typescript", "node", "amsterdam", "robotics", "remote"],
  },
  {
    id: "browse-cutglass",
    title: "Senior Software Engineer",
    company: "Cutglass",
    place: "Dublin",
    mode: "Remote",
    salary: "105–135k",
    summary: "Move a film cut from the edit bay to a review link without losing the version.",
    tags: ["senior", "software", "engineer", "typescript", "node", "dublin", "ireland", "film", "remote"],
  },
  {
    id: "browse-keel",
    title: "Senior Software Engineer",
    company: "Keel",
    place: "Amsterdam",
    mode: "Remote",
    salary: "95–120k",
    summary: "Payments operations. You keep a TypeScript product area understandable and still ship.",
    tags: ["senior", "software", "engineer", "typescript", "react", "node", "amsterdam", "payments", "remote"],
  },
  {
    id: "browse-granite",
    title: "Sustainability Analyst",
    company: "Granite Works",
    place: "Munich",
    mode: "Hybrid",
    salary: "56–70k",
    summary: "Plant energy data and CSRD reports, with time on the factory floor.",
    tags: ["analyst", "sustainability", "excel", "munich", "germany", "operations", "hybrid", "junior"],
  },
];

const FOLDS: Record<string, string[]> = {
  react: ["frontend", "typescript", "css"],
  frontend: ["react", "css", "typescript"],
  typescript: ["react", "frontend", "node"],
  node: ["typescript", "engineer"],
  product: ["manager", "discovery"],
  manager: ["product"],
  pm: ["product", "manager"],
  nurse: ["healthcare"],
  hospital: ["healthcare"],
  clinical: ["healthcare"],
  train: ["rail", "operations"],
  railway: ["rail"],
  bike: ["maps"],
  cycling: ["maps"],
  museum: ["design"],
  news: ["editorial", "media", "writing"],
  journalist: ["editorial", "writing"],
  robot: ["robotics"],
  film: ["film"],
  energy: ["climate"],
  climate: ["climate"],
  berlin: ["germany"],
  munich: ["germany"],
  vienna: ["austria"],
  dublin: ["ireland"],
};

function tokens(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9+]+/)
    .filter((item) => item.length > 2);
}

export function matchBrowseJobs(text: string) {
  const found = new Set(tokens(text));
  for (const token of [...found]) {
    for (const extra of FOLDS[token] ?? []) found.add(extra);
  }
  return BROWSE_JOBS.map((job) => {
    const hay = [job.title, job.company, job.place, job.summary, ...job.tags].join(" ").toLowerCase();
    let score = 0;
    for (const token of found) {
      if (hay.includes(token)) score += token.length > 5 ? 3 : 2;
    }
    return { job, score };
  })
    .filter((item) => item.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.job);
}

export function readingFromFile(name: string, text: string) {
  const body = text.trim();
  if (body.length > 40) return body.slice(0, 1200);
  const folded = name.toLowerCase();
  if (folded.includes("product") || folded.includes("pm")) {
    return "Product manager with five years in healthcare operations. Discovery, ward workflows, London and remote.";
  }
  if (folded.includes("front") || folded.includes("react") || folded.includes("design")) {
    return "Frontend developer. React, TypeScript, and CSS. Three years shipping product UI. Open to Amsterdam and remote.";
  }
  if (folded.includes("data") || folded.includes("analyst")) {
    return "Analyst. Excel, sustainability reporting, and operations. Based in Munich, open to hybrid.";
  }
  return "Software engineer. Four years with TypeScript, React, and Node.js. Open to Berlin, Amsterdam, and remote.";
}
