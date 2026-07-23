# BerryBusy

A Trello-style kanban app for small teams — boards → lists → cards, with labels,
assignees, comments, attachments, and activity logs.

Built with Next.js 16 (App Router), React 19, Prisma 7, Postgres (Neon), Better
Auth, and Tailwind CSS v4 + shadcn/ui.

> Status: in progress. The landing page, email/password auth, and the core
> board app are working — boards, lists, and cards with drag-and-drop and a
> card detail view (description, due dates, labels, assignees, comments).
> Members/roles management and the activity log are still to come.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) (this repo uses pnpm; don't use npm/yarn)
- A Postgres database — a [Neon](https://neon.tech) pooled connection string works well

## Getting started

```bash
pnpm install

# configure environment
cp .env.example .env
# then fill in DATABASE_URL and BETTER_AUTH_SECRET in .env
# (generate a secret: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")

# set up the database
pnpm prisma migrate deploy   # apply migrations
pnpm prisma generate         # generate the Prisma client

pnpm dev                     # http://localhost:3000
```

## Scripts

```bash
pnpm dev             # start the dev server
pnpm build           # production build (runs prisma generate + tsc)
pnpm start           # run the production build
pnpm lint            # eslint
pnpm exec tsc --noEmit   # typecheck
pnpm prisma studio   # inspect the database
```

## Environment variables

See `.env.example`. Required:

- `DATABASE_URL` — Postgres/Neon connection string (use `sslmode=verify-full`)
- `BETTER_AUTH_SECRET` — random secret for Better Auth (required in production)
- `BETTER_AUTH_URL` — the app's base URL (e.g. `http://localhost:3000`)

## Notes

- The Prisma client is generated to `src/generated/prisma` (gitignored) — run
  `pnpm prisma generate` after cloning or changing the schema.
