"use client";

import { Logo } from "./logo";
import { ProfileMenu } from "./profile-menu";
import { SavedJobsButton } from "./saved-jobs-button";

export function ChatNav({
  title,
  registered,
  remaining,
  paywallVisible,
  onClose,
  onOpenChats,
}: {
  title: string;
  registered: boolean;
  remaining: number;
  paywallVisible: boolean;
  onClose: () => void;
  onOpenChats?: () => void;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-hairline-soft bg-surface/90 px-3 backdrop-blur-md md:h-16 md:px-5">
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        {registered && onOpenChats ? (
          <button
            type="button"
            onClick={onOpenChats}
            className="inline-flex h-9 items-center rounded-md px-2.5 text-[13px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline md:hidden"
          >
            Chats
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          className="rounded-md"
          aria-label="Zur Startseite"
        >
          <Logo />
        </button>
      </div>

      <p className="min-w-0 flex-1 truncate px-2 text-center text-[14px] font-medium tracking-[-0.16px] text-ink">
        {title}
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <p className="hidden text-[12px] text-muted md:block">
          {paywallVisible ? "Kontingent aufgebraucht" : `${remaining} übrig`}
        </p>
        <SavedJobsButton compact />
        <div className="md:hidden">
          <ProfileMenu compact />
        </div>
        <div className="hidden md:block">
          <ProfileMenu />
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-9 items-center justify-center rounded-md text-ink ring-1 ring-hairline"
          aria-label="Schließen"
        >
          <CloseIcon />
        </button>
      </div>
    </header>
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
