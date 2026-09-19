const paths = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  upRight: "M6 18 18 6M6 6h12v12",
  check: "m5 12 4 4L19 6",
  chat: "M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-3 3V11.5A7.5 7.5 0 0 1 9.5 4h3a7.5 7.5 0 0 1 7.5 7.5ZM7 10h8m-8 4h5",
  globe:
    "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z",
  document: "M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6",
  mail: "M3 5h18v14H3V5Zm0 1 9 7 9-7",
  sliders: "M4 7h5m5 0h6M4 17h10m5 0h1M9 4v6m5 4v6",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M18 6 6 18",
  menu: "M4 6h16M4 12h16M4 18h16",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
  lock: "M6 10h12v11H6V10Zm3 0V6a3 3 0 0 1 6 0v4",
  pause: "M9 5v14M15 5v14",
  play: "m8 5 11 7-11 7V5Z",
  refresh:
    "M20 7v5h-5M4 17v-5h5M5.7 6a8 8 0 0 1 13 1L20 12M4 12l1.3 5a8 8 0 0 0 13 1",
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
};

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: keyof typeof paths;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 4h8v8H5zM15 4h8v8h-8zM5 14h8v8H5zM15 14h8v8h-8z"
        fill="currentColor"
      />
      <path d="m15 22 4 4v-4" fill="currentColor" />
    </svg>
  );
}

export function Brand() {
  return (
    <span className="marketing-brand">
      <BrandMark />
      <span>[Name]</span>
    </span>
  );
}
