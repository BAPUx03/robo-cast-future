type BrevoSender = {
  active?: boolean;
  id?: number;
};

export async function getBrevoSender(apiKey: string, name = "Modtech Machinery") {
  const response = await fetch("https://api.brevo.com/v3/senders", {
    headers: { accept: "application/json", "api-key": apiKey },
  });
  const body = await response.json().catch(() => ({}));
  const sender = body.senders?.find((item: BrevoSender) => item.active);
  if (!response.ok || !sender?.id) {
    throw new Error(body.message || "No verified Brevo sender is available.");
  }
  return { id: sender.id, name };
}

export async function sendBrevoEmail(apiKey: string, payload: Record<string, unknown>) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { accept: "application/json", "api-key": apiKey, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "Brevo could not send the email.");
  return body as { messageId?: string };
}
