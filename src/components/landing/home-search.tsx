"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { ChatNav } from "@/components/landing/chat-nav";
import { ChatProfileCard } from "@/components/landing/chat-profile-card";
import { ChatSidebar } from "@/components/landing/chat-sidebar";
import { JobCard } from "@/components/landing/job-card";
import {
  chatTitleFromTurns,
  deleteChat,
  emitChatOpen,
  readChats,
  readChatsSnapshot,
  subscribeChats,
  upsertChat,
} from "@/lib/chats";
import {
  EMPTY_PROFILE,
  isRegistered,
  profileCriteria,
  readProfile,
  subscribeProfile,
} from "@/lib/profile";
import {
  followUpsFor,
  type FollowUp,
  type FollowUpOption,
} from "@/lib/follow-ups";
import {
  EMPTY_CRITERIA,
  criteriaChips,
  mergeCriteria,
  rankJobs,
  replyFor,
  type Criteria,
  type RankedJob,
} from "@/lib/search";
import { readSavedJobs } from "@/lib/saved-jobs";
import { writeSearchLocation } from "@/lib/search-location";
import { markJobsSeen, readSeenJobIds } from "@/lib/seen-jobs";

const FREE_QUERIES = 5;
const STORAGE_KEY = "aria.queryCount";
const COUNT_EVENT = "aria-query-count";

const SUGGESTIONS = [
  {
    text: "Senior Product Designer in Berlin, hybrid, ab 80k, starkes Design-Team",
    icon: "design",
  },
  {
    text: "Remote Backend in Go, DACH, ohne Bereitschaft",
    icon: "code",
  },
  {
    text: "Growth Lead, remote, 4-Tage-Woche, Startup",
    icon: "growth",
  },
];

type Turn = {
  id: string;
  query: string;
  reply: string;
  results: RankedJob[];
  chips: string[];
  questions?: FollowUp[];
  busy: boolean;
};

function readQueryCount() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function subscribeQueryCount(onStoreChange: () => void) {
  window.addEventListener(COUNT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(COUNT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function writeQueryCount(next: number) {
  window.localStorage.setItem(STORAGE_KEY, String(next));
  window.dispatchEvent(new Event(COUNT_EVENT));
}

export function HomeSearch() {
  const [input, setInput] = useState("");
  const [criteria, setCriteria] = useState<Criteria>(EMPTY_CRITERIA);
  const [appliedProfileKey, setAppliedProfileKey] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openJobId, setOpenJobId] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);
  const [proEmail, setProEmail] = useState("");
  const [proDone, setProDone] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLInputElement>(null);
  const turnId = useRef(0);
  const chatSeq = useRef(0);
  const chatIdRef = useRef<string | null>(null);
  const queryCount = useSyncExternalStore(
    subscribeQueryCount,
    readQueryCount,
    () => 0,
  );
  const profile = useSyncExternalStore(
    subscribeProfile,
    readProfile,
    () => EMPTY_PROFILE,
  );
  const chats = useSyncExternalStore(subscribeChats, readChats, readChatsSnapshot);
  const baseCriteria = useMemo(() => profileCriteria(profile), [profile]);
  const profileKey = profile.bio;

  if (appliedProfileKey !== profileKey && !turns.some((turn) => turn.busy)) {
    setAppliedProfileKey(profileKey);
    if (!turns.length) {
      setCriteria(baseCriteria);
    } else {
      let acc = baseCriteria;
      const rematched = turns.map((turn) => {
        acc = mergeCriteria(acc, turn.query);
        const results = rankJobs(acc);
        return {
          ...turn,
          results,
          chips: criteriaChips(acc),
          reply: replyFor(acc, results),
        };
      });
      const asked = askedQuestionIds(turns.slice(0, -1));
      setTurns(
        rematched.map((turn, index) =>
          index === rematched.length - 1
            ? {
                ...turn,
                questions: followUpsFor(acc, turn.results, asked),
              }
            : turn,
        ),
      );
      setCriteria(acc);
    }
  }

  const remaining = Math.max(0, FREE_QUERIES - Math.min(queryCount, FREE_QUERIES));
  const paywallVisible = paywall || queryCount > FREE_QUERIES;
  const registered = isRegistered(profile);
  const chatOpen = workspaceOpen || turns.length > 0;
  const lastChips = useMemo(
    () => turns.at(-1)?.chips ?? [],
    [turns],
  );
  const chatTitle = turns.length ? chatTitleFromTurns(turns) : "Neue Suche";

  function closeWorkspace() {
    setTurns([]);
    setWorkspaceOpen(false);
    setPaywall(false);
    setSidebarOpen(false);
    setOpenJobId(null);
    chatIdRef.current = null;
    setCurrentChatId(null);
    emitChatOpen(false);
    window.scrollTo({ top: 0 });
  }

  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [turns]);

  useEffect(() => {
    if (!chatOpen) return;
    composerRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    emitChatOpen(true);
    return () => {
      document.body.style.overflow = previous;
      emitChatOpen(false);
    };
  }, [chatOpen]);

  useEffect(() => {
    function onHash() {
      const hash = window.location.hash;
      if (hash === "#arbeitgeber" || hash === "#preise" || hash === "#berufe") {
        closeWorkspace();
      }
    }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!registered) return;
    const id = chatIdRef.current;
    if (!id || turns.some((turn) => turn.busy)) return;
    const ready = turns.map((turn) => ({
      id: turn.id,
      query: turn.query,
      reply: turn.reply,
      results: turn.results,
      chips: turn.chips,
      questions: turn.questions,
    }));
    if (!ready.length) return;
    upsertChat({
      id,
      title: chatTitleFromTurns(ready),
      updatedAt: Date.now(),
      turns: ready,
      criteria,
    });
  }, [turns, criteria, registered]);

  function ensureChatId() {
    if (chatIdRef.current) return chatIdRef.current;
    chatSeq.current += 1;
    const id = `chat-${chatSeq.current}`;
    chatIdRef.current = id;
    setCurrentChatId(id);
    return id;
  }

  function startNewChat() {
    chatIdRef.current = null;
    setCurrentChatId(null);
    setTurns([]);
    setCriteria(baseCriteria);
    setOpenJobId(null);
    setPaywall(false);
    setWorkspaceOpen(true);
    setSidebarOpen(false);
  }

  function showNewProfileJobs() {
    const query = "Neue Stellen, die zu meinem Profil passen";
    turnId.current += 1;
    const id = String(turnId.current);
    chatIdRef.current = null;
    setCurrentChatId(null);
    setInput("");
    setCriteria(baseCriteria);
    setOpenJobId(null);
    setWorkspaceOpen(true);
    setSidebarOpen(false);
    emitChatOpen(true);
    ensureChatId();

    if (queryCount >= FREE_QUERIES) {
      writeQueryCount(FREE_QUERIES + 1);
      setPaywall(true);
      setTurns([{ id, query, reply: "", results: [], chips: [], busy: false }]);
      return;
    }

    writeQueryCount(queryCount + 1);
    setPaywall(false);
    setTurns([{ id, query, reply: "", results: [], chips: [], busy: true }]);

    window.setTimeout(() => {
      const all = rankJobs(baseCriteria);
      const seen = new Set([
        ...readSeenJobIds(),
        ...readSavedJobs().map((job) => job.id),
        ...chats.flatMap((chat) =>
          chat.turns.flatMap((turn) => turn.results.map((job) => job.id)),
        ),
        ...turns.flatMap((turn) => turn.results.map((job) => job.id)),
      ]);
      const fresh = all.filter((job) => !seen.has(job.id));
      const nextResults = (fresh.length ? fresh : all).slice(0, 8);
      const chips = criteriaChips(baseCriteria);
      markJobsSeen(nextResults.map((job) => job.id));
      setTurns([
        {
          id,
          query,
          reply: discoverReply(chips, nextResults, Boolean(fresh.length)),
          results: nextResults,
          chips,
          questions: followUpsFor(baseCriteria, nextResults, []),
          busy: false,
        },
      ]);
    }, 550);
  }

  function openSavedChat(id: string) {
    const chat = chats.find((item) => item.id === id);
    if (!chat) return;
    chatIdRef.current = chat.id;
    setCurrentChatId(chat.id);
    setTurns(chat.turns.map((turn) => ({ ...turn, busy: false })));
    setCriteria(chat.criteria);
    setOpenJobId(null);
    setPaywall(false);
    setWorkspaceOpen(true);
    setSidebarOpen(false);
  }

  function removeChat(id: string) {
    deleteChat(id);
    if (chatIdRef.current === id) startNewChat();
  }

  function runSearch(
    text: string,
    options?: { followUp?: boolean; display?: string },
  ) {
    const display = options?.display ?? text;
    turnId.current += 1;
    const id = String(turnId.current);
    setInput("");
    setWorkspaceOpen(true);
    emitChatOpen(true);
    ensureChatId();

    if (!options?.followUp && queryCount >= FREE_QUERIES) {
      writeQueryCount(FREE_QUERIES + 1);
      setPaywall(true);
      setTurns((current) => [
        ...current,
        { id, query: display, reply: "", results: [], chips: [], busy: false },
      ]);
      return;
    }

    if (!options?.followUp) {
      writeQueryCount(queryCount + 1);
    }
    setOpenJobId(null);
    setTurns((current) => [
      ...current,
      { id, query: display, reply: "", results: [], chips: [], busy: true },
    ]);

    window.setTimeout(() => {
      const nextCriteria = mergeCriteria(criteria, text);
      const nextResults = rankJobs(nextCriteria);
      const nextReply = replyFor(nextCriteria, nextResults);
      setCriteria(nextCriteria);
      writeSearchLocation(nextCriteria, text);
      markJobsSeen(nextResults.map((job) => job.id));
      setTurns((current) => {
        const asked = askedQuestionIds(current);
        return current.map((turn) =>
          turn.id === id
            ? {
                ...turn,
                reply: nextReply,
                results: nextResults,
                chips: criteriaChips(nextCriteria),
                questions: followUpsFor(nextCriteria, nextResults, asked),
                busy: false,
              }
            : turn,
        );
      });
    }, 550);
  }

  function answerFollowUp(option: FollowUpOption) {
    if (!option.query) {
      setTurns((current) => {
        const last = current.at(-1);
        if (!last) return current;
        turnId.current += 1;
        const asked = [...askedQuestionIds(current), ...(last.questions ?? []).map((item) => item.id)];
        return [
          ...current,
          {
            id: String(turnId.current),
            query: option.label,
            reply: "Alles klar, ich lasse das so und bleibe bei den Treffern.",
            results: last.results,
            chips: last.chips,
            questions: followUpsFor(criteria, last.results, asked),
            busy: false,
          },
        ];
      });
      return;
    }
    runSearch(option.query, { followUp: true, display: option.label });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || turns.some((turn) => turn.busy)) return;
    runSearch(text);
  }

  if (chatOpen) {
    return (
      <section
        id="suche"
        className="fixed inset-0 z-50 flex flex-col bg-canvas"
      >
        <ChatNav
          title={chatTitle}
          registered={registered}
          remaining={remaining}
          paywallVisible={paywallVisible}
          onClose={closeWorkspace}
          onOpenChats={registered ? () => setSidebarOpen(true) : undefined}
        />
        <div className="relative flex min-h-0 flex-1">
          {registered ? (
            <>
              {sidebarOpen ? (
                <button
                  type="button"
                  className="absolute inset-0 z-10 bg-ink/10 md:hidden"
                  aria-label="Chats schließen"
                  onClick={() => setSidebarOpen(false)}
                />
              ) : null}
              {sidebarOpen ? (
                <ChatSidebar
                  mobile
                  chats={chats}
                  activeId={currentChatId}
                  onNew={startNewChat}
                  onDiscover={showNewProfileJobs}
                  onSelect={openSavedChat}
                  onDelete={removeChat}
                  onClose={() => setSidebarOpen(false)}
                />
              ) : null}
              <ChatSidebar
                chats={chats}
                activeId={currentChatId}
                onNew={startNewChat}
                onDiscover={showNewProfileJobs}
                onSelect={openSavedChat}
                onDelete={removeChat}
              />
            </>
          ) : null}

          <div className="relative flex min-w-0 flex-1 flex-col">
            <ChatProfileCard profile={profile} />
            <div ref={threadRef} className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[768px] px-5 py-8 pb-28 md:px-8">
                {turns.length === 0 ? (
                  <div className="pt-10">
                    <h2 className="font-display text-[28px] font-semibold tracking-[-0.32px] text-ink">
                      Neue Suche
                    </h2>
                    <p className="mt-2 max-w-[42ch] text-[15px] leading-6 text-body">
                      Schreib, was du suchst. Oben im Profil stehen die Angaben,
                      die den Fit schärfen.
                    </p>
                  </div>
                ) : null}
                {turns.map((turn) => (
                  <div key={turn.id} className="mb-8 space-y-5">
                    <div className="flex justify-end">
                      <p className="max-w-[85%] rounded-lg bg-surface-soft px-4 py-3 text-left text-[15px] leading-6 tracking-[-0.16px] text-ink">
                        {turn.query}
                      </p>
                    </div>
                    <div>
                      {turn.busy ? (
                        <p className="text-[15px] leading-6 text-body">
                          Aria sucht passende Rollen…
                        </p>
                      ) : (
                        <>
                          {turn.reply ? (
                            <p className="text-[15px] leading-7 text-ink">{turn.reply}</p>
                          ) : null}
                          {turn.chips.length ? (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {turn.chips.map((chip) => (
                                <span
                                  key={chip}
                                  className="rounded-md bg-canvas px-2.5 py-1 text-[12px] font-medium text-ink-soft ring-1 ring-hairline-soft"
                                >
                                  {chip}
                                </span>
                              ))}
                            </div>
                          ) : null}
                          <div className="mt-4 space-y-2">
                            {turn.results.map((job) => (
                              <JobCard
                                key={job.id}
                                job={job}
                                open={openJobId === job.id}
                                onToggle={() =>
                                  setOpenJobId((current) =>
                                    current === job.id ? null : job.id,
                                  )
                                }
                              />
                            ))}
                          </div>
                          {turn.questions?.length &&
                          turn.id === turns.at(-1)?.id &&
                          !paywallVisible ? (
                            <div className="mt-6 rounded-lg bg-surface-faint px-4 py-4 ring-1 ring-hairline-soft">
                              {turn.questions.map((question) => (
                                <div key={question.id}>
                                  <p className="text-[15px] leading-7 text-ink">
                                    {question.prompt}
                                  </p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {question.options.map((option) => (
                                      <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => answerFollowUp(option)}
                                        className="inline-flex h-9 items-center rounded-md px-3 text-[13px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline hover:bg-canvas"
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-hairline-soft bg-canvas/95 backdrop-blur-md">
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex w-full max-w-[768px] items-end gap-2 px-5 py-4 md:px-8"
              >
                <label className="sr-only" htmlFor="job-query">
                  Nachricht an Aria
                </label>
                <input
                  ref={composerRef}
                  id="job-query"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    turns.at(-1)?.questions?.length
                      ? "Antwort schreiben oder oben wählen"
                      : turns.length
                        ? "Suche verfeinern…"
                        : "Beschreibe deine Wunschrolle"
                  }
                  disabled={turns.some((turn) => turn.busy) || paywallVisible}
                  className="h-12 flex-1 rounded-lg bg-canvas px-4 text-[15px] tracking-[-0.16px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft focus:ring-ink disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={turns.some((turn) => turn.busy) || paywallVisible}
                  className="inline-flex size-12 items-center justify-center rounded-lg bg-ink text-white disabled:opacity-40"
                  aria-label="Senden"
                >
                  <SendIcon />
                </button>
              </form>
              <p className="mx-auto flex max-w-[768px] flex-wrap items-center gap-x-3 gap-y-1 px-5 pb-4 text-[12px] text-muted md:px-8">
                <span>
                  {paywallVisible
                    ? "Kontingent aufgebraucht"
                    : `${remaining} Suchen übrig`}
                  {lastChips.length ? ` · ${lastChips.join(", ")}` : ""}
                </span>
                <Link href="/profil" className="font-medium text-ink">
                  Profil anpassen
                </Link>
              </p>
            </div>

            {paywallVisible ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-canvas/92 p-5">
                <div className="w-full max-w-md rounded-lg bg-canvas p-6 ring-1 ring-hairline">
                  <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
                    Aria Pro
                  </p>
                  <h3 className="font-display mt-3 text-[28px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink">
                    Fünf Suchen sind aufgebraucht.
                  </h3>
                  <p className="mt-3 text-[15px] leading-6 text-body">
                    Unbegrenzt weitersuchen, Profile speichern und direkt bewerben:
                    Aria Pro für 12 € im Monat.
                  </p>
                  {proDone ? (
                    <p className="mt-5 text-[15px] font-medium text-ink">
                      Danke. Wir schalten Pro für diese Adresse frei.
                    </p>
                  ) : (
                    <form
                      className="mt-5 flex flex-col gap-2 sm:flex-row"
                      onSubmit={(event) => {
                        event.preventDefault();
                        if (!proEmail.trim()) return;
                        setProDone(true);
                      }}
                    >
                      <input
                        type="email"
                        required
                        value={proEmail}
                        onChange={(event) => setProEmail(event.target.value)}
                        placeholder="E-Mail-Adresse"
                        className="h-11 flex-1 rounded-md px-3.5 text-[15px] ring-1 ring-hairline outline-none placeholder:text-muted-soft focus:ring-ink"
                      />
                      <button
                        type="submit"
                        className="inline-flex h-11 items-center justify-center rounded-md bg-ink px-4 text-[15px] font-medium text-white hover:bg-ink-soft"
                      >
                        Pro starten
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="suche" className="hero-wash scroll-mt-[72px]">
      <div className="relative mx-auto max-w-[920px] px-5 pt-20 pb-12 text-center md:pt-28">
        <p className="inline-flex items-center rounded-md bg-surface-soft px-3 py-2 text-[15px] font-medium tracking-[-0.16px] text-ink">
          Suche in normalen Sätzen
        </p>
        <h1 className="font-display mx-auto mt-7 max-w-[16ch] text-[40px] leading-none font-semibold tracking-[-0.04em] text-ink sm:text-[56px] lg:text-[64px]">
          Finde den Job, der wirklich zu dir passt.
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-[17px] leading-7 text-body">
          Schreib, was du suchst. Aria liest Anforderungen und zeigt Stellen
          mit Begründung.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-[640px] items-center gap-2">
          <label className="sr-only" htmlFor="job-query">
            Beschreibe deine Wunschrolle
          </label>
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">
              <SearchIcon />
            </span>
            <input
              id="job-query"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Beschreibe deine Wunschrolle"
              disabled={paywallVisible}
              className="h-12 w-full rounded-md bg-canvas pr-4 pl-11 text-[15px] tracking-[-0.16px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft focus:ring-ink disabled:opacity-70"
            />
          </div>
          <button
            type="submit"
            disabled={paywallVisible}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-md bg-ink text-white disabled:opacity-40"
            aria-label="Suchen"
          >
            <SendIcon />
          </button>
        </form>
      </div>

      <div className="mx-auto max-w-[1080px] px-5 pb-16 md:px-8">
        <p className="text-[15px] tracking-[-0.16px] text-body">
          Nicht sicher, was du eingeben sollst? Ein paar Einstiege:
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {SUGGESTIONS.map((item) => (
            <button
              key={item.text}
              type="button"
              onClick={() => runSearch(item.text)}
              disabled={paywallVisible}
              className="flex min-h-[132px] flex-col justify-between rounded-lg bg-canvas p-5 text-left ring-1 ring-hairline-soft hover:bg-surface-faint disabled:opacity-50"
            >
              <p className="text-[15px] leading-6 tracking-[-0.16px] text-ink">
                {item.text}
              </p>
              <SuggestionIcon name={item.icon} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function askedQuestionIds(turns: Turn[]) {
  return turns.flatMap((turn) => turn.questions?.map((item) => item.id) ?? []);
}

function discoverReply(
  chips: string[],
  results: RankedJob[],
  fresh: boolean,
) {
  if (!chips.length) {
    return "Im Profil steht noch zu wenig. Ergänze Rolle, Ort oder Stack, dann suche ich neue Stellen.";
  }
  if (!results.length) {
    return `Zum Profil ${chips.join(", ")} gibt es gerade keine Treffer. Schärf Ort, Stack oder Gehalt.`;
  }
  const top = results[0];
  const extra =
    results.length > 1
      ? ` Daneben ${results.length - 1} weitere, sortiert nach Fit.`
      : "";
  if (!fresh) {
    return `Keine neuen Stellen mehr. Das sind weiter die stärksten zum Profil. ${top.role} bei ${top.company}, ${top.match}% Fit.${extra}`;
  }
  return `Neue Stellen zum Profil: ${chips.join(", ")}. Stärkster neuer Treffer ist ${top.role} bei ${top.company} mit ${top.match}% Fit.${extra}`;
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="8" cy="8" r="5.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 12.5L15.5 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SuggestionIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    design: "M4 14l6-10 6 10H4z",
    code: "M7 6L4 9l3 3M11 6l3 3-3 3",
    growth: "M4 13l4-4 3 3 5-6",
  };
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="text-muted">
      <path
        d={paths[name]}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
