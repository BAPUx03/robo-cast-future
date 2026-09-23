import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import sharp from "sharp";

const root = join(process.cwd(), "public", "productsimg", "casting");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : path;
    }),
  );
  return files.flat();
}

function classify({ dark, light, transparent, total }) {
  if (transparent / total > 0.55) return "transparent";
  if (dark / total > 0.55) return "dark";
  if (light / total > 0.55) return "light";
  return "mixed";
}

const rows = [];

for (const path of await walk(root)) {
  if (!imageExtensions.has(extname(path).toLowerCase())) continue;

  const { data, info } = await sharp(path)
    .rotate()
    .resize(64, 64, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let dark = 0;
  let light = 0;
  let transparent = 0;
  let total = 0;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (x > 5 && x < info.width - 6 && y > 5 && y < info.height - 6) continue;
      const offset = (y * info.width + x) * info.channels;
      const [r, g, b, a] = data.subarray(offset, offset + 4);
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      total += 1;
      if (a < 32) transparent += 1;
      else if (luminance < 28) dark += 1;
      else if (luminance > 235) light += 1;
    }
  }

  rows.push({
    file: relative(root, path).replaceAll("\\", "/"),
    background: classify({ dark, light, transparent, total }),
    dark: `${Math.round((dark / total) * 100)}%`,
    light: `${Math.round((light / total) * 100)}%`,
    transparent: `${Math.round((transparent / total) * 100)}%`,
  });
}

console.table(rows);
