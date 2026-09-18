export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <rect width="32" height="32" rx="8" fill="#000" />
        <path
          d="M9 12.5c0-1.38 1.12-2.5 2.5-2.5h9c1.38 0 2.5 1.12 2.5 2.5v6c0 1.38-1.12 2.5-2.5 2.5h-3.2L14 23.2v-2.2H11.5C10.12 21 9 19.88 9 18.5v-6Z"
          fill="#fff"
        />
        <circle cx="13.2" cy="15.5" r="1" fill="#000" />
        <circle cx="16" cy="15.5" r="1" fill="#000" />
        <circle cx="18.8" cy="15.5" r="1" fill="#000" />
      </svg>
      <span className="font-display text-[17px] font-semibold tracking-[-0.32px]">
        Aria
      </span>
    </span>
  );
}
