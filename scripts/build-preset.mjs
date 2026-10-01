const allowedPresets = new Set([
  "node-server",
  "cloudflare-module",
  "vercel",
  "netlify",
  "render-com",
]);

const preset = process.argv[2] || "node-server";

if (!allowedPresets.has(preset)) {
  throw new Error(`Unsupported deployment preset: ${preset}`);
}

process.env.NITRO_PRESET = preset;
const { createBuilder } = await import("vite");
const builder = await createBuilder();
await builder.buildApp();
