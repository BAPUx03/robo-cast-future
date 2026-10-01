const base = new URL(process.argv[2] ?? "http://127.0.0.1:4180");

function decode(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

const listingResponse = await fetch(new URL("/machines", base));
if (!listingResponse.ok) throw new Error(`Machine listing returned ${listingResponse.status}.`);
const listingHtml = await listingResponse.text();
const discovered = [...listingHtml.matchAll(/href=["'](\/machines\/[^"'#?]+)["']/g)].map(
  (match) => match[1],
);
const listingDivisions = [...listingHtml.matchAll(/data-machine-division="([^"]+)"/g)].map(
  (match) => match[1],
);
const divisionCounts = Object.fromEntries(
  ["casting", "robotics"].map((division) => [
    division,
    listingDivisions.filter((item) => item === division).length,
  ]),
);
const paths = [...new Set(discovered)].sort();
const duplicateLinks = discovered.length - paths.length;
const results = [];
const issues = [];
if (
  listingDivisions.length !== paths.length ||
  divisionCounts.casting !== 22 ||
  divisionCounts.robotics !== 6
) {
  issues.push({
    path: "/machines",
    expectedDivisions: { casting: 22, robotics: 6 },
    divisionCounts,
    classifiedCards: listingDivisions.length,
  });
}
const checkedImages = new Map();
const uniqueImages = new Set();

const divisionNavigation = {};
for (const page of ["/", "/divisions"]) {
  const response = await fetch(new URL(page, base));
  const html = await response.text();
  const links = {
    casting: html.includes('href="/machines?division=casting"'),
    robotics: html.includes('href="/machines?division=robotics"'),
  };
  const valid = response.ok && links.casting && links.robotics;
  divisionNavigation[page] = { valid, status: response.status, links };
  if (!valid) issues.push({ path: page, expected: "links to both filtered catalogues", links });
}

const filteredCatalogueChecks = {};
const expectedFilteredCatalogues = {
  casting: {
    products: 22,
    sections: [
      "wax-injection-machines",
      "wax-processing-conditioning",
      "wax-room-automation",
      "shelling-solutions",
      "ceramic-injectors",
      "fettling-equipment",
    ],
  },
  robotics: {
    products: 6,
    sections: ["end-of-line-packaging", "flexible-industrial-automation"],
  },
};

for (const [division, expected] of Object.entries(expectedFilteredCatalogues)) {
  const response = await fetch(new URL(`/machines?division=${division}`, base));
  const html = await response.text();
  const productLinks = [
    ...new Set([...html.matchAll(/href=["'](\/machines\/[^"'#?]+)["']/g)].map((match) => match[1])),
  ];
  const cardDivisions = [...html.matchAll(/data-machine-division="([^"]+)"/g)].map(
    (match) => match[1],
  );
  const sections = [...html.matchAll(/data-machine-section="([^"]+)"/g)].map((match) => match[1]);
  const valid =
    response.ok &&
    productLinks.length === expected.products &&
    cardDivisions.length === expected.products &&
    cardDivisions.every((item) => item === division) &&
    expected.sections.length === sections.length &&
    expected.sections.every((item) => sections.includes(item));
  filteredCatalogueChecks[division] = {
    valid,
    status: response.status,
    products: productLinks.length,
    cardDivisions: Object.fromEntries(
      [...new Set(cardDivisions)].map((item) => [
        item,
        cardDivisions.filter((value) => value === item).length,
      ]),
    ),
    sections,
  };
  if (!valid) {
    issues.push({
      path: `/machines?division=${division}`,
      expected,
      ...filteredCatalogueChecks[division],
    });
  }
}

for (const path of paths) {
  const response = await fetch(new URL(path, base));
  const html = await response.text();
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim() ?? "");
  const heading = decode(
    html
      .match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() ?? "",
  );
  const imageSources = [
    ...new Set(
      [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/g)]
        .map((match) => decode(match[1]))
        .filter((source) => source.startsWith("/")),
    ),
  ];
  imageSources.forEach((source) => uniqueImages.add(source));
  const brokenImages = [];

  for (const source of imageSources) {
    let imageCheck = checkedImages.get(source);
    if (!imageCheck) {
      const imageResponse = await fetch(new URL(source, base));
      const contentType = imageResponse.headers.get("content-type") ?? "";
      const bytes = imageResponse.ok ? (await imageResponse.arrayBuffer()).byteLength : 0;
      imageCheck = {
        ok: imageResponse.ok && contentType.startsWith("image/") && bytes > 0,
        status: imageResponse.status,
        contentType,
        bytes,
      };
      checkedImages.set(source, imageCheck);
    }
    if (!imageCheck.ok) {
      brokenImages.push(
        `${imageCheck.status} ${imageCheck.contentType || "unknown type"} ${imageCheck.bytes}B ${source}`,
      );
    }
  }

  const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
  const imagesMissingAlt = imageTags.filter((tag) => !/\balt=["'][^"']*["']/.test(tag)).length;

  const checks = {
    status: response.status,
    title,
    heading,
    hasOverview: html.includes("/ overview"),
    hasApplications: html.includes("/ applications"),
    hasSpecs: html.includes("/ specs"),
    hasQuoteAction: html.includes("Request a quote"),
    localImages: imageSources.length,
    brokenImages,
    imagesMissingAlt,
  };
  const valid =
    response.ok &&
    title.includes("Modtech Machinery") &&
    title !== "Machine — Modtech Machinery" &&
    heading.length > 0 &&
    checks.hasOverview &&
    checks.hasApplications &&
    checks.hasSpecs &&
    checks.hasQuoteAction &&
    imageSources.length > 0 &&
    brokenImages.length === 0 &&
    imagesMissingAlt === 0;
  if (!valid) issues.push({ path, ...checks });
  results.push({ path, valid, ...checks });
}

const missingResponse = await fetch(new URL("/machines/this-machine-does-not-exist", base));
if (missingResponse.status !== 404) {
  issues.push({
    path: "/machines/this-machine-does-not-exist",
    expected: 404,
    status: missingResponse.status,
  });
}

console.log(
  JSON.stringify(
    {
      passed: paths.length > 0 && issues.length === 0,
      machines: paths.length,
      listingLinks: discovered.length,
      repeatedListingLinks: duplicateLinks,
      divisionCounts,
      divisionNavigation,
      filteredCatalogues: filteredCatalogueChecks,
      validPages: results.filter((item) => item.valid).length,
      totalLocalImageReferences: results.reduce((total, item) => total + item.localImages, 0),
      uniqueLocalImages: uniqueImages.size,
      validImageResponses: [...checkedImages.values()].filter((item) => item.ok).length,
      imagesMissingAlt: results.reduce((total, item) => total + item.imagesMissingAlt, 0),
      missingMachineStatus: missingResponse.status,
      issues,
    },
    null,
    2,
  ),
);

if (paths.length === 0 || issues.length > 0) process.exitCode = 1;
