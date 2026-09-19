# [Name] — Chat native AI job search

Next.js 16 / React 19 project. The English homepage implements `LANDING-PLAN.md`: conversational search, tailored applications, email monitoring, FAQ, and an early-access section.

## Development

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). The previous German search workspace is available at [/search](http://localhost:3000/search); profiles and saved applications remain at `/profil` and `/gemerkt`.

## Landing preview

- Product demos use fictional companies, jobs, and profile details. No searches, document generation, or emails are sent from the landing page.
- Click the follow-up in the hero to update the sample roles and criteria; click again to reset. Application document buttons and email frequency/pause controls are also interactive previews.
- ChatGPT and Claude integrations are labeled **Planned**.
- **Early-access registration is intentionally disabled.** Both email input and submit button are disabled; there is no signup API, storage, or success state. Page CTAs scroll to this section.
- A future analytics integration can listen for the browser event `landing:interaction`. Its `detail` contains only `event` (`cta_click`, `see_how_it_works`, or `demo_refine`) and `placement`. These hooks do not store or transmit events. Registration-start/completion events should be added when signup is enabled.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The existing Google Fonts setup needs network access during a clean production build. In environments where Turbopack cannot bind its worker port, use `npm run build -- --webpack`.

The baseline contains lint errors in legacy `application-editor.tsx`, `employer-directory.tsx`, `home-search.tsx`, and `profile-editor.tsx`. The new marketing components can be checked separately:

```bash
npx eslint src/app/page.tsx src/app/layout.tsx src/app/search/page.tsx src/components/marketing src/components/landing/waitlist-form.tsx
```
