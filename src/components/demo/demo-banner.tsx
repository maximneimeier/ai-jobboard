export function DemoBanner({ children }: { children: string }) {
  return (
    <p className="rounded-md bg-accent-soft px-3 py-2 text-[13px] leading-5 text-ink">
      {children}
    </p>
  );
}
