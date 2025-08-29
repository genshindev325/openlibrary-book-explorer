# Architecture Overview

## High-level

```
Next.js (App Router, TS)
├─ app/
│  ├─ page.tsx                # Search page (SSR fetching /api/search)
│  ├─ item/[...slug]/page.tsx # Details page
│  ├─ favorites/page.tsx      # Favorites list with optimistic edits/deletes
│  ├─ types                   # Define global type interfaces
│  ├─ api/search/route.ts     # Proxy to OpenLibrary with caching + retry
│  ├─ api/favorites/route.ts  # CRUD (GET list, POST create)
│  └─ api/favorites/[id]/...  # GET one, PATCH, DELETE
├─ app/lib/
│  ├─ fetchWithRetry.ts       # Exponential backoff helper
│  ├─ openlibrary.ts          # OpenLibrary adapters
│  └─ prisma.ts               # Prisma client singleton
└─ prisma/
   ├─ schema.prisma           # Favorite model
   └─ seed.ts                 # Seed data
```

## Data model

```
model Favorite {
  id        String   @id @default(cuid())
  itemKey   String   @unique   // e.g., /works/OL45883W
  title     String
  author    String?
  year      Int?
  coverUrl  String?
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Flows

### Search
- `app/api/search` calls OpenLibrary `search.json` with `q` and `limit`.
- Results are mapped to a small `OLSummary` and filtered/sorted server-side.
- Caching: `next: { revalidate: 3600 }` (1h) helps reduce API calls.
- Resilience: `fetchWithRetry` retries 5xx/429 with exponential backoff.

### Details
- `app/item/[...slug]` fetches work details (`/works/{key}.json`) and shows a simple summary plus a "Save" UI.

### Favorites
- `POST /api/favorites` saves a favorite; unique on `itemKey` to avoid duplicates.
- `GET /api/favorites?page=X&pageSize=Y` paginates results.
- `PATCH /api/favorites/:id` updates notes/title/author/year (notes used in UI).
- `DELETE /api/favorites/:id` removes the favorite.
- Optimistic UI:
  - Notes are edited with `useOptimistic` and persisted on blur.
  - Delete removes the card locally before server confirmation.

### Error/empty states
- `/api/search` returns 400 for missing `q`, 502 for upstream failures.
- UI shows errors inline and "No results" when appropriate.
- Favorites page shows a friendly empty state.

## Security & Auth
- No auth by default (assignment scope). Add NextAuth or basic auth middleware if needed.
- API input validated with `zod`.
- Prisma queries use the generated client; no raw SQL.

## SSR/CSR
- Pages are server components by default.
- Interactive parts are client components.
- `/api` routes are server-only.

## Caching
- OpenLibrary requests use `revalidate` to enable ISR-style caching on the server layer.
- Favorite list uses `cache: 'no-store'` to avoid stale DB reads.

## Testing
- **Vitest** unit tests cover the retry helper logic.
- **Playwright** e2e covers a realistic flow: search -> save -> view favorites.

## Next steps (if more time)
- Add language filter support via OpenLibrary `fq` (Solr) param or move to a different API with built-in filters.
- Replace optimistic delete rollback with proper mutation + SWR/React Query invalidation.
- Add authentication (NextAuth) and per-user favorites.
- Add UI polish (dialog for notes on save, skeleton loaders, toasts).
- Add accessibility audits (axe) and more thorough tests.
- Add CI workflow (GitHub Actions) for lint/test/e2e.
- Add `PATCH /api/favorites/:id` validation for length, etc.
