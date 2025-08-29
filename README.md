# Search + Save Explorer

A small app where users can search OpenLibrary, view results, and save favorites with notes.

## Tech

- **Next.js 14** (App Router, TypeScript)
- **API routes** for server endpoints
- **Postgres + Prisma** for persistence
- **OpenLibrary** as the public API

## Core user stories

- ✅ Search with filter/sort
- ✅ View details of a result
- ✅ Save favorites with notes
- ✅ Paginated list of favorites with edit/delete
- ✅ Handle API errors and empty states

## Nice-to-haves implemented

- ✅ **Caching** via Next.js `revalidate` on external API fetches
- ✅ **Optimistic UI** for notes edit & delete on favorites
- ✅ **Retry/backoff** when calling OpenLibrary

(SSR is used by default in the App Router; basic a11y labels included.)

## Run with Docker (recommended quick start)

```bash
make dev
# First run will build images and start Postgres + app at :3000
# In another terminal, run:
make migrate
make seed
```

## Run locally (no Docker)

1. Install dependencies

```bash
npm i
```

2. Set up database

```bash
cp .env.example .env
# Ensure Postgres is running and DATABASE_URL is correct in .env
npx prisma generate
npm run prisma:migrate
npm run seed
```

3. Start the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Tests

- Unit tests (Vitest): `npm test`
- E2E tests (with server): `npm run e2e:with-server`

## Notes on API & Limits

This uses OpenLibrary's public Search API. Filter by year is applied client-side after fetching a page of results. Sorting by year is client-side. External fetches include a small revalidate window for caching and a retry with exponential backoff for resilience.

## AI tooling

Some scaffolding and boilerplate were AI-assisted. Manual fixes included:
- Adjusting TypeScript types for API handlers.
- Tuning optimistic UI behavior to avoid hydration mismatches.
- Ensuring Prisma client is singleton-safe in dev.

See `ARCHITECTURE.md` for details.
