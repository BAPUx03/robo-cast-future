# Modtech website handoff

This repository contains the complete website source, local images, database migrations and hosting
configuration. Website images live under `public/` and `src/assets/`; keep both directories when
copying or extracting the project.

## Start locally

1. Install Node.js 22.
2. Copy `.env.example` to `.env.local` and add the project credentials supplied through a secure
   channel.
3. Run `npm ci`.
4. Run `npm run dev` for development, or `npm run build && npm start` for the production server.

Do not add `.env.local` to a ZIP, Git repository or email attachment. Values prefixed with `VITE_`
are browser-visible. Supabase service-role, Brevo and database credentials must remain server-only.

## Database and authentication

Apply the SQL files in `drizzle/migrations/` in number order. For a new migration, set
`DATABASE_URL` locally and use, for example:

```sh
npm run db:migrate:file -- 0006_product_sections.sql
```

In the Supabase dashboard, set the production Site URL and redirect URLs, disable public sign-up,
set email OTP expiry to 3,600 seconds, create the first Auth user and sign in once to claim the first
administrator role. See `AUTH_SETUP.md` and `CRM_SETUP.md` in this directory.

## Images and email logo

- Browser images are bundled from `public/` and `src/assets/` during the build. They do not need a
  separate image server.
- The email logo must use a full public HTTPS URL in Admin > Email Settings because Gmail and other
  mail clients cannot read an image from the project ZIP or a localhost path.
- If the email logo URL is empty or unavailable, the templates show the styled MODTECH text mark.
- The desktop home hero includes `public/modtech-automation-hero.mp4`. Mobile devices and visitors
  who prefer reduced motion use its poster image instead of downloading the video.

## Hosting

This is a full-stack TanStack Start app. Use Node hosting, Docker, Vercel, Netlify or Cloudflare
Workers and add the environment variables in the provider dashboard. Static-only hosting cannot run
OTP, password reset, enquiries, email delivery or the admin area. Follow `DEPLOYMENT.md` for exact
commands and provider files.

After deployment, test a public enquiry, customer acknowledgement, admin notification, OTP,
password reset, invitation and each staff role from the production domain.

Run `npm run test:catalogue -- https://YOUR-DOMAIN` after deployment to verify every published
machine page, product image, SEO title, overview, application/specification section and 404 response.
