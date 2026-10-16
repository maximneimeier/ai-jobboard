import { Check } from "lucide-react";
import type { MatchCheck } from "@/lib/demo/match";

export function SkillChecks({
  checks,
  compact = false,
  limit,
}: {
  checks: MatchCheck[];
  compact?: boolean;
  limit?: number;
}) {
  if (!checks.length) return null;
  const skills = checks.filter((item) => item.kind === "skill");
  const languages = checks.filter((item) => item.kind === "language");
  const shownSkills = limit ? skills.slice(0, limit) : skills;

  if (compact) {
    const preview = [...shownSkills, ...languages].slice(0, limit ?? 5);
    if (!preview.length) return null;
    return (
      <ul className="flex flex-wrap gap-1">
        {preview.map((item) => (
          <li key={`${item.kind}-${item.label}`}>
            <SkillChip check={item} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="grid gap-3">
      {shownSkills.length ? (
        <CheckGroup title="Skills" checks={shownSkills} />
      ) : null}
      {languages.length ? (
        <CheckGroup title="Languages" checks={languages} />
      ) : null}
    </div>
  );
}

function CheckGroup({ title, checks }: { title: string; checks: MatchCheck[] }) {
  return (
    <div>
      <p className="text-[12px] font-medium text-ink">{title}</p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {checks.map((item) => (
          <li key={`${item.kind}-${item.label}`}>
            <SkillChip check={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillChip({ check }: { check: MatchCheck }) {
  const confirmed = check.status === "confirmed";
  return (
    <span
      className={
        confirmed
          ? "inline-flex items-center gap-1 rounded-md bg-success-soft px-2 py-0.5 text-[12px] font-medium text-success-text"
          : "inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-0.5 text-[12px] font-medium text-muted ring-1 ring-hairline"
      }
      title={confirmed ? "On your profile" : "Not yet on your profile"}
    >
      {confirmed ? <Check size={12} strokeWidth={2.5} aria-hidden /> : null}
      <span className="sr-only">{confirmed ? "Confirmed: " : "Needs verification: "}</span>
      {check.label}
    </span>
  );
}
