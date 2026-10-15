export type WorkMode = "remote" | "hybrid" | "onsite";
export type Employment = "fulltime" | "parttime" | "contract";
export type Level = "intern" | "junior" | "mid" | "senior" | "lead";
export type Industry =
  | "technology"
  | "finance"
  | "consulting"
  | "marketing"
  | "healthcare"
  | "marketplace"
  | "industrial"
  | "media";

export const INDUSTRIES: Industry[] = [
  "technology",
  "finance",
  "consulting",
  "marketing",
  "healthcare",
  "marketplace",
  "industrial",
  "media",
];

export type DemoJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: WorkMode;
  employment: Employment;
  level: Level;
  industry: Industry;
  salaryMin?: number;
  salaryMax?: number;
  summary: string;
  description: string;
  aboutCompany: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  postedDaysAgo: number;
  source: string;
};

const SOURCE = "Atheniks";

export const DEMO_JOBS: DemoJob[] = [
  {
    id: "se-northline",
    title: "Software Engineer",
    company: "Northline",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 68,
    salaryMax: 85,
    summary: "Ship product features in TypeScript. Small team, real users, two office days.",
    description:
      "Northline is looking for a software engineer to own slices of the web app end to end. You work with design and product, not in a ticket factory. Hybrid in Berlin, two days in Kreuzberg.",
    aboutCompany:
      "Northline builds a B2B workflow product used by ops teams across Europe.",
    responsibilities: [
      "Build and ship user-facing features in TypeScript and React",
      "Write straightforward backend endpoints in Node.js",
      "Review pull requests and keep the main branch calm",
      "Sit with design on tricky interaction details",
    ],
    requirements: [
      "1–3 years building web products",
      "Comfortable with TypeScript, React, and SQL",
      "Happy in a hybrid Berlin setup",
    ],
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Git"],
    postedDaysAgo: 2,
    source: SOURCE,
  },
  {
    id: "se-spree",
    title: "Software Engineer",
    company: "Spree Labs",
    location: "Berlin",
    workMode: "onsite",
    employment: "fulltime",
    level: "junior",
    industry: "marketplace",
    salaryMin: 65,
    salaryMax: 80,
    summary: "Marketplace internals: search, payments, seller tools. On-site in Mitte.",
    description:
      "Spree Labs is hiring an engineer to work on seller tooling and checkout. You will pair often and ship weekly. The role is on-site in Berlin-Mitte.",
    aboutCompany:
      "A two-sided marketplace for independent studios in Europe.",
    responsibilities: [
      "Improve search ranking and listing quality",
      "Harden checkout and payouts with the payments team",
      "Write tests around money paths",
    ],
    requirements: [
      "Some production experience with JavaScript or TypeScript",
      "Interest in marketplace problems",
      "Willing to work on-site in Berlin",
    ],
    skills: ["TypeScript", "React", "PostgreSQL", "Redis"],
    postedDaysAgo: 5,
    source: SOURCE,
  },
  {
    id: "fe-lumen",
    title: "Frontend Engineer",
    company: "Lumen Interface",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 66,
    salaryMax: 82,
    summary: "Design systems, dense UI, accessibility. React and TypeScript.",
    description:
      "Lumen builds a design-heavy analytics surface. You will take Figma files to production and keep the component library honest.",
    aboutCompany:
      "A product analytics company with a Berlin product team.",
    responsibilities: [
      "Implement complex UI states without visual debt",
      "Extend the shared component library",
      "Catch accessibility issues before they ship",
    ],
    requirements: [
      "Strong React and CSS",
      "Care about spacing, type, and keyboard flows",
      "1–3 years in product companies",
    ],
    skills: ["TypeScript", "React", "CSS", "Figma", "Accessibility"],
    postedDaysAgo: 3,
    source: SOURCE,
  },
  {
    id: "be-atlas",
    title: "Backend Engineer",
    company: "Atlas Kernel",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 70,
    salaryMax: 88,
    summary: "APIs, queues, and Postgres. Clear ownership, few meetings.",
    description:
      "Atlas Kernel runs developer infrastructure. This role is mostly Go and PostgreSQL, with on-call shared across the team.",
    aboutCompany:
      "An infrastructure company building APIs for other product teams.",
    responsibilities: [
      "Design and ship internal APIs",
      "Keep Postgres schemas and migrations tidy",
      "Join a light on-call rotation",
    ],
    requirements: [
      "Solid SQL and one backend language",
      "Comfort reading other people's systems",
      "Hybrid in Berlin",
    ],
    skills: ["Go", "PostgreSQL", "gRPC", "Kubernetes"],
    postedDaysAgo: 4,
    source: SOURCE,
  },
  {
    id: "se-helix",
    title: "Software Engineer",
    company: "Helix Cloud",
    location: "Remote",
    workMode: "remote",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 72,
    salaryMax: 90,
    summary: "Remote-first product engineering across EU time zones.",
    description:
      "Fully remote. Async writing, weekly demos, no status theater. You own a vertical in the customer-facing app.",
    aboutCompany:
      "A remote SaaS company with people in Berlin, Lisbon, and Amsterdam.",
    responsibilities: [
      "Ship weekly product increments",
      "Write short design docs before large changes",
      "Support customers on issues you shipped",
    ],
    requirements: [
      "Self-directed work style",
      "TypeScript in production",
      "Based in the EU",
    ],
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    postedDaysAgo: 3,
    source: SOURCE,
  },
  {
    id: "se-palisade",
    title: "Software Engineer",
    company: "Palisade",
    location: "London",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "finance",
    salaryMin: 75,
    salaryMax: 95,
    summary: "Regulated fintech product in London. Strong TypeScript culture.",
    description:
      "Palisade is hiring in London, not Berlin. You will work on ledger-adjacent product surfaces with extra review on money paths.",
    aboutCompany:
      "A payments company with an engineering hub in Shoreditch.",
    responsibilities: [
      "Build customer-facing money flows",
      "Add tests around edge cases",
      "Work with compliance on change reviews",
    ],
    requirements: [
      "1–3 years of product engineering",
      "Willingness to work from London",
      "Care about correctness over speed",
    ],
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Testing"],
    postedDaysAgo: 7,
    source: SOURCE,
  },
  {
    id: "fs-rivet",
    title: "Full Stack Engineer",
    company: "Rivet",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "marketplace",
    salaryMin: 80,
    salaryMax: 100,
    summary: "Own a product surface across frontend and API.",
    description:
      "Rivet wants someone who can move between React and the API without a handoff. Two to four years is the sweet spot.",
    aboutCompany:
      "A hiring marketplace for specialist contractors.",
    responsibilities: [
      "Take a problem from sketch to production",
      "Keep API contracts explicit",
      "Mentor a more junior engineer",
    ],
    requirements: [
      "2–4 years full stack",
      "TypeScript on both sides",
      "Hybrid Berlin",
    ],
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Product"],
    postedDaysAgo: 1,
    source: SOURCE,
  },
  {
    id: "pd-folio",
    title: "Product Designer",
    company: "Folio",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 60,
    salaryMax: 75,
    summary: "Product design for a dense B2B tool. Figma, research, shipping.",
    description:
      "You will design flows, not marketing pages. Close partnership with engineering. Hybrid in Berlin.",
    aboutCompany:
      "A documentation product for technical teams.",
    responsibilities: [
      "Map messy workflows into clear screens",
      "Run lightweight user conversations",
      "Hand off specs that engineers can actually build",
    ],
    requirements: [
      "A portfolio with shipped product work",
      "Figma fluency",
      "Interest in technical users",
    ],
    skills: ["Figma", "Product design", "Prototyping", "Research"],
    postedDaysAgo: 6,
    source: SOURCE,
  },
  {
    id: "pd-driftway",
    title: "Product Designer",
    company: "Driftway",
    location: "Munich",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 62,
    salaryMax: 78,
    summary: "Early-stage product design in Munich. Lots of white space.",
    description:
      "Driftway is small. You will set the visual system and the first serious onboarding flow.",
    aboutCompany:
      "A developer-tool startup with an office near Maxvorstadt.",
    responsibilities: [
      "Design onboarding and empty states",
      "Build a small component library in Figma",
      "Sit with founders on weekly product calls",
    ],
    requirements: [
      "Shipped at least one product",
      "Comfort with ambiguity",
      "Hybrid in Munich",
    ],
    skills: ["Figma", "UI design", "Prototyping", "Design systems"],
    postedDaysAgo: 8,
    source: SOURCE,
  },
  {
    id: "pm-orbit",
    title: "Product Manager",
    company: "Orbit Desk",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "technology",
    salaryMin: 78,
    salaryMax: 98,
    summary: "Own a product area with engineers and design. No slide theater.",
    description:
      "Orbit Desk needs a PM who writes clearly and says no. You will run discovery and keep the roadmap short.",
    aboutCompany:
      "A collaboration product for technical teams.",
    responsibilities: [
      "Turn customer problems into a sequenced roadmap",
      "Write briefs engineers can challenge",
      "Measure whether shipped work moved the metric",
    ],
    requirements: [
      "2–5 years in product at a software company",
      "Comfort with technical teammates",
      "Hybrid Berlin",
    ],
    skills: ["Product", "Roadmapping", "Writing", "SQL"],
    postedDaysAgo: 9,
    source: SOURCE,
  },
  {
    id: "ds-vectorbay",
    title: "Data Scientist",
    company: "Vectorbay",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 64,
    salaryMax: 80,
    summary: "Product analytics, experiments, and clear notebooks.",
    description:
      "You will help the product team see what users actually do. Python and SQL, not slide decks as the main output.",
    aboutCompany:
      "A search product with a Berlin data team.",
    responsibilities: [
      "Define and track product metrics",
      "Run experiments with engineering",
      "Explain results without burying the lead",
    ],
    requirements: [
      "Python and SQL in anger",
      "Interest in product questions, not only models",
      "1–3 years or a strong internship trail",
    ],
    skills: ["Python", "SQL", "Statistics", "Pandas"],
    postedDaysAgo: 4,
    source: SOURCE,
  },
  {
    id: "ml-cobalt",
    title: "ML Engineer",
    company: "Cobalt Stack",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "technology",
    salaryMin: 85,
    salaryMax: 110,
    summary: "Take models from notebook to a service people can call.",
    description:
      "Cobalt Stack needs someone who can productionize ranking and retrieval. Stretch if you have two years of generalist engineering only.",
    aboutCompany:
      "An ML infrastructure company in Berlin.",
    responsibilities: [
      "Serve models behind stable APIs",
      "Watch latency and drift",
      "Work with research on what is actually shippable",
    ],
    requirements: [
      "Experience deploying models",
      "Python plus one systems language is a plus",
      "2+ years",
    ],
    skills: ["Python", "PyTorch", "Kubernetes", "MLOps"],
    postedDaysAgo: 5,
    source: SOURCE,
  },
  {
    id: "ios-papertrail",
    title: "iOS Engineer",
    company: "Papertrail",
    location: "Berlin",
    workMode: "onsite",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 64,
    salaryMax: 80,
    summary: "Native iOS for a notes product. Swift, on-site collaboration.",
    description:
      "Papertrail's mobile team sits together. You will own screens in SwiftUI and keep the app fast on older phones.",
    aboutCompany:
      "A notes app with a small Berlin studio.",
    responsibilities: [
      "Ship SwiftUI features",
      "Fix performance on the hot path",
      "Work with design on motion and haptics",
    ],
    requirements: [
      "Swift in a shipped app",
      "Care about craft on mobile",
      "On-site in Berlin",
    ],
    skills: ["Swift", "SwiftUI", "iOS", "Xcode"],
    postedDaysAgo: 11,
    source: SOURCE,
  },
  {
    id: "do-granite",
    title: "DevOps Engineer",
    company: "Granite",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "technology",
    salaryMin: 76,
    salaryMax: 96,
    summary: "CI, Kubernetes, and making deploys boring.",
    description:
      "Granite wants deploys that nobody notices. You will own GitHub Actions, clusters, and the on-call runbook.",
    aboutCompany:
      "A security SaaS with an SRE-minded platform team.",
    responsibilities: [
      "Keep CI green and fast",
      "Harden cluster defaults",
      "Run a sane on-call rotation",
    ],
    requirements: [
      "Kubernetes in production",
      "Terraform or equivalent",
      "2+ years",
    ],
    skills: ["Kubernetes", "Terraform", "AWS", "CI"],
    postedDaysAgo: 6,
    source: SOURCE,
  },
  {
    id: "staff-northline",
    title: "Staff Software Engineer",
    company: "Northline",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "senior",
    industry: "technology",
    salaryMin: 110,
    salaryMax: 140,
    summary: "Technical direction across squads. Stretch for two years of experience.",
    description:
      "You set technical direction, unstick teams, and still ship. Built for people with several years of product engineering.",
    aboutCompany:
      "Northline builds a B2B workflow product used by ops teams across Europe.",
    responsibilities: [
      "Shape architecture without becoming a bottleneck",
      "Coach mid-level engineers",
      "Take the hardest incident when it counts",
    ],
    requirements: [
      "6+ years building product software",
      "Evidence of leading without a title",
      "Hybrid Berlin",
    ],
    skills: ["TypeScript", "Architecture", "Leadership", "PostgreSQL"],
    postedDaysAgo: 12,
    source: SOURCE,
  },
  {
    id: "em-helix",
    title: "Engineering Manager",
    company: "Helix Cloud",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "senior",
    industry: "technology",
    salaryMin: 105,
    salaryMax: 130,
    summary: "Manage a product engineering team. People first, then process.",
    description:
      "Helix is hiring a manager for a team of six. Stretch if you have not managed before. The work is hiring, unblocking, and keeping quality high.",
    aboutCompany:
      "A remote-friendly SaaS company with a Berlin hub.",
    responsibilities: [
      "Run 1:1s and hiring",
      "Protect focus time for the team",
      "Partner with product on sequencing",
    ],
    requirements: [
      "Prior experience managing engineers",
      "Enough technical depth to review work",
      "Hybrid Berlin",
    ],
    skills: ["Leadership", "Hiring", "Coaching", "Product"],
    postedDaysAgo: 14,
    source: SOURCE,
  },
  {
    id: "se-brightlane",
    title: "Software Engineer",
    company: "Brightlane",
    location: "Munich",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "technology",
    salaryMin: 66,
    salaryMax: 82,
    summary: "Product engineering in Munich. TypeScript, React, calm pace.",
    description:
      "Brightlane is a quieter alternative to Berlin scale-ups. Same stack, fewer parallel fires.",
    aboutCompany:
      "A customer-success platform with an office in Munich.",
    responsibilities: [
      "Build product features with design",
      "Keep the TypeScript app typed for real",
      "Improve test coverage on the critical path",
    ],
    requirements: [
      "1–3 years with React",
      "Hybrid in Munich",
    ],
    skills: ["TypeScript", "React", "Node.js", "Testing"],
    postedDaysAgo: 8,
    source: SOURCE,
  },
  {
    id: "fe-harbor",
    title: "Frontend Engineer",
    company: "Harbor",
    location: "Amsterdam",
    workMode: "remote",
    employment: "fulltime",
    level: "junior",
    industry: "finance",
    salaryMin: 70,
    salaryMax: 88,
    summary: "Remote frontend role with an Amsterdam core team.",
    description:
      "Harbor's design bar is high. You will work in React, talk to Amsterdam in the morning, and ship UI that holds up next to the brand.",
    aboutCompany:
      "A neobank-adjacent product with HQ in Amsterdam.",
    responsibilities: [
      "Implement high-fidelity product UI",
      "Work with brand and product design",
      "Keep bundle size and performance in check",
    ],
    requirements: [
      "Strong frontend craft",
      "Overlap with CET mornings",
    ],
    skills: ["TypeScript", "React", "CSS", "Performance"],
    postedDaysAgo: 10,
    source: SOURCE,
  },
  {
    id: "pe-nimbus",
    title: "Platform Engineer",
    company: "Nimbus Rail",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "technology",
    salaryMin: 82,
    salaryMax: 105,
    summary: "Internal developer platform. Golden paths, not gatekeeping.",
    description:
      "You make it easy for product teams to ship. Templates, observability, and a paved road. Not a ticket queue for YAML.",
    aboutCompany:
      "A logistics software company with a Berlin platform group.",
    responsibilities: [
      "Build internal tooling product teams actually use",
      "Standardize logging and deploy defaults",
      "Reduce time-to-first-deploy for new services",
    ],
    requirements: [
      "2–5 years in platform, SRE, or backend",
      "Empathy for product engineers",
    ],
    skills: ["Kubernetes", "Go", "CI", "Observability"],
    postedDaysAgo: 2,
    source: SOURCE,
  },
  {
    id: "se-sable",
    title: "Software Engineer",
    company: "Sable",
    location: "Zurich",
    workMode: "onsite",
    employment: "fulltime",
    level: "junior",
    industry: "finance",
    salaryMin: 90,
    salaryMax: 115,
    summary: "On-site engineering in Zurich. Strong pay, different city.",
    description:
      "Sable is hiring in Zurich, not Berlin. The work is TypeScript product engineering inside a regulated environment.",
    aboutCompany:
      "A wealth-tech company based in Zurich.",
    responsibilities: [
      "Build customer-facing product in TypeScript",
      "Work with security on reviews",
      "Ship with extra care around money",
    ],
    requirements: [
      "1–3 years product engineering",
      "Willingness to work on-site in Zurich",
    ],
    skills: ["TypeScript", "React", "Node.js", "Testing"],
    postedDaysAgo: 13,
    source: SOURCE,
  },
  {
    id: "sse-northline",
    title: "Senior Software Engineer",
    company: "Northline",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "senior",
    industry: "technology",
    salaryMin: 92,
    salaryMax: 118,
    summary: "Lead product engineering in TypeScript. Mentoring, architecture, still shipping.",
    description:
      "Northline needs a senior engineer who still writes code. You set technical direction on a product squad, review with care, and keep the system boring in the best way.",
    aboutCompany:
      "Northline builds a B2B workflow product used by ops teams across Europe.",
    responsibilities: [
      "Own architecture for a product area",
      "Ship features in TypeScript and React",
      "Mentor junior engineers without turning into a full-time manager",
    ],
    requirements: [
      "5+ years building product software",
      "Strong TypeScript and system design",
    ],
    skills: ["TypeScript", "React", "Architecture", "Mentoring", "PostgreSQL"],
    postedDaysAgo: 1,
    source: SOURCE,
  },
  {
    id: "ia-northbridge",
    title: "Investment Analyst",
    company: "Northbridge Capital",
    location: "Munich",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "finance",
    salaryMin: 62,
    salaryMax: 78,
    summary: "Coverage, models, and investment memos. Hybrid in Munich.",
    description:
      "Northbridge Capital is hiring an investment analyst to support live deals. You build models, write memos, and sit in diligence with the deal team. Two office days in Munich.",
    aboutCompany:
      "A European investment firm covering growth and private markets.",
    responsibilities: [
      "Build and maintain financial models",
      "Draft investment memos and market notes",
      "Support diligence with commercial and financial workstreams",
    ],
    requirements: [
      "Internship or 1–2 years in banking, PE, or investing",
      "Strong Excel and clear writing",
      "German is useful, English is required",
    ],
    skills: ["Financial Modeling", "Excel", "Valuation", "PowerPoint", "Accounting"],
    postedDaysAgo: 2,
    source: SOURCE,
  },
  {
    id: "pe-palisade",
    title: "Private Equity Associate",
    company: "Palisade Partners",
    location: "London",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "finance",
    salaryMin: 85,
    salaryMax: 110,
    summary: "Deal execution in London. Models, process, and portfolio work.",
    description:
      "Palisade Partners is looking for an associate who can run a process without drama. You own the model, keep the data room honest, and work with operating partners after close.",
    aboutCompany:
      "A private markets firm with an engineering-minded investment culture in London.",
    responsibilities: [
      "Lead financial analysis on live transactions",
      "Coordinate advisors and internal workstreams",
      "Support portfolio companies after investment",
    ],
    requirements: [
      "2–4 years in IB, PE, or investing",
      "Comfort with messy data and tight timelines",
    ],
    skills: ["Private Equity", "LBO", "Due Diligence", "Excel", "Financial Modeling"],
    postedDaysAgo: 5,
    source: SOURCE,
  },
  {
    id: "fc-brightlane",
    title: "Financial Controller",
    company: "Brightlane",
    location: "Munich",
    workMode: "onsite",
    employment: "fulltime",
    level: "mid",
    industry: "finance",
    salaryMin: 72,
    salaryMax: 90,
    summary: "Close, reporting, and a clean set of numbers. On-site in Munich.",
    description:
      "Brightlane needs a controller who cares about the close. You own reporting, work with auditors, and keep the leadership team looking at one version of the truth.",
    aboutCompany:
      "A product company with a Munich finance team that prefers calm months to heroic closes.",
    responsibilities: [
      "Run month-end close",
      "Own management reporting",
      "Partner with the business on forecasts",
    ],
    requirements: [
      "3+ years in controlling or accounting",
      "HGB and IFRS literacy",
    ],
    skills: ["Controlling", "IFRS", "Excel", "Reporting", "Forecasting"],
    postedDaysAgo: 7,
    source: SOURCE,
  },
  {
    id: "mc-oakreed",
    title: "Management Consultant",
    company: "Oak & Reed",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "consulting",
    salaryMin: 64,
    salaryMax: 82,
    summary: "Strategy and operations projects with European clients. Based in Berlin.",
    description:
      "Oak & Reed hires consultants who can structure a messy problem by Thursday. You interview, analyze, and write slides that a CEO can actually use.",
    aboutCompany:
      "A boutique strategy firm with teams in Berlin, Munich, and London.",
    responsibilities: [
      "Structure analyses and client interviews",
      "Build the story in slides without burying the point",
      "Travel for on-site weeks when the work needs it",
    ],
    requirements: [
      "Strong academic record or 1–2 years in consulting",
      "Comfort presenting to senior clients",
    ],
    skills: ["Strategy", "Problem Solving", "PowerPoint", "Excel", "Stakeholder Management"],
    postedDaysAgo: 3,
    source: SOURCE,
  },
  {
    id: "sc-meridian",
    title: "Strategy Consultant",
    company: "Meridian",
    location: "London",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "consulting",
    salaryMin: 80,
    salaryMax: 105,
    summary: "Corporate strategy for European industrials and software.",
    description:
      "Meridian is hiring a consultant who can own a workstream. You lead analysis, manage a junior, and keep the partner from rewriting the whole deck on Sunday.",
    aboutCompany:
      "A strategy consultancy working across industrials, software, and healthcare.",
    responsibilities: [
      "Own a workstream from question to recommendation",
      "Coach junior team members",
      "Present findings to client leadership",
    ],
    requirements: [
      "3–5 years in consulting or corporate strategy",
      "Clear writing and quantitative comfort",
    ],
    skills: ["Corporate Strategy", "Market Sizing", "PowerPoint", "Facilitation"],
    postedDaysAgo: 6,
    source: SOURCE,
  },
  {
    id: "ba-helio",
    title: "Business Analyst",
    company: "Helio Partners",
    location: "Munich",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "consulting",
    salaryMin: 58,
    salaryMax: 72,
    summary: "Operations and process work for mid-market clients in Bavaria.",
    description:
      "Helio Partners needs an analyst who likes process more than theatre. You map how work actually happens, find the bottleneck, and help the client change it.",
    aboutCompany:
      "An operations consultancy based in Munich.",
    responsibilities: [
      "Map processes and gather data on site",
      "Build simple models that change a decision",
      "Support implementation after the recommendation",
    ],
    requirements: [
      "Internship or first role in consulting or operations",
      "German and English",
    ],
    skills: ["Process Mapping", "Excel", "Operations", "Workshops"],
    postedDaysAgo: 4,
    source: SOURCE,
  },
  {
    id: "bm-folio",
    title: "Brand Manager",
    company: "Folio Consumer",
    location: "Hamburg",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "marketing",
    salaryMin: 66,
    salaryMax: 84,
    summary: "Own a brand line. Positioning, campaigns, and retail partners.",
    description:
      "Folio Consumer is hiring a brand manager in Hamburg. You own the story, the calendar, and the relationship with agencies without letting the work get fluffy.",
    aboutCompany:
      "A consumer brand house with a Hamburg marketing team.",
    responsibilities: [
      "Set positioning and campaign briefs",
      "Work with agencies and retail partners",
      "Read the numbers and kill what does not work",
    ],
    requirements: [
      "3+ years in brand or product marketing",
      "A portfolio of campaigns you can defend",
    ],
    skills: ["Brand Strategy", "Campaigns", "Positioning", "Retail", "Analytics"],
    postedDaysAgo: 8,
    source: SOURCE,
  },
  {
    id: "pmm-driftway",
    title: "Performance Marketing Manager",
    company: "Driftway",
    location: "Munich",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "marketing",
    salaryMin: 54,
    salaryMax: 70,
    summary: "Paid acquisition with a tight feedback loop. Munich hybrid.",
    description:
      "Driftway wants someone who treats paid channels as a product. You run experiments, keep CAC honest, and do not hide behind dashboards.",
    aboutCompany:
      "An early-stage product company with a small growth team in Munich.",
    responsibilities: [
      "Run paid search and paid social",
      "Set up experiments and report what actually moved",
      "Work with product on landing pages",
    ],
    requirements: [
      "1–3 years in performance marketing",
      "Hands-on with Google Ads and Meta",
    ],
    skills: ["Google Ads", "Meta Ads", "Analytics", "CRO", "SQL"],
    postedDaysAgo: 3,
    source: SOURCE,
  },
  {
    id: "cmm-harbor",
    title: "Content Marketing Manager",
    company: "Harbor",
    location: "Remote",
    workMode: "remote",
    employment: "fulltime",
    level: "junior",
    industry: "marketing",
    salaryMin: 52,
    salaryMax: 68,
    summary: "Editorial content for a European audience. Remote, CET overlap.",
    description:
      "Harbor needs a content manager who can write, brief, and ship on a calendar. You own the blog, newsletter, and the pieces sales actually forwards.",
    aboutCompany:
      "A European product company with a remote marketing team.",
    responsibilities: [
      "Plan and ship editorial content",
      "Brief writers and keep quality high",
      "Measure what turns into pipeline",
    ],
    requirements: [
      "Strong writing in English",
      "1–3 years in content or editorial",
    ],
    skills: ["Content Strategy", "Copywriting", "SEO", "Newsletter"],
    postedDaysAgo: 9,
    source: SOURCE,
  },
  {
    id: "cra-vesper",
    title: "Clinical Research Associate",
    company: "Vesper Health",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "healthcare",
    salaryMin: 56,
    salaryMax: 72,
    summary: "Site monitoring for European trials. Berlin base with travel.",
    description:
      "Vesper Health is hiring a CRA to monitor trial sites. You keep quality high, travel when needed, and write notes that stand up in an audit.",
    aboutCompany:
      "A clinical research organization running studies across Europe.",
    responsibilities: [
      "Monitor trial sites and source data",
      "Track protocol deviations and follow up",
      "Work with investigators and study coordinators",
    ],
    requirements: [
      "Life-science degree or 1–2 years in clinical research",
      "Willingness to travel in DACH and the EU",
    ],
    skills: ["GCP", "Clinical Trials", "Monitoring", "Documentation"],
    postedDaysAgo: 4,
    source: SOURCE,
  },
  {
    id: "hc-vesper",
    title: "Healthcare Consultant",
    company: "Vesper Health",
    location: "Munich",
    workMode: "hybrid",
    employment: "fulltime",
    level: "mid",
    industry: "healthcare",
    salaryMin: 74,
    salaryMax: 95,
    summary: "Strategy work for hospitals and life-science clients.",
    description:
      "You help providers and life-science teams make decisions they will still like in a year. Mix of analysis, workshops, and implementation.",
    aboutCompany:
      "Vesper Health also runs an advisory practice next to its research work.",
    responsibilities: [
      "Lead analyses on care pathways and operations",
      "Facilitate workshops with clinical leaders",
      "Turn recommendations into a plan the client can run",
    ],
    requirements: [
      "3+ years in healthcare consulting or hospital operations",
      "German with clinical stakeholders",
    ],
    skills: ["Healthcare Strategy", "Workshops", "Operations", "Stakeholder Management"],
    postedDaysAgo: 11,
    source: SOURCE,
  },
  {
    id: "om-granite",
    title: "Operations Manager",
    company: "Granite Works",
    location: "Munich",
    workMode: "onsite",
    employment: "fulltime",
    level: "mid",
    industry: "industrial",
    salaryMin: 70,
    salaryMax: 88,
    summary: "Plant operations, planning, and a quieter shop floor.",
    description:
      "Granite Works needs an operations manager who likes being on the floor. You own planning, shift issues, and the metrics that actually change output.",
    aboutCompany:
      "An industrial manufacturer with a Munich site and European customers.",
    responsibilities: [
      "Run weekly operations planning",
      "Remove blockers with production and quality",
      "Keep safety and delivery numbers visible",
    ],
    requirements: [
      "3+ years in operations or manufacturing",
      "Comfortable on site, not only in slides",
    ],
    skills: ["Operations", "Lean", "Planning", "Leadership"],
    postedDaysAgo: 6,
    source: SOURCE,
  },
  {
    id: "sca-nimbus",
    title: "Supply Chain Analyst",
    company: "Nimbus Rail",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "industrial",
    salaryMin: 54,
    salaryMax: 68,
    summary: "Inventory, suppliers, and forecasts for a hardware-software business.",
    description:
      "Nimbus Rail is hiring an analyst to make supply less surprising. You clean data, talk to suppliers, and give operations a forecast they can use.",
    aboutCompany:
      "A logistics software and hardware company with a Berlin operations group.",
    responsibilities: [
      "Build inventory and supplier analyses",
      "Support S&OP with a number people trust",
      "Track exceptions before they become shortages",
    ],
    requirements: [
      "1–3 years in supply chain, logistics, or analytics",
      "Strong Excel, SQL is a plus",
    ],
    skills: ["Supply Chain", "Excel", "Forecasting", "SQL", "S&OP"],
    postedDaysAgo: 5,
    source: SOURCE,
  },
  {
    id: "ep-papertrail",
    title: "Editorial Producer",
    company: "Papertrail Media",
    location: "Berlin",
    workMode: "hybrid",
    employment: "fulltime",
    level: "junior",
    industry: "media",
    salaryMin: 48,
    salaryMax: 62,
    summary: "Commission, edit, and ship stories. Berlin newsroom, two office days.",
    description:
      "Papertrail Media needs a producer who can move a story from idea to publish. You brief writers, edit with a light hand, and keep the calendar honest.",
    aboutCompany:
      "A European digital publisher with a Berlin newsroom.",
    responsibilities: [
      "Commission and edit features",
      "Run the production calendar",
      "Work with audience and social on distribution",
    ],
    requirements: [
      "Editorial experience or a strong writing background",
      "German and English",
    ],
    skills: ["Editing", "Commissioning", "Storytelling", "CMS"],
    postedDaysAgo: 2,
    source: SOURCE,
  },
];

export function demoJobById(id: string) {
  return DEMO_JOBS.find((job) => job.id === id) ?? null;
}

export function catalogJobTitles() {
  return [...new Set(DEMO_JOBS.map((job) => job.title))];
}

export const CITY_COUNTRY: Record<string, string> = {
  Berlin: "Germany",
  Munich: "Germany",
  Hamburg: "Germany",
  London: "United Kingdom",
  Amsterdam: "Netherlands",
  Zurich: "Switzerland",
  Remote: "Remote",
};

export function catalogLocations() {
  const cities = [...new Set(DEMO_JOBS.map((job) => job.location))];
  const countries = [
    ...new Set(
      cities
        .map((city) => CITY_COUNTRY[city])
        .filter((item): item is string => Boolean(item) && item !== "Remote"),
    ),
  ];
  return { cities, countries };
}
