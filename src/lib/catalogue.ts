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

function stringList(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : fallback;
}

function galleryImages(value: unknown, fallback: string[]) {
  const images = stringList(value, fallback);
  return images.length > 0 ? images : fallback;
}

function specifications(value: unknown, fallback: Machine["specs"]) {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item) => ({ label: String(item.label ?? ""), value: String(item.value ?? "") }))
    .filter((item) => item.label && item.value);
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
    specificationTables: base?.specificationTables,
    officialSourceUrl: base?.officialSourceUrl,
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

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return mergeCatalogue((data ?? []) as ProductRow[]);
}

export async function fetchPublishedMachine(slug: string) {
  const catalogue = await fetchPublishedMachines();
  return catalogue.find((machine) => machine.slug === slug) ?? null;
}
