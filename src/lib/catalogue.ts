import {
  functionalities,
  machineSection,
  productSectionMeta,
  type Category,
  type Machine,
  type ProductSection,
} from "@/content/site-data";
import { DEMO_MODE, getDemoRows } from "@/lib/demo-admin";
import { supabase } from "@/integrations/supabase/client";

type ProductRow = Record<string, unknown>;

const CMS_RETRY_DELAY_MS = 5 * 60 * 1000;
let cmsRetryAfter = 0;

function stringList(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : fallback;
}

function galleryImages(value: unknown, fallback: string[]) {
  const images = stringList(value, fallback);
  return images.length > 0 ? images : fallback;
}

function specifications(value: unknown, fallback: Machine["specs"]) {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({ label: String(item.label ?? ""), value: String(item.value ?? "") }))
    .filter((item) => item.label && item.value);

  // Product rows created before specifications were populated contain the
  // column's default empty array. Keep the verified built-in specification
  // set in that case instead of replacing it with an empty table.
  return parsed.length > 0 ? parsed : fallback;
}

function specificationTables(
  value: unknown,
  fallback: Machine["specificationTables"],
): Machine["specificationTables"] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({
      title: String(item.title ?? ""),
      columns: stringList(item.columns, []),
      rows: Array.isArray(item.rows)
        ? item.rows
            .filter(
              (row): row is Record<string, unknown> => Boolean(row) && typeof row === "object",
            )
            .map((row) => ({ label: String(row.label ?? ""), values: stringList(row.values, []) }))
            .filter((row) => row.label && row.values.length > 0)
        : [],
      sourceUrl: item.sourceUrl ? String(item.sourceUrl) : undefined,
      note: item.note ? String(item.note) : undefined,
    }))
    .filter(
      (table) =>
        table.title &&
        table.columns.length > 0 &&
        table.rows.length > 0 &&
        table.rows.every((row) => row.values.length === table.columns.length),
    );

  return parsed.length > 0 ? parsed : fallback;
}

function specificationStatus(
  value: unknown,
  fallback: Machine["specificationStatus"],
): Machine["specificationStatus"] {
  return value === "verified" || value === "project-specific" || value === "source-review"
    ? value
    : fallback;
}

function category(value: unknown): Category {
  const next = String(value ?? "casting");
  return next === "automation" || next === "robotics" ? next : "casting";
}

function section(value: unknown, fallback: ProductSection): ProductSection {
  const next = String(value ?? "") as ProductSection;
  return next in productSectionMeta ? next : fallback;
}

function mergeProduct(row: ProductRow, base?: Machine): Machine {
  const nextCategory = category(row.category ?? base?.category);
  const fallbackImage = base?.image ?? "/productsimg/casting/4-pillar-wax-injector.png";
  return {
    code: String(row.code ?? base?.code ?? "CUSTOM"),
    slug: String(row.slug ?? base?.slug ?? "custom-machine"),
    title: String(row.title ?? base?.title ?? "Custom Machine"),
    image: String(row.image_url || base?.image || fallbackImage),
    desc: String(row.description ?? base?.desc ?? ""),
    category: nextCategory,
    section: section(
      row.section,
      base
        ? machineSection(base)
        : nextCategory === "casting"
          ? "wax-injection-machines"
          : "flexible-industrial-automation",
    ),
    tagline: String(row.tagline ?? base?.tagline ?? ""),
    group: base?.group ?? (nextCategory === "casting" ? "wax-automation" : "robotic"),
    images: galleryImages(row.gallery_images, base?.images ?? []),
    highlights: stringList(row.highlights, base?.highlights ?? []),
    applications: stringList(row.applications, base?.applications ?? []),
    specs: specifications(row.specs, base?.specs ?? []),
    specificationTables: specificationTables(row.specification_tables, base?.specificationTables),
    specificationStatus: specificationStatus(
      row.specification_status,
      base?.specificationStatus ?? (base ? "verified" : "project-specific"),
    ),
    specificationNote: String(row.specification_note || base?.specificationNote || "") || undefined,
    galleryCaptions: stringList(row.gallery_captions, base?.galleryCaptions ?? []),
    videos: base?.videos,
    officialSourceUrl:
      String(row.official_source_url || base?.officialSourceUrl || "") || undefined,
    datasheetUrl: String(row.datasheet_url || base?.datasheetUrl || "") || undefined,
  };
}

function mergeCatalogue(rows: ProductRow[]) {
  const overrides = new Map(rows.map((row) => [String(row.slug ?? ""), row]));
  const catalogue: Machine[] = [];

  for (const machine of functionalities) {
    const override = overrides.get(machine.slug);
    if (!override) {
      catalogue.push(machine);
      continue;
    }
    overrides.delete(machine.slug);
    if (override.published !== false) catalogue.push(mergeProduct(override, machine));
  }

  for (const row of overrides.values()) {
    if (row.published !== false && row.slug && row.title) catalogue.push(mergeProduct(row));
  }

  return catalogue;
}

export async function fetchPublishedMachines() {
  if (DEMO_MODE) {
    if (typeof window === "undefined") return functionalities;
    return mergeCatalogue(getDemoRows("products"));
  }

  // Avoid turning a temporary CMS/network outage into one failed request per
  // machine page. The source-controlled catalogue remains complete and safe to
  // serve while the CMS is retried after a short cooldown.
  if (Date.now() < cmsRetryAfter) return functionalities;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) {
    cmsRetryAfter = Date.now() + CMS_RETRY_DELAY_MS;
    console.warn("Product CMS is unavailable; serving the verified built-in catalogue.", error);
    return functionalities;
  }
  cmsRetryAfter = 0;
  return mergeCatalogue((data ?? []) as ProductRow[]);
}

export async function fetchPublishedMachine(slug: string) {
  const catalogue = await fetchPublishedMachines();
  return catalogue.find((machine) => machine.slug === slug) ?? null;
}
