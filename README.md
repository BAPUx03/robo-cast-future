# Modtech Machinery Website

Independent website and administration platform for Modtech Machinery's Investment Casting and Robotics & Automation divisions.

## Stack

- React 19 and TanStack Start
- TypeScript and Tailwind CSS
- Supabase Postgres, Auth and Row Level Security
- Brevo transactional email
- Nitro/Cloudflare deployment output

## Local development

1. Install Node.js 22 or later.
2. Copy `.env.example` to `.env.local` and add your own credentials.
3. Install dependencies and start the local server:

```sh
npm install
npm run dev
```

The development server runs at `http://localhost:8080`.

## Database

Database changes live in `drizzle/migrations`. Apply them in numerical order to a Supabase project. `DATABASE_URL` is only used by migration tooling and must remain server-side.

## Production

```sh
npm run build
```

The current Nitro preset creates Cloudflare-compatible output. Deployment accounts, domains, environment variables and infrastructure remain under the site owner's control.

See `docs/CRM_SETUP.md` for the CRM, role, Supabase and Brevo configuration.
