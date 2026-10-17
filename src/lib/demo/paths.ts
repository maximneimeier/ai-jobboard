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
} as const;
