"use client";

import {
  chatTimeLabel,
  type SavedChat,
} from "@/lib/chats";

export function ChatSidebar({
  chats,
  activeId,
  onNew,
  onDiscover,
  onSelect,
  onDelete,
  onClose,
  mobile,
}: {
  chats: SavedChat[];
  activeId: string | null;
  onNew: () => void;
  onDiscover: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClose?: () => void;
  mobile?: boolean;
}) {
  return (
    <aside
      className={
        mobile
          ? "absolute inset-y-0 left-0 z-20 flex w-[min(84vw,260px)] flex-col border-r border-hairline-soft bg-surface-faint shadow-[8px_0_24px_rgba(0,0,0,0.06)]"
          : "hidden w-[248px] shrink-0 flex-col border-r border-hairline-soft bg-surface-faint md:flex"
      }
    >
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Chats
        </p>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-ink md:hidden"
            aria-label="Chats schließen"
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
      <div className="space-y-2 px-3 pb-3">
        <button
          type="button"
          onClick={onNew}
          className="inline-flex h-9 w-full items-center justify-center rounded-md bg-ink text-[13px] font-medium tracking-[-0.16px] text-white"
        >
          Neuer Chat
        </button>
        <button
          type="button"
          onClick={onDiscover}
          className="inline-flex h-9 w-full items-center justify-center rounded-md text-[13px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline"
        >
          Neue Stellen
        </button>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {chats.length === 0 ? (
          <p className="px-2 py-3 text-[13px] leading-5 text-muted">
            Gespeicherte Suchen erscheinen hier.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {chats.map((chat) => {
              const active = chat.id === activeId;
              return (
                <li key={chat.id}>
                  <div
                    className={
                      active
                        ? "group flex items-center rounded-md bg-canvas ring-1 ring-hairline-soft"
                        : "group flex items-center rounded-md hover:bg-canvas"
                    }
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(chat.id)}
                      className="min-w-0 flex-1 px-2.5 py-2 text-left"
                    >
                      <span className="block truncate text-[13px] font-medium tracking-[-0.16px] text-ink">
                        {chat.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted">
                        {chatTimeLabel(chat.updatedAt)}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label="Chat löschen"
                      onClick={() => onDelete(chat.id)}
                      className="mr-1 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted opacity-0 group-hover:opacity-100 hover:text-ink"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M3 3l6 6M9 3l-6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
