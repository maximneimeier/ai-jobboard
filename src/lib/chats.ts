import type { FollowUp } from "./follow-ups";
import type { Criteria } from "./search";
import type { RankedJob } from "./search";

export type ChatTurn = {
  id: string;
  query: string;
  reply: string;
  results: RankedJob[];
  chips: string[];
  questions?: FollowUp[];
};

export type SavedChat = {
  id: string;
  title: string;
  updatedAt: number;
  turns: ChatTurn[];
  criteria: Criteria;
};

const STORAGE_KEY = "aria.chats";
export const CHATS_EVENT = "aria-chats";
export const CHAT_OPEN_EVENT = "aria-chat-open";

export function emitChatOpen(open: boolean) {
  window.dispatchEvent(new CustomEvent(CHAT_OPEN_EVENT, { detail: open }));
}

let rawCache: string | null = null;
let snapshot: SavedChat[] = [];
const EMPTY_CHATS: SavedChat[] = [];

function parse(raw: string | null): SavedChat[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedChat);
  } catch {
    return [];
  }
}

function isSavedChat(value: unknown): value is SavedChat {
  if (!value || typeof value !== "object") return false;
  const chat = value as SavedChat;
  return (
    typeof chat.id === "string" &&
    typeof chat.title === "string" &&
    typeof chat.updatedAt === "number" &&
    Array.isArray(chat.turns)
  );
}

function loadFromStorage(): SavedChat[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === rawCache) return snapshot;
  rawCache = raw;
  snapshot = parse(raw);
  return snapshot;
}

function persist(next: SavedChat[]) {
  snapshot = next;
  const raw = JSON.stringify(next);
  rawCache = raw;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(CHATS_EVENT));
}

export function readChats(): SavedChat[] {
  return loadFromStorage();
}

export function readChatsSnapshot(): SavedChat[] {
  return EMPTY_CHATS;
}

export function subscribeChats(onStoreChange: () => void) {
  function onChange() {
    loadFromStorage();
    onStoreChange();
  }
  window.addEventListener(CHATS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHATS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function chatTitleFromTurns(turns: ChatTurn[]) {
  const first = turns[0]?.query.trim() ?? "";
  if (!first) return "Neuer Chat";
  return first.length > 48 ? `${first.slice(0, 45)}...` : first;
}

export function upsertChat(chat: SavedChat) {
  if (!chat.turns.length) return;
  const current = loadFromStorage();
  const existing = current.find((item) => item.id === chat.id);
  if (
    existing &&
    existing.title === chat.title &&
    JSON.stringify(existing.turns) === JSON.stringify(chat.turns) &&
    JSON.stringify(existing.criteria) === JSON.stringify(chat.criteria)
  ) {
    return;
  }
  const next = [chat, ...current.filter((item) => item.id !== chat.id)].slice(
    0,
    30,
  );
  persist(next);
}

export function deleteChat(id: string) {
  persist(loadFromStorage().filter((item) => item.id !== id));
}

export function chatTimeLabel(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (sameDay) {
    return date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
}
