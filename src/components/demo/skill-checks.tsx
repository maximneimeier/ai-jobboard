import { Check, X } from "lucide-react";
import type { MatchCheck } from "@/lib/demo/match";

export function SkillChecks({ checks }: { checks: MatchCheck[] }) {
  if (!checks.length) return null;
  const skills = checks.filter((item) => item.kind === "skill");
  const languages = checks.filter((item) => item.kind === "language");

  return (
    <div className="mt-4 grid gap-3">
      {skills.length ? (
        <CheckGroup title="Skills vs your profile" checks={skills} />
      ) : null}
      {languages.length ? (
        <CheckGroup title="Languages vs your profile" checks={languages} />
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
          <li
            key={`${item.kind}-${item.label}`}
            className={
              item.have
                ? "inline-flex items-center gap-1 rounded-md bg-success-soft px-2 py-1 text-[12px] font-medium text-success-text"
                : "inline-flex items-center gap-1 rounded-md bg-danger-soft px-2 py-1 text-[12px] font-medium text-danger-text"
            }
          >
            {item.have ? <Check size={12} strokeWidth={2.5} /> : <X size={12} strokeWidth={2.5} />}
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
