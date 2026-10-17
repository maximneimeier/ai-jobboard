export const paths = {
  account: "/account",
  saved: "/account/saved",
  savedJob: (id: string) => `/account/saved/${id}`,
  applications: "/applications",
  settings: "/settings",
  profile: "/account/profile",
  copilot: "/account/copilot",
  alerts: "/account/alerts",
  signin: "/signin",
  signup: "/signup",
  jobs: "/jobs",
  job: (id: string) => `/jobs/${id}`,
  jobsSearch: (role?: string, location?: string) => {
    const params = new URLSearchParams();
    if (role && role !== "Open search") params.set("role", role);
    if (location && location !== "Any location") params.set("location", location);
    const qs = params.toString();
    return qs ? `/jobs?${qs}` : "/jobs";
  },
} as const;
