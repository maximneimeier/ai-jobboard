const STORAGE_KEY = "aria.seenJobs";

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function readSeenJobIds() {
  return parse(window.localStorage.getItem(STORAGE_KEY));
}

export function markJobsSeen(ids: string[]) {
  if (!ids.length) return;
  const next = [...new Set([...readSeenJobIds(), ...ids])].slice(-200);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
