# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `frontend/` directory:

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # tsc -b && vite build
npm run lint      # ESLint on TypeScript/TSX files
npm run preview   # Preview production build
```

There is no test suite configured.

## Architecture

**ValenciaInfinity** is a Valencia CF fan engagement platform. The stack is React 19 + TypeScript + Vite + Tailwind CSS 4 + Supabase (BaaS). No traditional backend — all server-side logic goes through Supabase.

### Frontend entry flow

```
index.html → main.tsx → App.tsx (AuthProvider) → AppRoutes.tsx
```

`AppRoutes.tsx` (`src/router/`) defines all routes:
- Public: `/login`, `/signup`, `/forgot-password`, `/auth/callback`
- Layout routes (MainLayout): home, team, matches, news, Nou Mestalla
- Protected (auth required): fanzone, profile, game
- Admin (`adminOnly` prop): `/admin/news`, `/admin/cards`

`ProtectedRoute` redirects unauthenticated users to `/login` with location state for post-login redirect. Admin routes additionally check the user's `role` field.

### Authentication

- Provider: `src/providers/AuthProvider.tsx` — restores Supabase session on mount, subscribes to auth state changes, writes to Jotai atoms
- Service: `src/services/authService.ts` — email/password, Google OAuth, password reset
- Hook: `useAuth()` returns `{ user, loading, isAuthenticated, signOut }`
- User profiles are stored in Supabase `profiles` table; `user_metadata` is the fallback

### State management

Jotai atoms in `src/stores/authStore.ts`:
- `authAtom`: `{ user, loading, error }`
- Derived read atoms: `userAtom`, `loadingAtom`, `errorAtom`
- Write atoms: `setUserAtom`, `setLoadingAtom`, `setErrorAtom`, `finishLoadingAtom`

### Data layer

Services in `src/services/` talk to Supabase or external APIs. Custom hooks in `src/hooks/` wrap services with React state:
- `useNoticias()` — fetches and parses RSS feeds from Marca and AS.com (CORS-proxied via Vite dev server)
- `usePartidosVCF()` — fetches match data from football-data.org (also proxied)

Vite proxies configured in `vite.config.ts`:
- `/api-football` → `https://api.football-data.org`
- `/rss-marca` → Marca RSS endpoint
- `/rss-as` → AS.com RSS endpoint

### Layouts and pages

- `src/layouts/MainsLayout.tsx` — shared header/nav/footer for public and fan pages
- `src/layouts/AdminLayout.tsx` — admin-specific header and sidebar
- Pages live in `src/pages/`; feature-heavy components live in `src/components/features/`

### 3D / graphics

Three.js is integrated via `@react-three/fiber` and `@react-three/drei`. `VirtualWorld.tsx` and `UnityGame.tsx` handle immersive experiences. `src/utils/createCardTexture.ts` generates Three.js textures for collectible cards.

### Styling

Tailwind CSS 4 (via `@tailwindcss/vite`). Valencia CF brand colors are defined as CSS custom properties in `src/index.css`. Dark mode uses the `.dark` class on `<html>`. Path alias `@/*` maps to `src/*`.

## Key file locations

| Concern | Path |
|---|---|
| Route definitions | `src/router/AppRoutes.tsx` |
| Auth guard | `src/router/ProtectedRoute.tsx` |
| Supabase client | `src/services/supabaseClient.ts` |
| Auth atoms | `src/stores/authStore.ts` |
| Global styles + CSS vars | `src/index.css` |
| Vite config (proxies, aliases) | `frontend/vite.config.ts` |
| Admin pages | `src/pages/AdminViews/` |
| Collectible cards feature | `src/components/features/CardAlbum.tsx`, `CardExchange.tsx` |
| Match UI components | `src/components/features/matches/` |

## Environment variables

Required in `frontend/.env` (VITE_ prefix exposes them to the browser):

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_FOOTBALL_API_KEY
VITE_GNEWS_API_KEY
```

Only `VITE_SUPABASE_ANON_KEY` should be public. The football and GNews API keys are currently client-side but should move behind a server function if rate limits or billing become a concern.

## Supabase schema (logical)

Tables: `profiles`, `news`, `cards`, `rankings`, `matches`. The `/supabase/` directory exists but contains no committed migration files — schema changes are applied directly via the Supabase dashboard.
