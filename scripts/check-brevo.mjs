const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  console.error(JSON.stringify({ authenticated: false, error: "BREVO_API_KEY is missing." }));
  process.exitCode = 1;
} else {
  try {
    const response = await fetch("https://api.brevo.com/v3/account", {
      headers: { accept: "application/json", "api-key": apiKey },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      console.error(
        JSON.stringify({
          authenticated: false,
          status: response.status,
          error: body.message ?? "Brevo rejected the API key.",
        }),
      );
      process.exitCode = 1;
    } else {
      const account = await response.json();
      console.log(
        JSON.stringify({
          authenticated: true,
          transactionalEmailEnabled: Array.isArray(account.plan),
        }),
      );
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        authenticated: false,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    process.exitCode = 1;
  }
}
