"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ProfileAvatar } from "@/components/landing/profile-avatar";
import {
  profileCriteria,
  profileIsSet,
  type UserProfile,
} from "@/lib/profile";
import { criteriaChips } from "@/lib/search";

export function ChatProfileCard({ profile }: { profile: UserProfile }) {
  const filled = profileIsSet(profile);
  const chips = useMemo(
    () => criteriaChips(profileCriteria(profile)),
    [profile],
  );

  return (
    <Link
      href="/profil"
      className="flex items-center gap-3 border-b border-hairline-soft bg-surface-faint px-5 py-3 md:px-8"
    >
      <span
        className={
          filled && !profile.photo
            ? "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink text-[11px] font-medium text-white"
            : "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-canvas text-ink ring-1 ring-hairline"
        }
      >
        <ProfileAvatar profile={profile} size="md" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium tracking-[-0.16px] text-ink">
          {filled
            ? profile.name.trim() || "Dein Profil"
            : "Profil für besseren Fit"}
        </span>
        {chips.length ? (
          <span className="mt-0.5 block truncate text-[12px] text-muted">
            {chips.join(" · ")}
          </span>
        ) : (
          <span className="mt-0.5 block text-[12px] text-muted">
            Rolle, Ort, Stack und Gehalt, dann passt der Fit genauer.
          </span>
        )}
      </span>
      <span className="shrink-0 text-[13px] font-medium tracking-[-0.16px] text-ink">
        {filled ? "Anpassen" : "Anlegen"}
      </span>
    </Link>
  );
}
