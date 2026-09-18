"use client";

import { useState, useSyncExternalStore } from "react";
import { ProfileEditor } from "@/components/landing/profile-editor";
import {
  EMPTY_PROFILE,
  profileIsSet,
  readProfile,
  subscribeProfile,
} from "@/lib/profile";

export function ProfilePage() {
  const profile = useSyncExternalStore(
    subscribeProfile,
    readProfile,
    () => EMPTY_PROFILE,
  );
  const [saved, setSaved] = useState(false);
  const filled = profileIsSet(profile);

  return (
    <section className="flex-1 bg-canvas">
      <div className="mx-auto w-full max-w-[1080px] px-5 py-16 md:px-8 md:py-20">
        <p className="text-[12px] font-semibold tracking-[0.72px] text-muted uppercase">
          Profil
        </p>
        <h1 className="font-display mt-2 text-[32px] leading-[1.15] font-semibold tracking-[-0.32px] text-ink md:text-[40px]">
          {filled ? "Dein Profil." : "Profil anlegen."}
        </h1>
        <p className="mt-3 max-w-[54ch] text-[16px] leading-7 text-body">
          Orte, Modell, Rolle und Ansprüche fließen in den Fit. Foto und
          Lebenslauf bleiben auf diesem Gerät.
        </p>
        <div className="mt-10 max-w-[720px] rounded-lg bg-canvas p-5 ring-1 ring-hairline-soft md:p-8">
          <ProfileEditor
            profile={profile}
            description="Je genauer die Angaben, desto schärfer die Treffer. Du kannst mehrere Orte und Modelle wählen."
            submitLabel="Profil speichern"
            onSaved={() => setSaved(true)}
          />
          {saved ? (
            <p className="mt-3 text-[14px] font-medium text-ink">
              Gespeichert. Die nächste Suche nutzt das Profil.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
