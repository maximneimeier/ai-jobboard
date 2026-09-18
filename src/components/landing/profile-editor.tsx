"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ProfileAvatar } from "@/components/landing/profile-avatar";
import type { Culture, JobFunction, Seniority, WorkMode } from "@/lib/jobs";
import {
  compressPhoto,
  CV_ACCEPT,
  deleteProfileBlob,
  formatFileSize,
  isAllowedCv,
  isAllowedPhoto,
  MAX_PROFILE_FILE_BYTES,
  PHOTO_ACCEPT,
  readProfileBlob,
  writeProfileBlob,
} from "@/lib/profile-files";
import { CITY_OPTIONS, criteriaChips, normalizeCity } from "@/lib/search";
import {
  EMPTY_PREFS,
  profileCriteria,
  writeProfile,
  type ProfilePrefs,
  type UserProfile,
} from "@/lib/profile";

const FUNCTION_OPTIONS: { id: JobFunction; label: string }[] = [
  { id: "design", label: "Design" },
  { id: "engineering", label: "Engineering" },
  { id: "product", label: "Product" },
  { id: "data", label: "Data" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
];

const LEVEL_OPTIONS: { id: Seniority; label: string }[] = [
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Professional" },
  { id: "senior", label: "Senior" },
  { id: "lead", label: "Lead" },
  { id: "staff", label: "Staff" },
];

const MODE_OPTIONS: { id: WorkMode; label: string }[] = [
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
  { id: "onsite", label: "Vor Ort" },
];

const CULTURE_OPTIONS: { id: Culture; label: string }[] = [
  { id: "startup", label: "Startup" },
  { id: "scaleup", label: "Scale-up" },
  { id: "corporate", label: "Konzern" },
];

const STACK_OPTIONS = [
  "figma",
  "research",
  "systems",
  "react",
  "typescript",
  "nextjs",
  "go",
  "python",
  "java",
  "kotlin",
  "swift",
  "sql",
  "node",
  "ios",
];

function toggleValue<T extends string>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function ProfileEditor({
  profile,
  onSaved,
  description = "Kurz, wer du bist. Rolle, Ort, Stack und Gehalt fließen in den Fit.",
  submitLabel = "Profil speichern",
}: {
  profile: UserProfile;
  onSaved?: () => void;
  description?: string;
  submitLabel?: string;
}) {
  const [draft, setDraft] = useState<UserProfile>(withPrefs(profile));
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvRemoved, setCvRemoved] = useState(false);
  const [fileError, setFileError] = useState("");
  const [saving, setSaving] = useState(false);
  const [cityDraft, setCityDraft] = useState("");
  const [stackDraft, setStackDraft] = useState("");
  const nameId = useId();
  const emailId = useId();
  const bioId = useId();
  const photoId = useId();
  const cvId = useId();
  const salaryId = useId();
  const cityId = useId();
  const stackId = useId();
  const photoRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const prefs = draft.prefs ?? EMPTY_PREFS;
  const chips = useMemo(
    () => criteriaChips(profileCriteria(draft)),
    [draft],
  );
  const cv = cvFile
    ? { name: cvFile.name, type: cvFile.type, size: cvFile.size }
    : cvRemoved
      ? null
      : draft.cv;
  const cityChoices = [...new Set([...CITY_OPTIONS, ...prefs.cities])];

  useEffect(() => {
    setDraft(withPrefs(profile));
    setCvFile(null);
    setCvRemoved(false);
    setFileError("");
  }, [profile]);

  function setPrefs(patch: Partial<ProfilePrefs>) {
    setDraft((current) => ({
      ...current,
      prefs: { ...(current.prefs ?? EMPTY_PREFS), ...patch },
    }));
  }

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!isAllowedPhoto(file)) {
      setFileError("Für das Foto bitte JPG, PNG, WEBP oder GIF.");
      return;
    }
    if (file.size > MAX_PROFILE_FILE_BYTES) {
      setFileError("Das Foto ist zu groß. Höchstens 8 MB.");
      return;
    }
    try {
      const photo = await compressPhoto(file);
      setFileError("");
      setDraft((current) => ({ ...current, photo }));
    } catch {
      setFileError("Das Foto konnte nicht gelesen werden.");
    }
  }

  function handleCv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!isAllowedCv(file)) {
      setFileError("Für den Lebenslauf bitte PDF, Word, Text, RTF oder ODT.");
      return;
    }
    if (file.size > MAX_PROFILE_FILE_BYTES) {
      setFileError("Der Lebenslauf ist zu groß. Höchstens 8 MB.");
      return;
    }
    setFileError("");
    setCvFile(file);
    setCvRemoved(false);
    setDraft((current) => ({
      ...current,
      cv: { name: file.name, type: file.type, size: file.size },
    }));
  }

  function removePhoto() {
    setDraft((current) => ({ ...current, photo: "" }));
    setFileError("");
  }

  function removeCv() {
    setCvFile(null);
    setCvRemoved(true);
    setDraft((current) => ({ ...current, cv: null }));
    setFileError("");
  }

  async function openCv() {
    const blob = cvFile ?? (await readProfileBlob("cv"));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  function addCity() {
    const city = normalizeCity(cityDraft);
    if (!city) return;
    if (!prefs.cities.includes(city)) {
      setPrefs({ cities: [...prefs.cities, city] });
    }
    setCityDraft("");
  }

  function addStack() {
    const item = stackDraft.trim().toLowerCase();
    if (!item) return;
    if (!prefs.stack.includes(item)) {
      setPrefs({ stack: [...prefs.stack, item] });
    }
    setStackDraft("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      writeProfile(draft);
      if (cvFile) await writeProfileBlob("cv", cvFile);
      if (cvRemoved) await deleteProfileBlob("cv");
      setCvFile(null);
      setCvRemoved(false);
      onSaved?.();
    } catch {
      setFileError("Speichern hat nicht geklappt. Bitte nochmal versuchen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <p className="text-[13px] leading-5 text-body">{description}</p>

      <section className="space-y-3">
        <SectionTitle>Dateien</SectionTitle>
        <div>
          <p className="text-[12px] font-medium text-ink">Foto</p>
          <div className="mt-1.5 flex items-center gap-3">
            <ProfileAvatar profile={draft} size="lg" />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <input
                  ref={photoRef}
                  id={photoId}
                  type="file"
                  accept={PHOTO_ACCEPT}
                  className="sr-only"
                  onChange={handlePhoto}
                />
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="inline-flex h-9 items-center rounded-md px-3 text-[13px] font-medium tracking-[-0.16px] text-ink ring-1 ring-hairline"
                >
                  Foto wählen
                </button>
                {draft.photo ? (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="inline-flex h-9 items-center rounded-md px-3 text-[13px] font-medium tracking-[-0.16px] text-ink"
                  >
                    Entfernen
                  </button>
                ) : null}
              </div>
              <p className="mt-1.5 text-[12px] text-muted">
                JPG, PNG, WEBP oder GIF.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor={cvId} className="text-[12px] font-medium text-ink">
            Lebenslauf
          </label>
          <input
            ref={cvRef}
            id={cvId}
            type="file"
            accept={CV_ACCEPT}
            className="sr-only"
            onChange={handleCv}
          />
          {cv ? (
            <div className="mt-1.5 flex items-center justify-between gap-3 rounded-md px-3 py-2.5 ring-1 ring-hairline">
              <div className="min-w-0">
                <p className="truncate text-[14px] tracking-[-0.16px] text-ink">
                  {cv.name}
                </p>
                <p className="mt-0.5 text-[12px] text-muted">
                  {formatFileSize(cv.size)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={openCv}
                  className="text-[13px] font-medium tracking-[-0.16px] text-ink"
                >
                  Öffnen
                </button>
                <button
                  type="button"
                  onClick={removeCv}
                  className="text-[13px] font-medium tracking-[-0.16px] text-ink"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => cvRef.current?.click()}
              className="mt-1.5 flex h-[88px] w-full flex-col items-center justify-center rounded-md text-center ring-1 ring-hairline"
            >
              <span className="text-[14px] font-medium tracking-[-0.16px] text-ink">
                Datei wählen
              </span>
              <span className="mt-1 text-[12px] text-muted">
                PDF, Word, Text, RTF oder ODT, höchstens 8 MB.
              </span>
            </button>
          )}
        </div>
        {fileError ? (
          <p className="text-[12px] font-medium text-ink">{fileError}</p>
        ) : null}
      </section>

      <section className="space-y-3">
        <SectionTitle>Person</SectionTitle>
        <Field label="Name" htmlFor={nameId}>
          <input
            id={nameId}
            value={draft.name}
            onChange={(event) =>
              setDraft((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Optional"
            className={fieldClass}
          />
        </Field>
        <Field label="E-Mail" htmlFor={emailId}>
          <input
            id={emailId}
            type="email"
            value={draft.email}
            onChange={(event) =>
              setDraft((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="für gespeicherte Chats"
            className={fieldClass}
          />
        </Field>
        <Field label="Über dich" htmlFor={bioId}>
          <textarea
            id={bioId}
            value={draft.bio}
            onChange={(event) =>
              setDraft((current) => ({ ...current, bio: event.target.value }))
            }
            rows={4}
            placeholder="Senior Product Designer, Figma, hybrid, ab 80k"
            className={`${fieldClass} min-h-[120px] resize-none py-2.5`}
          />
        </Field>
      </section>

      <section className="space-y-3">
        <SectionTitle>Orte</SectionTitle>
        <p className="text-[13px] leading-5 text-body">
          Alle Standorte, an denen du arbeiten willst. Remote zählt als eigener
          Ort.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {cityChoices.map((city) => (
            <Chip
              key={city}
              active={prefs.cities.includes(city)}
              onClick={() => setPrefs({ cities: toggleValue(prefs.cities, city) })}
            >
              {city}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            id={cityId}
            value={cityDraft}
            onChange={(event) => setCityDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCity();
              }
            }}
            placeholder="Weiteren Ort ergänzen"
            className={fieldClass}
          />
          <button
            type="button"
            onClick={addCity}
            className="inline-flex h-10 shrink-0 items-center rounded-md px-3 text-[13px] font-medium text-ink ring-1 ring-hairline"
          >
            Hinzufügen
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Modell und Rahmen</SectionTitle>
        <OptionRow
          label="Arbeitsmodell"
          options={MODE_OPTIONS}
          values={prefs.workModes}
          onToggle={(id) =>
            setPrefs({ workModes: toggleValue(prefs.workModes, id) })
          }
        />
        <OptionRow
          label="Unternehmenskultur"
          options={CULTURE_OPTIONS}
          values={prefs.cultures}
          onToggle={(id) =>
            setPrefs({ cultures: toggleValue(prefs.cultures, id) })
          }
        />
        <Field label="Gehalt ab, in Tausend" htmlFor={salaryId}>
          <input
            id={salaryId}
            type="number"
            min={0}
            step={5}
            value={prefs.salaryMin || ""}
            onChange={(event) =>
              setPrefs({ salaryMin: Number(event.target.value) || 0 })
            }
            placeholder="80"
            className={fieldClass}
          />
        </Field>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            active={prefs.noOnCall}
            onClick={() => setPrefs({ noOnCall: !prefs.noOnCall })}
          >
            Keine Bereitschaft
          </Chip>
          <Chip
            active={prefs.fourDayWeek}
            onClick={() => setPrefs({ fourDayWeek: !prefs.fourDayWeek })}
          >
            4-Tage-Woche
          </Chip>
          <Chip
            active={prefs.dach}
            onClick={() => setPrefs({ dach: !prefs.dach })}
          >
            DACH
          </Chip>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle>Rolle</SectionTitle>
        <OptionRow
          label="Funktion"
          options={FUNCTION_OPTIONS}
          values={prefs.functions}
          onToggle={(id) =>
            setPrefs({ functions: toggleValue(prefs.functions, id) })
          }
        />
        <OptionRow
          label="Level"
          options={LEVEL_OPTIONS}
          values={prefs.seniority}
          onToggle={(id) =>
            setPrefs({ seniority: toggleValue(prefs.seniority, id) })
          }
        />
      </section>

      <section className="space-y-3">
        <SectionTitle>Stack</SectionTitle>
        <p className="text-[13px] leading-5 text-body">
          Tools und Sprachen, die in den Fit einfließen sollen.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[...new Set([...STACK_OPTIONS, ...prefs.stack])].map((item) => (
            <Chip
              key={item}
              active={prefs.stack.includes(item)}
              onClick={() => setPrefs({ stack: toggleValue(prefs.stack, item) })}
            >
              {item}
            </Chip>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            id={stackId}
            value={stackDraft}
            onChange={(event) => setStackDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addStack();
              }
            }}
            placeholder="Weiteres Tool"
            className={fieldClass}
          />
          <button
            type="button"
            onClick={addStack}
            className="inline-flex h-10 shrink-0 items-center rounded-md px-3 text-[13px] font-medium text-ink ring-1 ring-hairline"
          >
            Hinzufügen
          </button>
        </div>
      </section>

      {chips.length ? (
        <div>
          <p className="text-[12px] font-medium text-ink">So liest Aria das Profil</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-md bg-surface-soft px-2 py-0.5 text-[12px] font-medium text-ink-soft"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-[12px] text-muted">
          Sobald Orte, Rolle oder Stack stehen, fließt das in den Fit.
        </p>
      )}

      <div className="sticky bottom-0 bg-canvas pt-1">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-ink text-[14px] font-medium tracking-[-0.16px] text-white disabled:opacity-60"
        >
          {saving ? "Speichert…" : submitLabel}
        </button>
        <p className="mt-2 text-[12px] text-muted">Bleibt auf diesem Gerät.</p>
      </div>
    </form>
  );
}

const fieldClass =
  "mt-1.5 h-10 w-full rounded-md px-3 text-[14px] tracking-[-0.16px] text-ink ring-1 ring-hairline outline-none placeholder:text-muted-soft focus:ring-ink";

function withPrefs(profile: UserProfile): UserProfile {
  return {
    ...profile,
    prefs: profile.prefs ?? EMPTY_PREFS,
  };
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
      {children}
    </h2>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-[12px] font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

function OptionRow<T extends string>({
  label,
  options,
  values,
  onToggle,
}: {
  label: string;
  options: { id: T; label: string }[];
  values: T[];
  onToggle: (id: T) => void;
}) {
  return (
    <div>
      <p className="text-[12px] font-medium text-ink">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <Chip
            key={option.id}
            active={values.includes(option.id)}
            onClick={() => onToggle(option.id)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-md bg-ink px-2.5 py-1 text-[13px] font-medium text-white"
          : "rounded-md px-2.5 py-1 text-[13px] font-medium text-ink ring-1 ring-hairline"
      }
    >
      {children}
    </button>
  );
}
