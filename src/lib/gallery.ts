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
  portrait?: boolean;
  aspect_ratio?: number;
  object_position?: string;
};

export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  office: "Modtech Office",
  facility: "Facilities",
  factory: "Customer Sites",
  team: "People & Teams",
  events: "Visits & Events",
};

const clientGalleryItems: GalleryItem[] = [
  {
    id: "client-international-machine-commissioning",
    title: "Engineering partnerships in action",
    category: "factory",
    location: "International customer site",
    image_url: "/gallery/customer-visits/international-machine-commissioning.webp",
    alt_text: "Modtech engineers with an international customer team in front of a Modtech machine",
    caption:
      "A customer-site milestone bringing engineering teams together around Modtech equipment.",
    featured: true,
    sort_order: 10,
    published: true,
    aspect_ratio: 16 / 9,
    object_position: "50% 45%",
  },
  {
    id: "client-site-installation",
    title: "Customer-site installation",
    category: "factory",
    location: "International customer facility",
    image_url: "/gallery/customer-visits/customer-site-installation.webp",
    alt_text: "Customer and Modtech teams standing beside an installed Modtech machine",
    caption: "Working side by side with the customer team during an international installation.",
    featured: false,
    sort_order: 20,
    published: true,
    aspect_ratio: 4 / 3,
    object_position: "42% 48%",
  },
  {
    id: "client-technical-collaboration",
    title: "International technical collaboration",
    category: "factory",
    location: "Customer production facility",
    image_url: "/gallery/customer-visits/international-technical-collaboration.webp",
    alt_text: "Modtech representatives with an international production team on a factory floor",
    caption: "Technical teams connecting on the shop floor to support reliable production.",
    featured: false,
    sort_order: 30,
    published: true,
    aspect_ratio: 16 / 9,
    object_position: "50% 45%",
  },
  {
    id: "client-machine-visit",
    title: "Customer project milestone",
    category: "factory",
    location: "Customer manufacturing facility",
    image_url: "/gallery/customer-visits/uk-customer-machine-visit.webp",
    alt_text:
      "Customer team standing with a Modtech industrial machine at a manufacturing facility",
    caption: "A shared project milestone with the customer team beside the completed machine.",
    featured: false,
    sort_order: 40,
    published: true,
    portrait: true,
    aspect_ratio: 3 / 4,
    object_position: "50% 52%",
  },
  {
    id: "client-thailand-visit",
    title: "Building partnerships in Thailand",
    category: "events",
    location: "MSM, Thailand",
    image_url: "/gallery/customer-visits/thailand-customer-visit.webp",
    alt_text: "Modtech representatives visiting the MSM team in Thailand",
    caption: "Strengthening international relationships through direct customer collaboration.",
    featured: false,
    sort_order: 50,
    published: true,
    aspect_ratio: 4 / 3,
    object_position: "50% 48%",
  },
  {
    id: "client-modtech-office-guests",
    title: "Welcoming global partners",
    category: "office",
    location: "Modtech Machine, India",
    image_url: "/gallery/customer-visits/international-guests-modtech-office.webp",
    alt_text: "Modtech team welcoming international guests at the company office",
    caption: "International guests receive a warm welcome from the Modtech team.",
    featured: false,
    sort_order: 60,
    published: true,
    portrait: true,
    aspect_ratio: 3 / 4,
    object_position: "50% 38%",
  },
  {
    id: "client-trade-show",
    title: "Connecting at the industry show",
    category: "events",
    location: "International trade exhibition",
    image_url: "/gallery/customer-visits/international-trade-show.webp",
    alt_text: "Modtech representatives meeting international partners at an industry exhibition",
    caption:
      "Exchanging ideas and exploring new manufacturing opportunities at an international show.",
    featured: false,
    sort_order: 70,
    published: true,
    portrait: true,
    aspect_ratio: 3 / 4,
    object_position: "50% 52%",
  },
  {
    id: "client-hi-tech-visit",
    title: "Technical exchange at Hi-Tech",
    category: "events",
    location: "Hi-Tech facility",
    image_url: "/gallery/customer-visits/hi-tech-customer-visit.webp",
    alt_text: "Modtech representatives with the Hi-Tech team during a technical visit",
    caption: "A focused visit built around technical exchange and long-term collaboration.",
    featured: false,
    sort_order: 80,
    published: true,
    portrait: true,
    aspect_ratio: 3 / 4,
    object_position: "50% 62%",
  },
  {
    id: "client-partner-dinner",
    title: "Relationships beyond the factory floor",
    category: "events",
    location: "International customer gathering",
    image_url: "/gallery/customer-visits/international-customer-dinner.webp",
    alt_text: "Modtech team sharing dinner with international business partners",
    caption: "Celebrating the people and relationships behind successful global projects.",
    featured: false,
    sort_order: 90,
    published: true,
    aspect_ratio: 16 / 9,
    object_position: "50% 50%",
  },
];

export const defaultGalleryItems: GalleryItem[] = clientGalleryItems;

const legacyGalleryImages = new Set([
  "/gallery/modtech-office-hero.webp",
  "/gallery/engineering-design-studio.webp",
  "/gallery/project-review-room.webp",
  "/gallery/team-collaboration.webp",
]);

function arrangeGalleryItems(items: GalleryItem[]): GalleryItem[] {
  const normalizeImageUrl = (url: string) =>
    url
      .trim()
      .replace(/^https?:\/\/[^/]+/i, "")
      .replace(/[?#].*$/, "")
      .replace(/\/+$/, "")
      .toLowerCase();
  const itemsByImage = new Map(items.map((item) => [normalizeImageUrl(item.image_url), item]));
  const arrangedClientItems = clientGalleryItems.map((item) => ({
    ...item,
    ...itemsByImage.get(normalizeImageUrl(item.image_url)),
    portrait: item.portrait,
    aspect_ratio: item.aspect_ratio,
    object_position: item.object_position,
  }));
  const clientImages = new Set(clientGalleryItems.map((item) => normalizeImageUrl(item.image_url)));
  const additionalItems = items.filter(
    (item) =>
      !clientImages.has(normalizeImageUrl(item.image_url)) &&
      !legacyGalleryImages.has(normalizeImageUrl(item.image_url)),
  );

  const seenImages = new Set<string>();
  return [...arrangedClientItems, ...additionalItems].filter((item) => {
    const imageKey = normalizeImageUrl(item.image_url);
    if (!imageKey || seenImages.has(imageKey)) return false;
    seenImages.add(imageKey);
    return true;
  });
}

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
      portrait: Boolean(row["portrait"]),
      aspect_ratio: Number(row["aspect_ratio"]) || undefined,
      object_position: String(row["object_position"] || "50% 50%"),
    }))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
}

export async function fetchPublishedGallery(): Promise<GalleryItem[]> {
  if (DEMO_MODE) {
    const local = mapGalleryRows(getDemoRows("gallery_items"));
    return arrangeGalleryItems(local);
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) return defaultGalleryItems;
  const items = mapGalleryRows((data ?? []) as Record<string, unknown>[]);
  return arrangeGalleryItems(items);
}
