# Cook Out Nutrition Calculator

Purely built as a "for fun" project and not affiliated with the Cook Out brand/company.

This app is a basic, interactive nutrition calculator for Cook Out's menu: browse items, build a meal, and see running nutrition totals.

## Project structure

- `reference/` — source PDF (`2026sep15_cookout_nutrition.pdf`) as published by Cook Out.
- `data/` — that PDF parsed into machine-readable `cookout_nutrition.json` / `.csv`. This is the canonical dataset; see `meta.notes` in the JSON for known quirks in the source data.
- `app/` — the React + Vite + TypeScript web app.

## Tech stack

The app is a static, client-only single-page app — no backend or database.

- **React 19 + TypeScript**, scaffolded and bundled with **Vite**.
- **Plain CSS** (custom properties for the color/type tokens, no CSS framework).
- Nutrition data ships as a static JSON file (`data/cookout_nutrition.json`) fetched by the
  browser at runtime; a small Node script (`app/scripts/sync-data.mjs`) copies it into
  `app/public/` before dev/build so the repo-root file stays the single source of truth.
- All meal-total math lives in a framework-free domain layer (`app/src/domain/`) so it's
  independently testable and easy to reuse if a backend is ever added.
- **Vitest** + **React Testing Library** for tests, **oxlint** for linting, `tsc` for
  type-checking.
- Deploys as a static site to **Vercel** (see [Deployment](#deployment) below).

## Running and developing locally

The app lives in `app/`, so all commands below run from there:

```bash
cd app
npm install
npm run dev
```

This starts a Vite dev server (default `http://localhost:5173`) with hot
reload. It also copies the latest `data/cookout_nutrition.json` into
`app/public/data/` automatically before starting, so edits to the root
dataset show up on the next dev server restart.

Other useful commands, all run from `app/`:

```bash
npm test         # run the test suite (Vitest)
npm run typecheck
npm run lint
npm run build    # production build to app/dist
npm run preview  # serve the production build locally
```

## Deployment

The app is a static site (no backend) and deploys to Vercel with no extra
configuration beyond one thing: since the app lives in `app/` rather than the
repo root, set the Vercel project's **Root Directory** to `app`. Vercel
auto-detects the Vite framework and runs `npm run build` from there.
