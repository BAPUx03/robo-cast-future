import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const sourceRoot = process.argv[2];

if (!sourceRoot) {
  throw new Error("Pass the extracted 'New Photos 2026' folder as the first argument.");
}

const outputRoot = join(process.cwd(), "public", "productsimg", "casting", "gallery");

const darkBackgroundAssets = new Set([
  "4-pillar-ceramic-injector/100t-front.webp",
  "4-pillar-ceramic-injector/50t-side.webp",
  "4-pillar-ceramic-injector/50t-front.webp",
  "fluidized-bed/blower.webp",
  "c20-wax-injector/front.webp",
  "c20-wax-injector/three-quarter.webp",
  "c20-wax-injector/hmi.webp",
  "c-frame-ceramic-injector/front.webp",
  "fluidized-bed/dust-collector-and-blower.webp",
  "fluidized-bed/front.webp",
  "high-shear-mixer/front.webp",
  "shell-knock-off/front.webp",
  "shell-knock-off/side.webp",
  "rain-sander/front.webp",
  "slurry-mixer/front.webp",
  "slurry-mixer/side.webp",
  "wax-conditioning-tank/front.webp",
]);

function removeConnectedBackground(data, info, mode) {
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const isBackground = (pixel) => {
    const offset = pixel * channels;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (mode === "dark") return max < 78;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 204 && max - min < 88;
  };

  const enqueue = (pixel) => {
    if (visited[pixel] || !isBackground(pixel)) return;
    visited[pixel] = 1;
    queue[tail] = pixel;
    tail += 1;
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const pixel = queue[head];
    head += 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x > 0) enqueue(pixel - 1);
    if (x + 1 < width) enqueue(pixel + 1);
    if (y > 0) enqueue(pixel - width);
    if (y + 1 < height) enqueue(pixel + width);
  }

  for (let pixel = 0; pixel < visited.length; pixel += 1) {
    if (!visited[pixel]) continue;
    const offset = pixel * channels;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    if (mode === "dark") {
      const max = Math.max(r, g, b);
      data[offset + 3] = max <= 12 ? 0 : Math.min(255, Math.round(((max - 12) / 66) * 255));
    } else {
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      data[offset + 3] =
        luminance >= 225 ? 0 : Math.min(255, Math.round(((225 - luminance) / 21) * 255));
    }
  }

  return data;
}

async function writeOptimizedImage(source, output, backgroundMode) {
  const pipeline = sharp(source)
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true });

  if (!backgroundMode) {
    await pipeline.webp({ quality: 82, effort: 5 }).toFile(output);
    return;
  }

  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  removeConnectedBackground(data, info, backgroundMode);
  await sharp(data, { raw: info })
    .webp({ quality: 86, alphaQuality: 100, effort: 5 })
    .toFile(output);
}

const assets = [
  ["100T 4P Ceramic Injection Machine.jpg", "4-pillar-ceramic-injector/100t-front.webp"],
  ["50T 4P Ceramic Side View.jpg", "4-pillar-ceramic-injector/50t-side.webp"],
  ["50T 4P CERAMIC.jpg", "4-pillar-ceramic-injector/50t-front.webp"],
  ["Blower with FBD.jpg", "fluidized-bed/blower.webp"],
  ["C-20 Front View.jpg", "c20-wax-injector/front.webp"],
  ["C-20 Wax Injection Machine.jpg", "c20-wax-injector/three-quarter.webp"],
  ["C20 Wax With HMI.jpg", "c20-wax-injector/hmi.webp"],
  ["Ceramic Core Injector.jpg", "c-frame-ceramic-injector/front.webp"],
  // DSC04078 is another export of the High Shear Mixer photo, so it is
  // intentionally omitted to avoid shipping the same machine image twice.
  ["FBD with Dust Collector and blower.jpg", "fluidized-bed/dust-collector-and-blower.webp"],
  ["Fluidized Bed.jpg", "fluidized-bed/front.webp"],
  ["High Shear Mixer.jpg", "high-shear-mixer/front.webp"],
  ["Kawas for Brochure1-fotor-2026011810712.png", "kawas/front.webp"],
  ["Knock Out Front.jpg", "shell-knock-off/front.webp"],
  ["Knock Out Side.jpg", "shell-knock-off/side.webp"],
  ["Rainfall Sander.jpg", "rain-sander/front.webp"],
  ["RFS Inside View.jpg", "rain-sander/interior.webp"],
  ["Slurry Mixer.jpg", "slurry-mixer/front.webp"],
  ["Slurry Mixer2.jpg", "slurry-mixer/side.webp"],
  ["Wax Conditioning Tank.jpg", "wax-conditioning-tank/front.webp"],
  ["Extruder Domestic/DSC04854.jpg", "wax-extruder-domestic/front.webp"],
  ["Extruder Domestic/DSC04857.jpg", "wax-extruder-domestic/three-quarter.webp"],
  ["Extruder Domestic/DSC04860.jpg", "wax-extruder-domestic/side.webp"],
  ["Extruder Domestic/DSC04862.jpg", "wax-extruder-domestic/control-panel.webp"],
  ["Extruder Domestic/DSC04874.jpg", "wax-extruder-domestic/detail.webp"],
  ["Extruder Export/DSC04878.jpg", "wax-extruder-export/front.webp"],
  ["Extruder Export/DSC04879.jpg", "wax-extruder-export/front-wide.webp"],
  ["Extruder Export/DSC04880.jpg", "wax-extruder-export/three-quarter.webp"],
  ["Extruder Export/DSC04890.jpg", "wax-extruder-export/side.webp"],
  ["Extruder Export/DSC04892.jpg", "wax-extruder-export/rear.webp"],
  ["Extruder Export/DSC04895.jpg", "wax-extruder-export/control-panel.webp"],
  ["Extruder Export/DSC04904.jpg", "wax-extruder-export/detail.webp"],
  ["Manual Machine/Front Close.jpg", "manual-wax-injector/front-close.webp"],
  ["Manual Machine/Manual Backside.jpg", "manual-wax-injector/rear.webp"],
  ["Manual Machine/Manual Front.jpg", "manual-wax-injector/front.webp"],
  ["Manual Machine/Manual Panel.jpg", "manual-wax-injector/control-panel.webp"],
  ["Manual Machine/Manual Side.jpg", "manual-wax-injector/side.webp"],
  ["Manual Machine/Manual Side2.jpg", "manual-wax-injector/side-two.webp"],
];

for (const [source, destination] of assets) {
  const output = join(outputRoot, destination);
  await mkdir(dirname(output), { recursive: true });
  await writeOptimizedImage(
    join(sourceRoot, source),
    output,
    darkBackgroundAssets.has(destination) ? "dark" : undefined,
  );
}

console.log(
  `Imported ${assets.length} optimized machine photos and normalized their backgrounds in ${outputRoot}`,
);
