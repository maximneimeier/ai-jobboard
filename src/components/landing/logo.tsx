export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex size-7 items-center justify-center rounded-md bg-ink text-white">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M2.2 3.4c0-.8.6-1.4 1.4-1.4h7c.8 0 1.4.6 1.4 1.4v5.2c0 .8-.6 1.4-1.4 1.4H6.2L3.4 12V10h-.8c-.8 0-1.4-.6-1.4-1.4V3.4z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-ink">
        Aria
      </span>
    </span>
  );
}
