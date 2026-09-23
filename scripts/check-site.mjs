const base = new URL(process.argv[2] ?? "http://localhost:8080");
const seeds = [
  "/",
  "/about",
  "/divisions",
  "/machines",
  "/solutions",
  "/industries",
  "/process",
  "/news",
  "/blog",
  "/contact",
];

const queue = seeds.map((path) => new URL(path, base));
const checked = new Map();
const issues = [];

while (queue.length) {
  const url = queue.shift();
  const key = url.href;
  if (checked.has(key)) continue;

  try {
    const response = await fetch(url, { redirect: "follow" });
    const contentType = response.headers.get("content-type") ?? "";
    checked.set(key, response.status);

    if (!response.ok) {
      issues.push(`${response.status} ${url.href}`);
      continue;
    }

    if (!contentType.includes("text/html")) continue;
    const html = await response.text();
    const references = html.matchAll(/(?:href|src)=["']([^"'#]+)["']/gi);

    for (const match of references) {
      const value = match[1].trim();
      if (!value || /^(?:mailto:|tel:|data:|javascript:)/i.test(value)) continue;
      const child = new URL(value, response.url);
      if (child.origin !== base.origin || child.pathname.startsWith("/api/")) continue;
      child.hash = "";
      if (!checked.has(child.href)) queue.push(child);
    }
  } catch (error) {
    issues.push(`FETCH ${url.href}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log(`Checked ${checked.size} local pages and assets.`);
if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log("No broken local links or assets found.");
}
