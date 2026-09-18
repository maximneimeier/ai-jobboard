"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ProfileAvatar } from "@/components/landing/profile-avatar";
import {
  EMPTY_PROFILE,
  profileIsSet,
  readProfile,
  subscribeProfile,
} from "@/lib/profile";

export function ProfileMenu({ compact = false }: { compact?: boolean }) {
  const profile = useSyncExternalStore(
    subscribeProfile,
    readProfile,
    () => EMPTY_PROFILE,
  );
  const filled = profileIsSet(profile);

  return (
    <Link
      href="/profil"
      className={
        compact
          ? "inline-flex size-9 items-center justify-center rounded-md ring-1 ring-hairline"
          : "inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-[14px] tracking-[-0.16px] text-ink ring-1 ring-hairline"
      }
    >
      <span
        className={
          filled && !profile.photo
            ? "flex size-6 items-center justify-center overflow-hidden rounded-md bg-ink text-[10px] font-medium text-white"
            : "flex size-6 items-center justify-center overflow-hidden rounded-md"
        }
      >
        <ProfileAvatar profile={profile} />
      </span>
      {compact ? (
        <span className="sr-only">Profil</span>
      ) : (
        <span>{profile.name.trim().split(/\s+/)[0] || "Profil"}</span>
      )}
    </Link>
  );
}
