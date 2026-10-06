# Deployment guide

Modtech Machine is a full-stack TanStack Start application. It needs a JavaScript server or serverless/edge functions because login OTP, password recovery, team invitations, enquiries and admin actions run on the server. Static-only services such as GitHub Pages, an S3 website or plain HTML cPanel hosting cannot run the complete application.

## Environment variables

Add these variables to the hosting provider. Never commit real values to Git.

### Public build variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_AUTH_OTP_EXPIRY_SECONDS=3600`
- `VITE_AUTH_OTP_RESEND_SECONDS=60`

### Server-only runtime variables

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BREVO_API_KEY`

`DATABASE_URL` is needed only when applying database migrations or running database checks. Do not expose `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY` or `DATABASE_URL` as `VITE_` variables.

## Node hosts: Railway, Render, VPS and suitable cPanel plans

Use a host that supports Node.js 22 and a continuously running web process.

```sh
npm ci
npm run build:node
npm start
```

The server reads `PORT` and `HOST` from the platform. Set `HOST=0.0.0.0` when the provider requires it. `render.yaml` contains a Render Blueprint using this setup.

## Docker hosts

Pass public variables while building the image and server secrets only at runtime:

```sh
docker build \
  --build-arg VITE_SUPABASE_URL=https://PROJECT.supabase.co \
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY=PUBLIC_KEY \
  -t modtech-machinery .

docker run -p 3000:3000 \
  -e SUPABASE_URL=https://PROJECT.supabase.co \
  -e SUPABASE_PUBLISHABLE_KEY=PUBLIC_KEY \
  -e SUPABASE_SERVICE_ROLE_KEY=SERVER_SECRET \
  -e BREVO_API_KEY=SERVER_SECRET \
  modtech-machinery
```

## Cloudflare Workers

Add public variables and secrets to the Cloudflare project, then run:

```sh
npm run deploy:cloudflare
```

For CI, use `npm run build:cloudflare` followed by `nitro deploy --prebuilt`. Keep secrets in Cloudflare Workers secrets rather than `wrangler.jsonc`.

## Vercel

Import the repository in Vercel and add all environment variables in Project Settings. `vercel.json` selects the TanStack Start framework and the Vercel Nitro build:

```sh
npm run build:vercel
```

## Netlify

Import the repository, add all environment variables, and use:

```sh
npm run build:netlify
```

Use the generated Netlify server output. Do not publish only the client assets.

## Supabase launch checklist

1. Apply every SQL file in `drizzle/migrations` in numerical order.
2. In Supabase Auth, set the production Site URL and add the production auth redirect URLs.
3. Disable public user sign-up. Team accounts are created from the protected admin area.
4. Set the email OTP expiry to 3600 seconds. The application enforces a 60-second resend wait.
5. Create the first Auth user in the Supabase Dashboard and sign in once. The bootstrap function grants the first valid user the admin role.
6. Confirm at least one active admin exists before launch.
7. Verify the Modtech sender in Brevo. The configured website email is used as reply-to.

After deployment, test sign-in OTP, password reset, team invitation, enquiry notification, admin role access and one public enquiry from the production domain.

To apply one new migration from a trusted project checkout, set `DATABASE_URL` in `.env.local` and run:

```sh
npm run db:migrate:file -- 0006_product_sections.sql
```
