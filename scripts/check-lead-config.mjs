import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing.");
}

const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });

try {
  const settings = await sql`
    select key, value
    from public.site_settings
    where key in (
      'admin_notify_email',
      'sender_email',
      'sender_name',
      'site_url'
    )
    order by key
  `;

  const enquiries = await sql`
    select count(*)::integer as count
    from public.enquiries
  `;

  const settingsMap = Object.fromEntries(settings.map(({ key, value }) => [key, value]));

  console.log(
    JSON.stringify({
      settings: settingsMap,
      enquiryCount: enquiries[0]?.count ?? 0,
    }),
  );

  if (process.argv.includes("--send-test")) {
    const apiKey = process.env.BREVO_API_KEY;
    const recipient = settingsMap.admin_notify_email?.trim();
    if (!apiKey) throw new Error("BREVO_API_KEY is missing.");
    if (!recipient) throw new Error("admin_notify_email is missing.");

    const { getBrevoSender, sendBrevoEmail } = await import("../src/lib/brevo.server.ts");
    const sender = await getBrevoSender(apiKey, settingsMap.sender_name || "Modtech Machinery");
    const result = await sendBrevoEmail(apiKey, {
      sender,
      to: [{ email: recipient }],
      subject: "Modtech lead notification setup test",
      htmlContent:
        "<p>This is a successful test of the Modtech website lead notification flow.</p>",
    });

    console.log(
      JSON.stringify({
        testEmailAccepted: Boolean(result.messageId),
        deliveredTo: recipient,
      }),
    );
  }
} finally {
  await sql.end();
}
