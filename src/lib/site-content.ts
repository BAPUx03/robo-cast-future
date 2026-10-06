import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DEMO_MODE } from "@/lib/demo-admin";

export type SiteContentField = {
  key: string;
  label: string;
  defaultValue: string;
  multiline?: boolean;
};

export type SiteContentPage = {
  id: string;
  label: string;
  description: string;
  fields: SiteContentField[];
};

export const SITE_CONTENT_PAGES: SiteContentPage[] = [
  {
    id: "home",
    label: "Home page",
    description: "Main hero message and primary calls to action.",
    fields: [
      {
        key: "eyebrow",
        label: "Hero eyebrow",
        defaultValue: "Engineering manufacturing systems since 1990",
      },
      { key: "title", label: "Hero title", defaultValue: "Investment casting." },
      { key: "accent", label: "Hero accent title", defaultValue: "Robotic automation." },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "Modtech designs and builds investment casting machinery and customised turnkey automation—from robotic case handling and palletizing to pick-and-place and vision-guided cells.",
        multiline: true,
      },
      { key: "primary_cta", label: "Primary button", defaultValue: "Explore machines" },
      { key: "secondary_cta", label: "Secondary button", defaultValue: "Talk to engineering" },
    ],
  },
  {
    id: "about",
    label: "About page",
    description: "Company introduction shown at the top of the About page.",
    fields: [
      { key: "eyebrow", label: "Hero eyebrow", defaultValue: "/ About Modtech · Since 1990" },
      { key: "title", label: "Hero title", defaultValue: "Engineering that moves" },
      { key: "accent", label: "Hero accent title", defaultValue: "industry forward." },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "We design, build and integrate production systems—from precision wax machinery to autonomous robotic cells—under one roof in Ahmedabad.",
        multiline: true,
      },
    ],
  },
  {
    id: "machines",
    label: "Machines page",
    description: "Product catalogue introduction.",
    fields: [
      { key: "eyebrow", label: "Hero eyebrow", defaultValue: "/ machines" },
      { key: "title", label: "Hero title", defaultValue: "Solutions across the" },
      { key: "accent", label: "Hero accent title", defaultValue: "production line." },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "Choose a division to filter the catalogue, then open any machine for full specifications.",
        multiline: true,
      },
    ],
  },
  {
    id: "news",
    label: "Blogs page",
    description: "Blogs, insights and exhibitions page introduction.",
    fields: [
      { key: "eyebrow", label: "Hero eyebrow", defaultValue: "/ blogs @ modtech" },
      { key: "title", label: "Hero title", defaultValue: "Blogs, case studies &" },
      { key: "accent", label: "Hero accent title", defaultValue: "factory stories." },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "Filter by robotics, automation or casting to dive into recent deployments and engineering deep-dives.",
        multiline: true,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact page",
    description: "Contact-page headline and lead-in.",
    fields: [
      { key: "eyebrow", label: "Hero eyebrow", defaultValue: "/ contact" },
      { key: "title", label: "Hero title", defaultValue: "Let's engineer your" },
      { key: "accent", label: "Hero accent title", defaultValue: "next production line." },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "Tell us about the part, the volume, and the cycle time. We'll come back with a system blueprint.",
        multiline: true,
      },
    ],
  },
  {
    id: "divisions",
    label: "Divisions page",
    description: "Divisions overview introduction.",
    fields: [
      { key: "eyebrow", label: "Hero eyebrow", defaultValue: "/ divisions" },
      { key: "title", label: "Hero title", defaultValue: "Two divisions." },
      { key: "accent", label: "Hero accent title", defaultValue: "One engineering team." },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "Each division ships a complete portfolio of machines, robots and process tooling—engineered, built and integrated under one roof.",
        multiline: true,
      },
    ],
  },
  {
    id: "solutions",
    label: "Solutions page",
    description: "Automation services and solutions introduction.",
    fields: [
      { key: "eyebrow", label: "Hero eyebrow", defaultValue: "/ services & solutions" },
      { key: "title", label: "Hero title", defaultValue: "Come & solve it with" },
      { key: "accent", label: "Hero accent title", defaultValue: "robots." },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "Turnkey end-of-line packaging, palletizing, pick-and-place and vision automation—designed, built and commissioned from our Ahmedabad facility.",
        multiline: true,
      },
    ],
  },
  {
    id: "industries",
    label: "Industries page",
    description: "Industries served introduction.",
    fields: [
      { key: "eyebrow", label: "Hero eyebrow", defaultValue: "/ industries served" },
      { key: "title", label: "Hero title", defaultValue: "Engineered for the" },
      {
        key: "accent",
        label: "Hero accent title",
        defaultValue: "industries that build the world.",
      },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "From precision aerospace cores to high-volume automotive lines—Modtech machines run inside every major manufacturing sector.",
        multiline: true,
      },
    ],
  },
  {
    id: "process",
    label: "Process page",
    description: "Engineering process introduction.",
    fields: [
      { key: "eyebrow", label: "Hero eyebrow", defaultValue: "/ process" },
      { key: "title", label: "Hero title", defaultValue: "A transparent path" },
      { key: "accent", label: "Hero accent title", defaultValue: "from concept to production." },
      {
        key: "description",
        label: "Hero description",
        defaultValue:
          "Five clear steps. One accountable engineering team. Total visibility from first call to live production.",
        multiline: true,
      },
    ],
  },
  {
    id: "global",
    label: "Global details",
    description: "Contact information and footer messaging used across the website.",
    fields: [
      {
        key: "company_tagline",
        label: "Company tagline",
        defaultValue:
          "India's engineering partner for robotics, automation and investment casting machinery—engineered, built and integrated under one roof.",
        multiline: true,
      },
      {
        key: "primary_email",
        label: "Casting machine enquiries email",
        defaultValue: "info@modtechworld.com",
      },
      {
        key: "automation_email",
        label: "Robotics & automation enquiries email",
        defaultValue: "sales.automation@modtechworld.com",
      },
      {
        key: "address",
        label: "Office address",
        defaultValue:
          "Modtech Machines Pvt Ltd — Survey No. 396, Plot No. 73P, New Ahmedabad Industrial Estate, B/h Zydus Research Center, NH 8A, Moraiya (Dist. Sanand), Ahmedabad 382 213, Gujarat, India.",
        multiline: true,
      },
      {
        key: "footer_line",
        label: "Footer line",
        defaultValue: "Engineered in India · Deployed Worldwide",
      },
    ],
  },
];

const STORAGE_KEY = "modtech-site-content";
const EVENT_NAME = "modtech-site-content-change";

export function getDefaultSiteContent(pageId: string) {
  const page = SITE_CONTENT_PAGES.find((item) => item.id === pageId);
  return Object.fromEntries((page?.fields ?? []).map((field) => [field.key, field.defaultValue]));
}

function readAllContent(): Record<string, Record<string, string>> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      Record<string, string>
    >;
  } catch {
    return {};
  }
}

export function getSiteContent(pageId: string) {
  return { ...getDefaultSiteContent(pageId), ...(readAllContent()[pageId] ?? {}) };
}

function cacheSiteContent(pageId: string, values: Record<string, string>) {
  const all = readAllContent();
  all[pageId] = values;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export async function fetchSiteContent(pageId: string) {
  if (DEMO_MODE) return getSiteContent(pageId);
  const { data, error } = await supabase
    .from("site_content" as never)
    .select("content")
    .eq("page_id", pageId)
    .maybeSingle();
  if (error) throw error;
  const remote = (data as { content?: Record<string, string> } | null)?.content;
  return { ...getDefaultSiteContent(pageId), ...(remote ?? {}) };
}

export async function saveSiteContent(pageId: string, values: Record<string, string>) {
  if (!DEMO_MODE) {
    const { error } = await supabase
      .from("site_content" as never)
      .upsert({ page_id: pageId, content: values } as never, { onConflict: "page_id" });
    if (error) throw error;
  }
  cacheSiteContent(pageId, values);
}

export function useSiteContent(pageId: string) {
  const [content, setContent] = useState(() => getDefaultSiteContent(pageId));

  useEffect(() => {
    const sync = () => setContent(getSiteContent(pageId));
    sync();
    let active = true;
    void fetchSiteContent(pageId)
      .then((next) => {
        if (!active) return;
        setContent(next);
        if (!DEMO_MODE) cacheSiteContent(pageId, next);
      })
      .catch(() => {
        // Keep the bundled defaults or last cached copy when the CMS is unavailable.
      });
    window.addEventListener("storage", sync);
    window.addEventListener(EVENT_NAME, sync);
    return () => {
      active = false;
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVENT_NAME, sync);
    };
  }, [pageId]);

  return content;
}
