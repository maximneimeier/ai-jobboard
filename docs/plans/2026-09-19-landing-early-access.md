# Early-access landing implementation plan

**Goal:** Rebuild the public homepage from `LANDING-PLAN.md` on `codex/landing-early-access`.

**Design:** Use the user-provided landing plan as the approved design: English copy, `[Name]` placeholder, quiet off-white surfaces, a single forest-green accent, large typography, and product UI examples. Make every preview explicitly illustrative and integrations planned. The user's follow-up requires the early-access submit button to remain disabled; do not implement registration or a backend.

**Architecture:** Keep the homepage server rendered, with small client components for navigation, search refinement, document tabs, and email settings. Scope styles to the marketing page so existing profile and saved-job tools remain intact. Reuse the current Next.js 16.3.5 / React 19 / Tailwind 4 installation and fonts; no new dependencies.

## Tasks

1. Create the feature branch and read installed Next.js server/client and route documentation. Done.
2. Replace `src/app/page.tsx` with the hero, three benefits, conversation, application, monitoring, FAQ, early-access, and footer sections. Add components under `src/components/marketing/` and styles in `src/app/marketing.css`.
3. Make search preview refinement update sample roles and saved criteria. Add document tabs and monitor controls, with no live product claims or network side effects.
4. Replace `src/components/landing/waitlist-form.tsx` with the disabled early-access form. Keep section CTA links usable for navigation. Update homepage metadata and document language.
5. Add anonymous, in-browser event hooks for CTA clicks and demo use; document their integration and the disabled registration state. No email collection, remote analytics, or invented conversion events.
6. Run lint, TypeScript, and the production build. Inspect desktop and mobile layouts, keyboard controls, FAQ expansion, anchor navigation, search changes, document tabs, monitor settings, and disabled signup in a browser. Reversible presentation changes will use these direct checks rather than implementation-mirroring unit tests.

## Acceptance

- All six priority sections and seven FAQ questions from the supplied plan are present.
- Both desktop and narrow-screen layouts show the full scenario without horizontal overflow.
- Hero refinement updates visible job examples and preferences and can be reset.
- Samples, fictional jobs, planned integrations, and development status are clearly labeled.
- Registration is visibly unavailable, and no success message or data transmission occurs.
- Existing non-home routes still build.

## Verification results

- Created branch `codex/landing-early-access`.
- Preserved the existing German search and employer directory at `/search`; updated legacy links and set `lang="de"` on German route content.
- Scoped ESLint, TypeScript, and `git diff --check` passed.
- Production build passed with `npm run build -- --webpack`, including all old routes and `/search`. Turbopack itself could not bind a worker port in the execution environment.
- Full-project ESLint still reports four errors and three warnings in unchanged legacy components; verified those files match HEAD.
- Browser checks passed at desktop, 768px, 390px, and 320px widths without horizontal overflow. Checked refinement/reset, both document views, frequency/pause/resume, FAQ, mobile menu/Escape, CTA anchors, disabled signup, and `/gemerkt` → `/search` navigation. No browser console errors were observed.
- Independent code review findings (legacy anchors, language attributes, and preview contrast) were fixed and rechecked.
