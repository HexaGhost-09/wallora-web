# Wallora Web

Next.js website for Wallora.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`.
3. Set `DATABASE_URL` to the **PostgreSQL connection string** for the Wallora website Neon project, using the `production` branch and the pooled connection option when deploying serverless workloads.
4. Set unique, long random values for `ADMIN_SECRET` and `JWT_SECRET`. Do not commit `.env.local`.
5. Start the app:

   ```bash
   npm run dev
   ```

## Database

The app uses Neon PostgreSQL through `@neondatabase/serverless` and Drizzle ORM. Its schema is defined in `src/lib/db/schema.ts`.

The production database is the Neon project `cold-wildflower-42597313`, branch `production`. The website tables are provisioned directly in that database; no migration files are required for the current setup.

For Vercel or another deployment platform, add `DATABASE_URL`, `ADMIN_SECRET`, and `JWT_SECRET` as server-side environment variables. Never expose the database URL with a `NEXT_PUBLIC_` prefix.

## Useful commands

```bash
npm run dev
npm run build
npm run db:studio
```
