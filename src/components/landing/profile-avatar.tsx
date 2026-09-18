import { profileInitials, type UserProfile } from "@/lib/profile";

export function ProfileAvatar({
  profile,
  size = "sm",
}: {
  profile: UserProfile;
  size?: "sm" | "md" | "lg";
}) {
  const initials = profileInitials(profile);
  const box =
    size === "lg"
      ? "size-[72px] text-[18px]"
      : size === "md"
        ? "size-9 text-[11px]"
        : "size-6 text-[10px]";

  if (profile.photo) {
    return (
      <img
        src={profile.photo}
        alt=""
        className={`${box} shrink-0 rounded-md object-cover`}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md ${box} ${
        initials
          ? "bg-ink font-medium text-white"
          : size === "lg"
            ? "bg-surface-faint text-ink ring-1 ring-hairline"
            : "bg-transparent text-ink"
      }`}
    >
      {initials || <UserIcon />}
    </span>
  );
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2.8 11.4c.8-1.8 2.3-2.7 4.2-2.7s3.4.9 4.2 2.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
