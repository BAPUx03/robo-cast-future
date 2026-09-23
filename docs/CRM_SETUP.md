# Modtech CRM, Supabase and Brevo setup

## Data flow

1. A visitor submits the website enquiry form.
2. The server validates and stores the lead in `public.enquiries`.
3. Brevo Transactional Email sends the customer acknowledgement and the configured admin notification.
4. An admin or sales manager assigns the lead to an active sales executive.
5. The assignee receives a Brevo email and sees the lead after signing in.
6. Status, priority, follow-up time and internal notes are updated in the control centre.
7. Every lead change is written to `public.lead_activities` for audit history.
8. Managers can filter the pipeline and export the authorised result set as CSV.

## Authentication flow

- Team members can sign in with a password or a six-digit email OTP.
- Password recovery sends an email OTP, verifies it, then allows the user to set a new password.
- Admins can add administrators, editors, sales managers and sales executives, change their role, deactivate access and resend an OTP.
- Sales managers can add and manage sales executives only.
- Inactive accounts are signed out before the control centre loads.

## Roles

| Role            | Website content | All leads     | Assign leads | Team                      | Settings |
| --------------- | --------------- | ------------- | ------------ | ------------------------- | -------- |
| Administrator   | Full            | Yes           | Yes          | All roles                 | Yes      |
| Content Editor  | Edit/publish    | No            | No           | No                        | No       |
| Sales Manager   | No              | Yes           | Yes          | Add/view sales executives | No       |
| Sales Executive | No              | Assigned only | No           | No                        | No       |

The restrictions are enforced by Supabase Row Level Security as well as by the interface.

## Required server environment variables

Keep these in the hosting provider's server secrets. Do not put them in a tracked `.env` file.

```text
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BREVO_API_KEY=
```

The browser needs only:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Never create a `VITE_SUPABASE_SERVICE_ROLE_KEY` or `VITE_BREVO_API_KEY`; any `VITE_` value is public.

## Database

Use `DATABASE_URL` for migration tooling only. It must contain your own Supabase Postgres connection string and must never be exposed with a `VITE_` prefix.

Apply these migrations in order:

1. `drizzle/migrations/0000_create_cms_tables.sql`
2. `drizzle/migrations/0001_admin_content.sql`
3. `drizzle/migrations/0002_sales_crm.sql`

The third migration adds sales roles, lead ownership, priority, follow-up, internal notes, activity history, profile sync, indexes and RLS policies.

## Brevo transactional email

1. Verify the sending domain or sender in Brevo and configure SPF, DKIM and DMARC.
2. Create a Brevo transactional API key and store it as `BREVO_API_KEY` on the server.
3. In Admin > Email Settings, save the verified sender email, sender name and new-lead notification address.
4. In Supabase Authentication > SMTP Settings, enable custom SMTP and enter the Brevo SMTP credentials. This is used for team OTP emails.
5. In the Supabase Magic Link email template, include `{{ .Token }}` so the message contains the six-digit OTP.
6. Set the production Site URL and allowed redirect URLs in Supabase Authentication settings.

Brevo has two separate credentials: the HTTP API key sends lead/customer messages; the SMTP key entered in Supabase sends authentication OTPs.

### Supabase Auth OTP through Brevo SMTP

In Supabase, open Authentication > Emails > SMTP Settings and use:

- Host: `smtp-relay.brevo.com`
- Port: `587`
- Username: the SMTP login shown in Brevo's SMTP tab
- Password: a Brevo SMTP key (not the HTTP API key)
- Sender name: `Modtech Machinery`
- Sender email: a sender/domain verified in Brevo

Then open Authentication > Email Templates > Magic Link, use the subject `Your Modtech secure sign-in code`, and paste `docs/supabase-otp-template.html`. The template intentionally uses `{{ .Token }}` rather than `{{ .ConfirmationURL }}` so Supabase sends a six-digit OTP.

## Lead lifecycle

Recommended statuses are `new`, `contacted`, `quoted` and `closed`. Use priority for urgency, follow-up for the next commitment, and internal notes for qualification and quotation context. Customer-sensitive secrets should never be stored in internal notes.

## Production checklist

- Apply all database migrations.
- Add the service-role and Brevo secrets only on the server.
- Configure and test Brevo sender/domain authentication.
- Configure Supabase custom SMTP and OTP template.
- Create the first user in Supabase Authentication. On their first successful sign-in they can claim the administrator role only when no administrator exists; add everyone else from Sales Team.
- Submit a real test enquiry and verify the customer, admin and assignee emails.
- Test each role with a separate account before launch.
- Configure backups, monitoring and appropriate Supabase/Brevo billing alerts.
