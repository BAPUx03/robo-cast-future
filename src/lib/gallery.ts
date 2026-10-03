import { automationImages } from "@/content/automation-data";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_MODE, getDemoRows } from "@/lib/demo-admin";

export type GalleryCategory = "office" | "facility" | "factory" | "team" | "events";

export type GalleryItem = {
  id: string;
  title: string;
  category: GalleryCategory;
  location: string;
  image_url: string;
  alt_text: string;
  caption: string;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  office: "Office",
  facility: "Facility",
  factory: "Factory Floor",
  team: "People",
  events: "Events",
};

export const defaultGalleryItems: GalleryItem[] = [
  {
    id: "default-office-hero",
    title: "Office meets engineering",
    category: "office",
    location: "Modtech engineering campus",
    image_url: "/gallery/modtech-office-hero.webp",
    alt_text:
      "Contemporary Modtech office with glass meeting rooms overlooking a robotics integration floor",
    caption:
      "A connected workplace where customer conversations, engineering decisions and shop-floor execution happen side by side.",
    featured: true,
    sort_order: 5,
    published: true,
  },
  {
    id: "default-design-studio",
    title: "Engineering design studio",
    category: "team",
    location: "Design & applications office",
    image_url: "/gallery/engineering-design-studio.webp",
    alt_text: "Indian automation engineers collaborating around a mechanical design workstation",
    caption:
      "Cross-functional teams develop machine concepts, tooling and controls around the real production challenge.",
    featured: false,
    sort_order: 10,
    published: true,
  },
  {
    id: "default-project-review",
    title: "Project review room",
    category: "office",
    location: "Customer engineering centre",
    image_url: "/gallery/project-review-room.webp",
    alt_text:
      "Engineering leaders reviewing project drawings in a glass meeting room beside the automation floor",
    caption:
      "Every programme moves through structured design reviews before manufacturing and integration.",
    featured: false,
    sort_order: 15,
    published: true,
  },
  {
    id: "default-team-collaboration",
    title: "Ideas move faster together",
    category: "team",
    location: "Engineering collaboration lounge",
    image_url: "/gallery/team-collaboration.webp",
    alt_text: "Indian engineering and operations team discussing a project in a modern office",
    caption:
      "Mechanical, electrical, controls and operations expertise come together around each application.",
    featured: false,
    sort_order: 18,
    published: true,
  },
  {
    id: "default-facility",
    title: "Engineering under one roof",
    category: "facility",
    location: "Modtech Machinery",
    image_url: automationImages.facility,
    alt_text: "Modtech Machinery engineering and manufacturing facility",
    caption: "Design, manufacturing, controls and validation brought together in one facility.",
    featured: false,
    sort_order: 20,
    published: true,
  },
  {
    id: "default-case-erector",
    title: "Automation assembly floor",
    category: "factory",
    location: "Robotics division",
    image_url: automationImages.caseErectorFloor,
    alt_text: "Robotic case erector on the Modtech assembly floor",
    caption: "Turnkey cells assembled and tested before customer dispatch.",
    featured: false,
    sort_order: 30,
    published: true,
  },
  {
    id: "default-palletizing",
    title: "Palletizing cell validation",
    category: "factory",
    location: "Automation shop floor",
    image_url: automationImages.palletizingFloor,
    alt_text: "Robotic palletizing cell during validation",
    caption: "Cycle testing, safety validation and production trials on the shop floor.",
    featured: false,
    sort_order: 40,
    published: true,
  },
  {
    id: "default-pick-place",
    title: "Precision handling systems",
    category: "factory",
    location: "Integration bay",
    image_url: automationImages.pickPlaceFloor,
    alt_text: "Pick-and-place robot cell in the Modtech integration bay",
    caption: "Robotics, vision and end-of-arm tooling engineered as one production system.",
    featured: false,
    sort_order: 50,
    published: true,
  },
  {
    id: "default-machine-tending",
    title: "Machine-tending integration",
    category: "facility",
    location: "Applications centre",
    image_url: automationImages.machineTendingFloor,
    alt_text: "Machine-tending robot cell inside the Modtech applications centre",
    caption: "Application engineering for safer, repeatable machine loading and unloading.",
    featured: false,
    sort_order: 60,
    published: true,
  },
  {
    id: "default-casting",
    title: "Investment casting expertise",
    category: "facility",
    location: "Casting division",
    image_url: automationImages.casting,
    alt_text: "Investment casting production environment",
    caption: "Process knowledge and equipment engineering across the complete casting workflow.",
    featured: false,
    sort_order: 70,
    published: true,
  },
];

function isGalleryCategory(value: unknown): value is GalleryCategory {
  return ["office", "facility", "factory", "team", "events"].includes(String(value));
}

function mapGalleryRows(rows: Record<string, unknown>[]): GalleryItem[] {
  return rows
    .filter((row) => row["published"] !== false && Boolean(row["image_url"]))
    .map((row, index) => ({
      id: String(row["id"] ?? `gallery-${index}`),
      title: String(row["title"] ?? "Inside Modtech"),
      category: isGalleryCategory(row["category"]) ? row["category"] : "facility",
      location: String(row["location"] ?? ""),
      image_url: String(row["image_url"]),
      alt_text: String(row["alt_text"] || row["title"] || "Modtech facility"),
      caption: String(row["caption"] ?? ""),
      featured: Boolean(row["featured"]),
      sort_order: Number(row["sort_order"] ?? index * 10),
      published: row["published"] !== false,
    }))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
}

export async function fetchPublishedGallery(): Promise<GalleryItem[]> {
  if (DEMO_MODE) {
    const local = mapGalleryRows(getDemoRows("gallery_items"));
    return local.length > 0 ? local : defaultGalleryItems;
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) return defaultGalleryItems;
  const items = mapGalleryRows((data ?? []) as Record<string, unknown>[]);
  return items.length > 0 ? items : defaultGalleryItems;
}
