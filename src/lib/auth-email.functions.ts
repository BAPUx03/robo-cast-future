import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const publicRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .max(255)
    .transform((value) => value.toLowerCase()),
  flow: z.enum(["sign_in", "recovery"]),
});

export const requestAuthEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => publicRequestSchema.parse(input))
  .handler(async ({ data }) => {
    const { sendAuthEmailForExistingUser } = await import("@/lib/auth-email.server");
    const result = await sendAuthEmailForExistingUser(data.email, data.flow);
    if ("reason" in result && result.reason === "rate_limit") {
      throw new Error("Please wait 60 seconds before requesting another code.");
    }
    return { ok: true };
  });
