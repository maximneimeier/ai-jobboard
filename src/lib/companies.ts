import { JOBS } from "./jobs";
import type { SearchLocation } from "./search-location";

export type Company = {
  name: string;
  field: string;
  size: string;
  logo: string;
  cities: string[];
  jobs: number;
};

const META: Record<string, { field: string; size: string; logo: string }> = {
  Linear: { field: "Design / Product", size: "51 - 100", logo: "/logos/linear.svg" },
  Pitch: { field: "SaaS", size: "101 - 250", logo: "/logos/pitch.png" },
  Personio: { field: "HR / Software", size: "1 001 - 5 000", logo: "/logos/personio.svg" },
  Raycast: { field: "Productivity", size: "11 - 50", logo: "/logos/raycast.svg" },
  Polar: { field: "Open Source / Payments", size: "11 - 50", logo: "/logos/polar.png" },
  Langfuse: { field: "LLM / Observability", size: "11 - 50", logo: "/logos/langfuse.png" },
  N26: { field: "Banken / Fintech", size: "1 001 - 5 000", logo: "/logos/n26.svg" },
  "Trade Republic": { field: "Fintech", size: "501 - 1 000", logo: "/logos/trade-republic.svg" },
  Celonis: { field: "Data / Software", size: "1 001 - 5 000", logo: "/logos/celonis.svg" },
  GetYourGuide: { field: "Travel / Marketplace", size: "501 - 1 000", logo: "/logos/getyourguide.png" },
  Contentful: { field: "CMS / SaaS", size: "251 - 500", logo: "/logos/contentful.svg" },
  Adjust: { field: "Mobile / Attribution", size: "501 - 1 000", logo: "/logos/adjust.png" },
  Zalando: { field: "E-Commerce", size: "10 001+", logo: "/logos/zalando.svg" },
  SAP: { field: "Enterprise / Software", size: "10 001+", logo: "/logos/sap.svg" },
  Siemens: { field: "Industrie / Software", size: "10 001+", logo: "/logos/siemens.svg" },
  "Delivery Hero": { field: "Delivery / Marketplace", size: "5 001 - 10 000", logo: "/logos/delivery-hero.png" },
  HelloFresh: { field: "Food / Consumer", size: "5 001 - 10 000", logo: "/logos/hellofresh.svg" },
  Commerzbank: { field: "Banken", size: "10 001+", logo: "/logos/commerzbank.svg" },
  SumUp: { field: "Fintech / Payments", size: "1 001 - 5 000", logo: "/logos/sumup.svg" },
  Typeform: { field: "SaaS", size: "251 - 500", logo: "/logos/typeform.svg" },
  Figma: { field: "Design / Software", size: "1 001 - 5 000", logo: "/logos/figma.svg" },
  Vercel: { field: "Developer Tools", size: "251 - 500", logo: "/logos/vercel.svg" },
  Ottonova: { field: "Insurtech", size: "101 - 250", logo: "/logos/ottonova.png" },
  Staffbase: { field: "Internal Comms / SaaS", size: "251 - 500", logo: "/logos/staffbase.svg" },
};

export const COMPANIES: Company[] = Object.values(
  JOBS.reduce<Record<string, Company>>((acc, job) => {
    const existing = acc[job.company];
    const meta = META[job.company] ?? {
      field: "Software",
      size: "51 - 100",
      logo: "",
    };
    if (!existing) {
      acc[job.company] = {
        name: job.company,
        field: meta.field,
        size: meta.size,
        logo: meta.logo,
        cities: [job.city],
        jobs: 1,
      };
      return acc;
    }
    existing.jobs += 1;
    if (!existing.cities.includes(job.city)) existing.cities.push(job.city);
    return acc;
  }, {}),
).sort((a, b) => a.name.localeCompare(b.name, "de"));

export const DIRECTORY_CITIES = ["Berlin", "München", "Frankfurt", "Chemnitz", "Remote"] as const;

export type DirectoryFilter = (typeof DIRECTORY_CITIES)[number] | "all";

export function resolveDirectoryFilter(
  location: SearchLocation,
  override: DirectoryFilter | null,
): DirectoryFilter {
  if (override) return override;
  if (location.cities.length === 1) {
    return DIRECTORY_CITIES.includes(location.cities[0] as (typeof DIRECTORY_CITIES)[number])
      ? (location.cities[0] as DirectoryFilter)
      : "all";
  }
  if (location.cities.length > 1) return "all";
  if (location.remote) return "Remote";
  if (location.dach) return "all";
  return "Berlin";
}

export function companiesForFilter(
  filter: DirectoryFilter,
  location: SearchLocation,
  override: DirectoryFilter | null,
): Company[] {
  if (filter !== "all") {
    return COMPANIES.filter((company) => company.cities.includes(filter));
  }
  if (override === "all") return COMPANIES;
  if (location.cities.length) {
    return COMPANIES.filter((company) =>
      company.cities.some((city) => location.cities.includes(city)),
    );
  }
  return COMPANIES;
}

export function logoForCompany(name: string) {
  return META[name]?.logo ?? "";
}
