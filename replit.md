# BisKora Cookies

Premium Indian artisan cookie & dry cake brand website. Tagline: "YOUR TASTY BITES."

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/biskora run dev` — run the frontend (port 25203)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — JWT signing secret

## Admin Credentials

- **Email:** admin@biskora.com
- **Password:** BiskoraAdmin@2024
- **Login URL:** /admin/login

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4 + Framer Motion
- API: Express 5 + JWT auth
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)

## Where things live

- `artifacts/biskora/` — React + Vite frontend
  - `src/pages/` — Home, Products, About, Services, Contact, Admin login/dashboard
  - `src/components/layout/` — Navbar, Footer, PageLayout
  - `src/components/ui/logo.tsx` — BisKora SVG logo (brown + purple)
  - `src/lib/utils.ts` — admin token helpers, formatPrice
- `artifacts/api-server/src/routes/` — products.ts, orders.ts, admin.ts
- `lib/db/src/schema/index.ts` — products, ingredients, orders tables
- `lib/api-spec/openapi.yaml` — OpenAPI source of truth

## Architecture decisions

- Admin auth uses JWT (signed with SESSION_SECRET). Token stored in localStorage as `biskora_admin_token`.
- Products have a jsonb `highlights` column for tags.
- Ingredients belong to products (FK with cascade delete); toggling `isInStock` on an ingredient marks it out of stock on the admin dashboard.
- Home page renders Hero section + products grid on the same page (scroll-to-products).

## Product

- 10 cookie products pre-seeded (Traditional, Healthy, Classic, Spiced, Gourmet, Tropical, Premium)
- Each product has 4-5 ingredients that admins can mark in/out of stock
- Contact form submissions create Orders in the DB
- Admin dashboard: stats panel, orders management, products management, ingredients stock toggle

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any schema change: `pnpm --filter @workspace/api-spec run codegen` then fix lib/api-zod/src/index.ts to only export from `./generated/api` (the Orval-generated index has a duplicate exports bug)
- Google Fonts @import must be the FIRST line in index.css (before @import 'tailwindcss')

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
