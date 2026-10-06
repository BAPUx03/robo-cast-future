# Modtech Machine Website

Independent website and administration platform for Modtech Machine's Investment Casting and Robotics & Automation divisions.

## Stack

- React 19 and TanStack Start
- TypeScript and Tailwind CSS
- Supabase Postgres, Auth and Row Level Security
- Brevo transactional email
- Nitro deployment output for Node, Docker, Cloudflare, Vercel and Netlify

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
npm start
```

The default build creates a portable Node server. Provider-specific builds are also available:

```sh
npm run build:cloudflare
npm run build:vercel
npm run build:netlify
npm run build:render
```

See `docs/DEPLOYMENT.md` for hosting instructions and `docs/CRM_SETUP.md` for the CRM, role, Supabase and Brevo configuration.
