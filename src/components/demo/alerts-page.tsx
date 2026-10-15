import { DemoBanner } from "./demo-banner";

export function AlertsPage() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-5 py-10 md:px-8">
      <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
        Job alerts
      </p>
      <h1 className="font-display mt-2 text-[28px] font-semibold text-ink">
        Get new matches as they appear.
      </h1>
      <div className="mt-4">
        <DemoBanner>
          We will email you when new roles match your saved search.
        </DemoBanner>
      </div>
      <p className="mt-6 text-[15px] leading-7 text-body">
        Save a search with your filters and profile. Alerts use exactly those
        preferences.
      </p>
    </div>
  );
}
