import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useBlocker, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bold,
  CalendarDays,
  Download,
  Clock3,
  Eye,
  FileText,
  Globe2,
  Heading2,
  Inbox,
  Italic,
  LayoutDashboard,
  Loader2,
  List as ListIcon,
  LogOut,
  Mail,
  MonitorCog,
  Newspaper,
  Package,
  Phone,
  Plus,
  Quote,
  Save,
  Search,
  Settings2,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/cms";
import { assignLead, inviteTeamMember, updateTeamMember } from "@/lib/team.functions";
import { requestAuthEmail } from "@/lib/auth-email.functions";
import { BrandLogo } from "@/components/brand-logo";
import { MarkdownContent } from "@/components/markdown-content";
import {
  deleteDemoRow,
  endDemoSession,
  getDemoRows,
  LOCAL_ADMIN_BYPASS,
  saveDemoRow,
  saveDemoSettings,
  updateDemoRow,
} from "@/lib/demo-admin";
import {
  fetchSiteContent,
  getSiteContent,
  saveSiteContent,
  SITE_CONTENT_PAGES,
} from "@/lib/site-content";
import {
  functionalities,
  machineDivision,
  machineSection,
  productSectionMeta,
  type ProductSection,
} from "@/content/site-data";

export const Route = createFileRoute("/_authenticated/admin")({
  validateSearch: (search: Record<string, unknown>) => {
    const section = typeof search.section === "string" ? search.section : undefined;
    const validSections = [
      "overview",
      "website",
      "posts",
      "products",
      "news",
      "exhibitions",
      "enquiries",
      "team",
      "settings",
    ];
    return { section: validSections.includes(section ?? "") ? (section as Tab) : undefined };
  },
  head: () => ({
    meta: [
      { title: "Admin — Modtech Machinery" },
      {
        name: "description",
        content:
          "Manage blog posts, products, news, exhibitions and enquiries for Modtech Machinery.",
      },
      { property: "og:title", content: "Modtech Machinery Admin" },
      {
        property: "og:description",
        content: "Content management for the Modtech Machinery website.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab =
  | "overview"
  | "website"
  | "posts"
  | "products"
  | "news"
  | "exhibitions"
  | "enquiries"
  | "team"
  | "settings";

const TABS = [
  { id: "overview", label: "Overview", description: "Dashboard", Icon: LayoutDashboard },
  { id: "website", label: "Website Content", description: "Pages & contact text", Icon: Globe2 },
  { id: "posts", label: "Blog & Articles", description: "Editorial content", Icon: FileText },
  { id: "products", label: "Products", description: "Machine catalogue", Icon: Package },
  { id: "news", label: "News", description: "Updates & resources", Icon: Newspaper },
  { id: "exhibitions", label: "Exhibitions", description: "Events calendar", Icon: CalendarDays },
  { id: "enquiries", label: "Enquiries", description: "Sales leads", Icon: Inbox },
  { id: "team", label: "Team & Access", description: "People, roles & access", Icon: Users },
  { id: "settings", label: "Email Settings", description: "Notifications", Icon: Settings2 },
] as const;

type Row = Record<string, unknown> & { id?: string };

type EnquiryRow = {
  assigned_to: string | null;
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  priority: string;
  internal_notes: string;
  follow_up_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type TeamMember = {
  id: string;
  email: string | null;
  full_name: string | null;
  active: boolean;
  role: "admin" | "editor" | "sales_manager" | "sales";
};

function formatAdminDate(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function UnsavedChangesGuard({ dirty }: { dirty: boolean }) {
  const blocker = useBlocker({
    shouldBlockFn: () => dirty,
    enableBeforeUnload: () => dirty,
    disabled: !dirty,
    withResolver: true,
  });

  if (blocker.status !== "blocked") return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-carbon/80 p-5 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-deep"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="unsaved-title"
        aria-describedby="unsaved-description"
      >
        <AlertTriangle className="h-6 w-6 text-brand" />
        <h2 id="unsaved-title" className="mt-4 font-display text-lg font-bold">
          Leave without saving?
        </h2>
        <p id="unsaved-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Your unsaved changes will be lost.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={blocker.reset}
            className="rounded-full border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-brand hover:text-foreground"
          >
            Keep editing
          </button>
          <button
            type="button"
            onClick={blocker.proceed}
            className="rounded-full bg-destructive px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white hover:brightness-110"
          >
            Discard changes
          </button>
        </div>
      </div>
    </div>
  );
}

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "richtext" | "number" | "bool" | "list" | "select" | "json";
  options?: Array<string | { value: string; label: string }>;
  full?: boolean;
  required?: boolean;
  hint?: string;
};

const PRODUCT_DIVISION_OPTIONS = [
  { value: "casting", label: "Investment Casting" },
  { value: "robotics", label: "Robotics & Automation" },
];

const PRODUCT_SECTION_OPTIONS = (
  Object.entries(productSectionMeta) as Array<
    [ProductSection, (typeof productSectionMeta)[ProductSection]]
  >
).map(([value, section]) => ({
  value,
  label: `${section.division === "casting" ? "Casting" : "Robotics"} — ${section.label}`,
}));

type CollectionTab = Exclude<Tab, "overview" | "website" | "enquiries" | "team" | "settings">;

const SCHEMAS: Record<
  CollectionTab,
  {
    table: string;
    order: string;
    asc?: boolean;
    titleKey: string;
    description: string;
    fields: FieldDef[];
    blank: Row;
  }
> = {
  posts: {
    table: "blog_posts",
    order: "published_at",
    titleKey: "title",
    description: "Create long-form insights, articles and case studies for the public blog.",
    fields: [
      { key: "title", label: "Title", full: true, required: true },
      {
        key: "slug",
        label: "URL slug",
        required: true,
        hint: "Generated from the title when left blank.",
      },
      {
        key: "kind",
        label: "Type",
        type: "select",
        options: ["blog", "article", "news", "case_study"],
      },
      {
        key: "category",
        label: "Topic",
        type: "select",
        options: ["casting", "automation", "robotics", "company"],
      },
      { key: "author", label: "Author" },
      { key: "read_minutes", label: "Read minutes", type: "number" },
      { key: "cover_url", label: "Cover image URL", full: true },
      { key: "excerpt", label: "Short summary", type: "textarea", full: true },
      { key: "body", label: "Article content", type: "richtext", full: true },
      { key: "tags", label: "Tags (comma separated)", type: "list", full: true },
      { key: "pinned", label: "Pinned", type: "bool" },
      { key: "published", label: "Published", type: "bool" },
    ],
    blank: {
      title: "",
      slug: "",
      kind: "blog",
      category: "casting",
      author: "Modtech Machinery",
      read_minutes: 4,
      cover_url: "",
      excerpt: "",
      body: "",
      tags: [],
      pinned: false,
      published: true,
    },
  },
  products: {
    table: "products",
    order: "sort_order",
    asc: true,
    titleKey: "title",
    description:
      "Add custom machines or override a built-in catalogue item by using the same URL slug.",
    fields: [
      { key: "title", label: "Machine name", full: true, required: true },
      { key: "code", label: "Code", required: true },
      { key: "slug", label: "URL slug", required: true },
      {
        key: "category",
        label: "Division",
        type: "select",
        options: PRODUCT_DIVISION_OPTIONS,
        required: true,
      },
      {
        key: "section",
        label: "Product section",
        type: "select",
        options: PRODUCT_SECTION_OPTIONS,
        required: true,
        full: true,
        hint: "Controls the section where this product appears on the public Machines page.",
      },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "image_url", label: "Image URL", full: true },
      {
        key: "gallery_images",
        label: "Gallery image URLs (comma separated)",
        type: "list",
        full: true,
        hint: "Add alternate product views. The primary image stays in Image URL.",
      },
      { key: "tagline", label: "Tagline", full: true },
      { key: "description", label: "Description", type: "textarea", full: true },
      { key: "highlights", label: "Highlights (comma separated)", type: "list", full: true },
      { key: "applications", label: "Applications (comma separated)", type: "list", full: true },
      {
        key: "specs",
        label: "Specifications (JSON)",
        type: "json",
        full: true,
        hint: 'Example: [{"label":"Payload","value":"20 kg"}]',
      },
      { key: "published", label: "Published", type: "bool" },
    ],
    blank: {
      title: "",
      code: "",
      slug: "",
      category: "casting",
      section: "wax-injection-machines",
      sort_order: 100,
      image_url: "",
      gallery_images: [],
      tagline: "",
      description: "",
      highlights: [],
      applications: [],
      specs: [],
      published: true,
    },
  },
  news: {
    table: "news_items",
    order: "sort_order",
    asc: true,
    titleKey: "title",
    description: "Publish company announcements and resource updates.",
    fields: [
      { key: "title", label: "Headline", full: true, required: true },
      { key: "tag", label: "Label" },
      {
        key: "category",
        label: "Topic",
        type: "select",
        options: ["casting", "automation", "robotics"],
      },
      { key: "date_label", label: "Date text" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "image_url", label: "Image URL", full: true },
      { key: "excerpt", label: "Summary", type: "textarea", full: true },
      { key: "body", label: "Full story", type: "richtext", full: true },
      { key: "published", label: "Published", type: "bool" },
    ],
    blank: {
      title: "",
      tag: "News",
      category: "casting",
      date_label: "",
      sort_order: 100,
      image_url: "",
      excerpt: "",
      body: "",
      published: true,
    },
  },
  exhibitions: {
    table: "exhibitions",
    order: "sort_order",
    asc: true,
    titleKey: "title",
    description: "Maintain trade shows, conferences and upcoming events.",
    fields: [
      { key: "title", label: "Event name", full: true, required: true },
      { key: "date_label", label: "Date text" },
      { key: "location", label: "Location" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "image_url", label: "Image URL", full: true },
      { key: "published", label: "Published", type: "bool" },
    ],
    blank: {
      title: "",
      date_label: "",
      location: "",
      sort_order: 100,
      image_url: "",
      published: true,
    },
  },
};

function mergeAdminProductRows(rows: Row[]): Row[] {
  const overrides = new Map(rows.map((row) => [String(row["slug"] ?? ""), row]));
  const builtInRows = functionalities.map((machine, index) => {
    const override = overrides.get(machine.slug);
    overrides.delete(machine.slug);
    return {
      title: machine.title,
      code: machine.code,
      slug: machine.slug,
      category: machineDivision(machine),
      section: machineSection(machine),
      sort_order: (index + 1) * 10,
      tagline: machine.tagline,
      description: machine.desc,
      highlights: machine.highlights,
      applications: machine.applications,
      specs: machine.specs,
      published: true,
      ...override,
      image_url: override?.["image_url"] || machine.image,
      gallery_images:
        Array.isArray(override?.["gallery_images"]) && override["gallery_images"].length > 0
          ? override["gallery_images"]
          : (machine.images ?? []),
      _builtIn: true,
      _hasOverride: Boolean(override),
      _defaultImage: machine.image,
    } satisfies Row;
  });

  const customRows = [...overrides.values()].map((row) => ({
    ...row,
    section:
      row["section"] ??
      (row["category"] === "casting" ? "wax-injection-machines" : "flexible-industrial-automation"),
    gallery_images: row["gallery_images"] ?? [],
    _builtIn: false,
    _hasOverride: false,
  }));

  return [...builtInRows, ...customRows].sort(
    (a, b) => Number(a["sort_order"] ?? 0) - Number(b["sort_order"] ?? 0),
  );
}

function AdminPage() {
  const { section } = Route.useSearch();
  const tab = section ?? "overview";
  const { user, role, demo } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const permissions: Record<typeof role, readonly Tab[]> = {
    admin: [
      "overview",
      "website",
      "posts",
      "products",
      "news",
      "exhibitions",
      "enquiries",
      "team",
      "settings",
    ],
    editor: ["overview", "website", "posts", "products", "news", "exhibitions"],
    sales_manager: ["overview", "enquiries", "team"],
    sales: ["overview", "enquiries"],
  };
  const allowedTabs = permissions[role];
  const visibleTabs = TABS.filter((item) => allowedTabs.includes(item.id));
  const activeTab = allowedTabs.includes(tab) ? tab : "overview";

  function setTab(nextTab: Tab) {
    void navigate({
      to: "/admin",
      search: { section: nextTab === "overview" ? undefined : nextTab },
    });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    if (demo) {
      endDemoSession();
      navigate({ to: LOCAL_ADMIN_BYPASS ? "/" : "/auth", replace: true });
      return;
    }
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-carbon/95 backdrop-blur">
        <div className="mx-auto flex max-w-[90rem] items-center gap-4 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo className="h-7" />
          </Link>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-brand sm:inline">
            / control centre
          </span>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-xs font-medium text-foreground">{user.email}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-brand">
                {role}
                {demo ? " · local demo" : ""}
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition hover:border-brand hover:text-brand"
            >
              <LogOut className="h-3.5 w-3.5" />
              {LOCAL_ADMIN_BYPASS ? "Exit admin" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      {demo && (
        <div className="border-b border-brand/20 bg-brand/5">
          <div className="mx-auto flex max-w-[90rem] items-center gap-3 px-5 py-2.5 text-xs text-muted-foreground sm:px-8">
            <MonitorCog className="h-4 w-4 shrink-0 text-brand" />
            <span>
              <strong className="font-medium text-foreground">Local testing workspace.</strong>{" "}
              Changes stay in this browser and no Supabase requests are made.
            </span>
            <span className="ml-auto hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-brand sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-glow" /> Active
            </span>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[90rem] lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="border-b border-border bg-card/30 p-4 lg:min-h-[calc(100vh-73px)] lg:border-b-0 lg:border-r lg:p-5">
          <nav
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:sticky lg:top-24 lg:grid-cols-1"
            aria-label="Admin sections"
          >
            {visibleTabs.map(({ id, label, description, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={activeTab === id ? "page" : undefined}
                className={`flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  activeTab === id
                    ? "border-brand/50 bg-brand/10 text-foreground shadow-card"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${activeTab === id ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground"}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm font-semibold">{label}</span>
                  <span className="hidden truncate text-[11px] text-muted-foreground lg:block">
                    {description}
                  </span>
                </span>
              </button>
            ))}
            <Link
              to="/"
              className="col-span-2 mt-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition hover:border-brand hover:text-brand sm:col-span-1 lg:col-span-1 lg:mt-4"
            >
              <Eye className="h-4 w-4" /> View website
            </Link>
          </nav>
        </aside>

        <section className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          {activeTab === "overview" ? (
            <DashboardOverview demo={demo} onNavigate={setTab} role={role} />
          ) : activeTab === "website" ? (
            <WebsiteContent demo={demo} />
          ) : activeTab === "enquiries" ? (
            <Enquiries demo={demo} role={role} userId={user.id} />
          ) : activeTab === "team" ? (
            <Team demo={demo} role={role} userId={user.id} />
          ) : activeTab === "settings" ? (
            <Settings demo={demo} />
          ) : (
            <Collection key={activeTab} demo={demo} tab={activeTab} />
          )}
        </section>
      </div>
    </main>
  );
}

function DashboardOverview({
  demo,
  onNavigate,
  role,
}: {
  demo: boolean;
  onNavigate: (tab: Tab) => void;
  role: "admin" | "editor" | "sales_manager" | "sales";
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      if (demo) {
        return {
          posts: getDemoRows("blog_posts"),
          products: getDemoRows("products"),
          news: getDemoRows("news_items"),
          exhibitions: getDemoRows("exhibitions"),
          enquiries: getDemoRows("enquiries") as EnquiryRow[],
        };
      }
      if (role === "sales" || role === "sales_manager") {
        const { data: enquiries, error } = await supabase
          .from("enquiries")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return { posts: [], products: [], news: [], exhibitions: [], enquiries: enquiries ?? [] };
      }
      const [posts, products, news, exhibitions, enquiries] = await Promise.all([
        supabase.from("blog_posts").select("id, published, updated_at"),
        supabase.from("products").select("id, published, updated_at"),
        supabase.from("news_items").select("id, published, updated_at"),
        supabase.from("exhibitions").select("id, published, updated_at"),
        supabase
          .from("enquiries")
          .select("id, name, company, status, created_at")
          .order("created_at", { ascending: false }),
      ]);
      const failure = [posts, products, news, exhibitions, enquiries].find(
        (result) => result.error,
      )?.error;
      if (failure) throw failure;
      return {
        posts: posts.data ?? [],
        products: products.data ?? [],
        news: news.data ?? [],
        exhibitions: exhibitions.data ?? [],
        enquiries: enquiries.data ?? [],
      };
    },
  });

  const cards =
    role === "sales" || role === "sales_manager"
      ? []
      : [
          {
            tab: "posts" as const,
            label: "Blog & articles",
            value: data?.posts.length ?? 0,
            published: data?.posts.filter((item) => item.published).length ?? 0,
            Icon: FileText,
          },
          {
            tab: "products" as const,
            label: "Products",
            value: data?.products.length ?? 0,
            published: data?.products.filter((item) => item.published).length ?? 0,
            Icon: Package,
          },
          {
            tab: "news" as const,
            label: "News items",
            value: data?.news.length ?? 0,
            published: data?.news.filter((item) => item.published).length ?? 0,
            Icon: Newspaper,
          },
          {
            tab: "exhibitions" as const,
            label: "Exhibitions",
            value: data?.exhibitions.length ?? 0,
            published: data?.exhibitions.filter((item) => item.published).length ?? 0,
            Icon: CalendarDays,
          },
        ];
  const newEnquiries = data?.enquiries.filter((item) => item.status === "new") ?? [];
  const salesWorkspace = role === "sales" || role === "sales_manager";

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand">
            / dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Control centre
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {salesWorkspace
              ? "Review incoming leads, record follow-ups and keep every opportunity moving."
              : "Manage public content, review incoming leads and keep the website up to date."}
          </p>
        </div>
        <div className="rounded-full border border-border bg-card px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {newEnquiries.length} new {newEnquiries.length === 1 ? "enquiry" : "enquiries"}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load dashboard data. Please refresh.
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ tab, label, value, published, Icon }) => (
              <button
                key={tab}
                type="button"
                onClick={() => onNavigate(tab)}
                className="group rounded-2xl border border-border bg-card p-5 text-left shadow-card transition hover:-translate-y-1 hover:border-brand/60"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-brand" />
                </div>
                <div className="mt-5 font-display text-3xl font-bold">{value}</div>
                <div className="mt-1 text-sm font-medium">{label}</div>
                <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  {published} published · {value - published} drafts
                </div>
              </button>
            ))}
          </div>

          <div
            className={`mt-8 grid gap-6 ${cards.length ? "xl:grid-cols-[1.2fr_0.8fr]" : "grid-cols-1"}`}
          >
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-display text-lg font-bold">Recent enquiries</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Latest messages from the website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("enquiries")}
                  className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand hover:underline"
                >
                  View all
                </button>
              </div>
              <div className="divide-y divide-border">
                {data?.enquiries.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate("enquiries")}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-secondary/30"
                  >
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${item.status === "new" ? "bg-brand shadow-glow" : "bg-muted-foreground/40"}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {item.name}
                        {item.company ? ` · ${item.company}` : ""}
                      </span>
                      <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString("en-GB")} · {item.status}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
                {data?.enquiries.length === 0 && (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No enquiries yet.
                  </p>
                )}
              </div>
            </section>

            {cards.length > 0 && (
              <section className="rounded-2xl border border-border bg-carbon p-6 shadow-card">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand">
                  / quick actions
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold">Publish something new.</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Jump directly into the content area you need.
                </p>
                <div className="mt-6 grid gap-2">
                  {cards.slice(0, 3).map(({ tab, label, Icon }) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => onNavigate(tab)}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 text-left text-sm transition hover:border-brand/60 hover:text-brand"
                    >
                      <Icon className="h-4 w-4" /> Manage {label.toLowerCase()}{" "}
                      <Plus className="ml-auto h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function WebsiteContent({ demo }: { demo: boolean }) {
  const [pageId, setPageId] = useState(SITE_CONTENT_PAGES[0].id);
  const [values, setValues] = useState<Record<string, string>>(() => getSiteContent(pageId));
  const [savedValues, setSavedValues] = useState<Record<string, string>>(() =>
    getSiteContent(pageId),
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const page = SITE_CONTENT_PAGES.find((item) => item.id === pageId) ?? SITE_CONTENT_PAGES[0];
  const dirty = JSON.stringify(values) !== JSON.stringify(savedValues);
  const previewPaths: Record<string, string> = {
    home: "/",
    about: "/about",
    machines: "/machines",
    news: "/news",
    contact: "/contact",
    divisions: "/divisions",
    solutions: "/solutions",
    industries: "/industries",
    process: "/process",
    global: "/",
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void fetchSiteContent(pageId)
      .then((nextValues) => {
        if (!active) return;
        setValues(nextValues);
        setSavedValues(nextValues);
      })
      .catch((error: unknown) => {
        if (active)
          toast.error(error instanceof Error ? error.message : "Could not load page content.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [pageId]);

  function selectPage(nextPageId: string) {
    if (dirty) {
      toast.error("Save or reset your changes before opening another page.");
      return;
    }
    setPageId(nextPageId);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
            / website editor
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Website Content</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Update key page copy and global contact information.{" "}
            {demo
              ? "Local demo changes stay in this browser."
              : "Published changes are shared across the live website."}
          </p>
        </div>
        <a
          href={previewPaths[pageId]}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition hover:border-brand hover:text-brand"
        >
          <Eye className="h-4 w-4" /> Preview page
        </a>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <nav
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-1"
          aria-label="Website pages"
        >
          {SITE_CONTENT_PAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectPage(item.id)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                pageId === item.id
                  ? "border-brand/50 bg-brand/10"
                  : "border-border bg-card hover:border-brand/40"
              }`}
            >
              <span className="block font-display text-sm font-semibold">{item.label}</span>
              <span className="mt-1 hidden text-[11px] leading-relaxed text-muted-foreground xl:block">
                {item.description}
              </span>
            </button>
          ))}
        </nav>

        <form
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          onSubmit={async (event) => {
            event.preventDefault();
            setSaving(true);
            try {
              await saveSiteContent(pageId, values);
              setSavedValues({ ...values });
              toast.success(`${page.label} updated.`);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Could not save page content.");
            } finally {
              setSaving(false);
            }
          }}
        >
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <h2 className="font-display text-lg font-bold">{page.label}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{page.description}</p>
          </div>
          <fieldset
            disabled={loading || saving}
            className="grid gap-5 p-5 disabled:opacity-60 sm:p-6"
          >
            {page.fields.map((field) => (
              <div key={field.key}>
                <label
                  htmlFor={`site-${pageId}-${field.key}`}
                  className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    id={`site-${pageId}-${field.key}`}
                    rows={4}
                    value={values[field.key] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
                  />
                ) : (
                  <input
                    id={`site-${pageId}-${field.key}`}
                    value={values[field.key] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.key]: event.target.value }))
                    }
                    className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
                  />
                )}
              </div>
            ))}
          </fieldset>
          <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-5 py-4 sm:px-6">
            <span
              className={`text-xs ${dirty ? "font-medium text-brand" : "text-muted-foreground"}`}
            >
              {loading
                ? "Loading content…"
                : dirty
                  ? "Unsaved changes"
                  : demo
                    ? "Saved in this browser"
                    : "Published to the website"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!dirty || loading || saving}
                onClick={() => setValues({ ...savedValues })}
                className="rounded-full border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition hover:border-brand hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={!dirty || loading || saving}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-foreground shadow-glow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{" "}
                Save changes
              </button>
            </div>
          </div>
        </form>
      </div>
      <UnsavedChangesGuard dirty={dirty} />
    </div>
  );
}

function Collection({ tab, demo }: { tab: CollectionTab; demo: boolean }) {
  const schema = SCHEMAS[tab];
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", schema.table],
    queryFn: async () => {
      if (demo) {
        const rows = getDemoRows(schema.table) as Row[];
        return tab === "products" ? mergeAdminProductRows(rows) : rows;
      }
      const { data, error } = await supabase
        .from(schema.table as never)
        .select("*")
        .order(schema.order, { ascending: schema.asc ?? false });
      if (error) throw error;
      const rows = (data ?? []) as Row[];
      return tab === "products" ? mergeAdminProductRows(rows) : rows;
    },
  });

  const save = useMutation({
    mutationFn: async (row: Row) => {
      if (demo) {
        saveDemoRow(schema.table, row);
        return;
      }
      const payload = { ...row };
      delete payload["created_at"];
      delete payload["updated_at"];
      if (payload["_builtIn"] && payload["image_url"] === payload["_defaultImage"]) {
        payload["image_url"] = null;
      }
      for (const key of Object.keys(payload)) {
        if (key.startsWith("_")) delete payload[key];
      }
      const id = payload["id"] as string | undefined;
      delete payload["id"];
      const client = supabase.from(schema.table as never);
      const { error } = id
        ? await client.update(payload as never).eq("id", id)
        : await client.insert(payload as never);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin", schema.table] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (tab === "products") queryClient.invalidateQueries({ queryKey: ["public-machines"] });
      if (tab === "news") queryClient.invalidateQueries({ queryKey: ["public-news"] });
      if (tab === "exhibitions")
        queryClient.invalidateQueries({ queryKey: ["public-exhibitions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (demo) {
        deleteDemoRow(schema.table, id);
        return;
      }
      const { error } = await supabase
        .from(schema.table as never)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Entry deleted");
      setDeleting(null);
      queryClient.invalidateQueries({ queryKey: ["admin", schema.table] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (tab === "products") queryClient.invalidateQueries({ queryKey: ["public-machines"] });
      if (tab === "news") queryClient.invalidateQueries({ queryKey: ["public-news"] });
      if (tab === "exhibitions")
        queryClient.invalidateQueries({ queryKey: ["public-exhibitions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];
  const visibleRows = rows.filter((row) => {
    if (status === "published" && row["published"] === false) return false;
    if (status === "draft" && row["published"] !== false) return false;
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return [row[schema.titleKey], row["slug"], row["category"], row["section"], row["code"]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  const previewUrl = (row: Row) => {
    if (tab === "posts" && row["slug"]) return `/blog/${String(row["slug"])}`;
    if (tab === "products" && row["slug"]) return `/machines/${String(row["slug"])}`;
    if (tab === "news" || tab === "exhibitions") return "/news";
    return null;
  };
  const SectionIcon = TABS.find((item) => item.id === tab)?.Icon ?? FileText;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">/ content</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {TABS.find((t) => t.id === tab)?.label}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {schema.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...schema.blank })}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-foreground shadow-glow transition hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> New entry
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${TABS.find((item) => item.id === tab)?.label.toLowerCase()}...`}
            aria-label="Search entries"
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
          />
        </label>
        <div className="flex gap-2">
          {(["all", "published", "draft"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              aria-pressed={status === value}
              className={`rounded-full border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] transition ${status === value ? "border-brand bg-brand text-brand-foreground" : "border-border text-muted-foreground hover:border-brand/60"}`}
            >
              {value}
            </button>
          ))}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {visibleRows.length} of {rows.length}
        </span>
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load this collection.
          <button
            type="button"
            onClick={() => void refetch()}
            className="ml-3 font-mono text-[10px] uppercase tracking-wider underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {visibleRows.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
              <SectionIcon className="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p className="mt-3 text-sm text-muted-foreground">
                {rows.length === 0
                  ? "Nothing here yet. Add your first entry."
                  : "No entries match your search and filters."}
              </p>
            </div>
          )}
          {visibleRows.map((row) => (
            <div
              key={String(row["id"] ?? row["slug"] ?? row[schema.titleKey])}
              className="group flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition hover:border-brand/40"
            >
              <div className="grid h-14 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-secondary/60 text-muted-foreground">
                {row["cover_url"] || row["image_url"] ? (
                  <img
                    src={String(row["cover_url"] || row["image_url"])}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <SectionIcon className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-[12rem] flex-1">
                <div className="truncate font-display text-base font-semibold transition group-hover:text-brand">
                  {String(row[schema.titleKey] ?? "Untitled")}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                  {Boolean(row["code"]) && <span>{String(row["code"])}</span>}
                  {Boolean(row["category"]) && <span>{String(row["category"])}</span>}
                  {tab === "products" && Boolean(row["section"]) && (
                    <span>
                      {productSectionMeta[String(row["section"]) as ProductSection]?.label ??
                        String(row["section"])}
                    </span>
                  )}
                  {tab === "products" && row["_builtIn"] === true && (
                    <span className={row["_hasOverride"] ? "text-brand" : undefined}>
                      {row["_hasOverride"] ? "Customized" : "Default catalogue"}
                    </span>
                  )}
                  {Boolean(row["date_label"]) && <span>{String(row["date_label"])}</span>}
                  {Boolean(row["updated_at"]) && (
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3 w-3" /> {formatAdminDate(row["updated_at"])}
                    </span>
                  )}
                  {row["pinned"] === true && <span className="text-brand">Pinned</span>}
                </div>
              </div>
              <button
                type="button"
                disabled={save.isPending}
                onClick={() => save.mutate({ ...row, published: row["published"] === false })}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition ${
                  row["published"] === false
                    ? "border-border text-muted-foreground hover:border-brand hover:text-brand"
                    : "border-brand/30 bg-brand/10 text-brand hover:bg-brand/15"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${row["published"] === false ? "bg-muted-foreground" : "bg-brand shadow-glow"}`}
                />
                {row["published"] === false ? "Draft" : "Published"}
              </button>
              {previewUrl(row) && row["published"] !== false && (
                <a
                  href={previewUrl(row) ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground transition hover:border-brand hover:text-brand"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </a>
              )}
              <button
                type="button"
                onClick={() => setEditing({ ...row })}
                className="rounded-full border border-border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition hover:border-brand hover:text-brand"
              >
                Edit
              </button>
              {Boolean(row["id"]) && (
                <button
                  type="button"
                  disabled={remove.isPending}
                  onClick={() => setDeleting(row)}
                  className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive"
                  aria-label={`${row["_builtIn"] ? "Reset" : "Delete"} ${String(row[schema.titleKey] ?? "entry")}`}
                  title={row["_builtIn"] ? "Reset this product to its built-in content" : undefined}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditorDrawer
          fields={schema.fields}
          row={editing}
          busy={save.isPending}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={(row) => {
            const next = { ...row };
            if ("slug" in next && !String(next["slug"] ?? "").trim()) {
              next["slug"] = slugify(String(next["title"] ?? ""));
            }
            const missingField = schema.fields.find(
              (field) => field.required && !String(next[field.key] ?? "").trim(),
            );
            if (missingField) {
              toast.error(`${missingField.label} is required.`);
              return;
            }
            if ("slug" in next && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(next["slug"]))) {
              toast.error("URL slug can only contain lowercase letters, numbers and hyphens.");
              return;
            }
            if (tab === "products") {
              const division = String(next["category"] ?? "");
              const section = String(next["section"] ?? "") as ProductSection;
              if (
                !productSectionMeta[section] ||
                productSectionMeta[section].division !== division
              ) {
                toast.error("Choose a product section that belongs to the selected division.");
                return;
              }
            }
            for (const field of schema.fields.filter((item) => item.type === "json")) {
              if (typeof next[field.key] === "string") {
                try {
                  next[field.key] = JSON.parse(next[field.key] as string);
                  if (!Array.isArray(next[field.key])) throw new Error("Expected an array");
                } catch {
                  toast.error(`${field.label} must be a valid JSON array.`);
                  return;
                }
              }
            }
            save.mutate(next);
          }}
        />
      )}
      {deleting && (
        <DeleteConfirmation
          title={String(deleting[schema.titleKey] ?? "Untitled entry")}
          reset={Boolean(deleting["_builtIn"])}
          busy={remove.isPending}
          onCancel={() => setDeleting(null)}
          onConfirm={() => remove.mutate(String(deleting["id"]))}
        />
      )}
    </div>
  );
}

function DeleteConfirmation({
  title,
  reset = false,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  reset?: boolean;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-carbon/80 p-5 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-title"
      aria-describedby="delete-description"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target && !busy) onCancel();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-deep">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h2 id="delete-title" className="mt-5 font-display text-xl font-bold">
          {reset ? "Reset product changes?" : "Delete this entry?"}
        </h2>
        <p id="delete-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {reset
            ? `“${title}” will return to its built-in catalogue content.`
            : `“${title}” will be permanently removed. This action cannot be undone.`}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-full border border-border px-5 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition hover:border-brand hover:text-foreground disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-destructive px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {reset ? "Reset to default" : "Delete permanently"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditorDrawer({
  fields,
  row,
  busy,
  onChange,
  onClose,
  onSave,
}: {
  fields: FieldDef[];
  row: Row;
  busy: boolean;
  onChange: (row: Row) => void;
  onClose: () => void;
  onSave: (row: Row) => void;
}) {
  const initialValue = useRef(JSON.stringify(row));
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const dirty = JSON.stringify(row) !== initialValue.current;

  const requestClose = useCallback(() => {
    if (busy) return;
    if (dirty) setConfirmDiscard(true);
    else onClose();
  }, [busy, dirty, onClose]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) requestClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [busy, requestClose]);

  useEffect(() => {
    document.documentElement.classList.add("nav-open");
    const protectRefresh = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", protectRefresh);
    return () => {
      document.documentElement.classList.remove("nav-open");
      window.removeEventListener("beforeunload", protectRefresh);
    };
  }, [dirty]);

  function set(key: string, value: unknown) {
    const next = { ...row, [key]: value };
    if (key === "title" && "slug" in row && !row["id"] && !String(row["slug"] ?? "").trim()) {
      next["slug"] = slugify(String(value));
    }
    if (key === "category" && "section" in row) {
      const division = value === "casting" ? "casting" : "robotics";
      const currentSection = String(row["section"] ?? "") as ProductSection;
      if (productSectionMeta[currentSection]?.division !== division) {
        next["section"] = (Object.keys(productSectionMeta) as ProductSection[]).find(
          (section) => productSectionMeta[section].division === division,
        );
      }
    }
    onChange(next);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-carbon/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={row["id"] ? "Edit entry" : "New entry"}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) requestClose();
      }}
    >
      <div
        className={`h-full w-full overflow-y-auto border-l border-border bg-background px-6 shadow-deep sm:px-8 ${fields.some((field) => field.type === "richtext") ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <div className="sticky top-0 z-10 -mx-6 flex items-center justify-between border-b border-border bg-background/95 px-6 py-5 backdrop-blur sm:-mx-8 sm:px-8">
          <div className="min-w-0 pr-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand">
              {row["id"] ? "Editing content" : "Creating content"}
            </p>
            <h2 className="mt-1 truncate font-display text-xl font-bold">
              {row["id"] ? String(row["title"] ?? "Edit entry") : "New entry"}
            </h2>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={requestClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full border border-border transition hover:border-brand hover:text-brand disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {Boolean(row["cover_url"] || row["image_url"]) && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src={String(row["cover_url"] || row["image_url"])}
              alt="Content preview"
              className="aspect-[16/7] w-full object-cover"
            />
          </div>
        )}

        <form
          className="mt-6 grid gap-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(row);
          }}
        >
          {fields.map((f) => {
            const value = row[f.key];
            const wrap =
              f.full || f.type === "textarea" || f.type === "richtext" ? "sm:col-span-2" : "";
            const input =
              "mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2";
            const options =
              f.key === "section"
                ? f.options?.filter((option) => {
                    const optionValue = typeof option === "string" ? option : option.value;
                    return (
                      productSectionMeta[optionValue as ProductSection]?.division ===
                      (row["category"] === "casting" ? "casting" : "robotics")
                    );
                  })
                : f.options;
            return (
              <div key={f.key} className={wrap}>
                {f.type === "bool" ? (
                  <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => set(f.key, e.target.checked)}
                      className="h-4 w-4 accent-[var(--brand)]"
                    />
                    {f.label}
                  </label>
                ) : (
                  <>
                    <label
                      htmlFor={f.key}
                      className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                    >
                      {f.label}
                      {f.required && (
                        <span className="ml-1 text-brand" aria-hidden="true">
                          *
                        </span>
                      )}
                    </label>
                    {f.type === "richtext" ? (
                      <RichTextEditor
                        value={String(value ?? "")}
                        onChange={(nextValue) => set(f.key, nextValue)}
                        onTitle={(title) => {
                          if (!String(row["title"] ?? "").trim()) set("title", title);
                        }}
                      />
                    ) : f.type === "textarea" ? (
                      <textarea
                        id={f.key}
                        required={f.required}
                        rows={f.key === "body" ? 12 : 3}
                        value={String(value ?? "")}
                        onChange={(e) => set(f.key, e.target.value)}
                        className={input}
                      />
                    ) : f.type === "select" ? (
                      <select
                        id={f.key}
                        value={String(value ?? "")}
                        onChange={(e) => set(f.key, e.target.value)}
                        className={input}
                      >
                        {options?.map((option) => {
                          const optionValue = typeof option === "string" ? option : option.value;
                          const optionLabel = typeof option === "string" ? option : option.label;
                          return (
                            <option key={optionValue} value={optionValue}>
                              {optionLabel}
                            </option>
                          );
                        })}
                      </select>
                    ) : f.type === "list" ? (
                      <input
                        id={f.key}
                        value={
                          Array.isArray(value)
                            ? (value as string[]).join(", ")
                            : String(value ?? "")
                        }
                        onChange={(e) =>
                          set(
                            f.key,
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          )
                        }
                        className={input}
                      />
                    ) : f.type === "json" ? (
                      <textarea
                        id={f.key}
                        rows={6}
                        value={
                          typeof value === "string" ? value : JSON.stringify(value ?? [], null, 2)
                        }
                        onChange={(e) => set(f.key, e.target.value)}
                        className={`${input} font-mono text-xs`}
                      />
                    ) : (
                      <input
                        id={f.key}
                        required={f.required}
                        type={f.type === "number" ? "number" : "text"}
                        value={String(value ?? "")}
                        onChange={(e) =>
                          set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                        }
                        className={input}
                      />
                    )}
                    {f.hint && (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                        {f.hint}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}

          <div className="sticky bottom-0 -mx-6 mt-2 flex items-center justify-between border-t border-border bg-background/95 px-6 py-4 backdrop-blur sm:col-span-2 sm:-mx-8 sm:px-8">
            <span className="hidden text-xs text-muted-foreground sm:block">
              Press Esc to close this editor.
            </span>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{" "}
              Save
            </button>
          </div>
        </form>
      </div>
      {confirmDiscard && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-carbon/75 p-5 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-deep"
            role="alertdialog"
            aria-modal="true"
          >
            <AlertTriangle className="h-6 w-6 text-brand" />
            <h3 className="mt-4 font-display text-lg font-bold">Discard unsaved changes?</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Your edits have not been saved and will be lost.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDiscard(false)}
                className="rounded-full border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:border-brand hover:text-foreground"
              >
                Keep editing
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-destructive px-4 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white hover:brightness-110"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RichTextEditor({
  value,
  onChange,
  onTitle,
}: {
  value: string;
  onChange: (value: string) => void;
  onTitle: (title: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [importing, setImporting] = useState(false);

  function insertFormat(prefix: string, suffix = "", placeholder = "text") {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = value.slice(start, end) || placeholder;
    const next = `${value.slice(0, start)}${prefix}${selection}${suffix}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selection.length);
    });
  }

  async function importDocx(file: File) {
    if (!file.name.toLowerCase().endsWith(".docx")) {
      toast.error("Please choose a .docx file.");
      return;
    }
    setImporting(true);
    try {
      const importedModule = await import("mammoth");
      const mammoth = (importedModule.default ?? importedModule) as unknown as {
        convertToMarkdown: (input: { arrayBuffer: ArrayBuffer }) => Promise<{
          value: string;
          messages: Array<{ message: string }>;
        }>;
      };
      const result = await mammoth.convertToMarkdown({ arrayBuffer: await file.arrayBuffer() });
      const markdown = result.value
        .replace(/!\[[^\]]*\]\(data:[^)]+\)/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      if (!markdown) throw new Error("The document did not contain readable text.");
      const firstHeading = markdown
        .split("\n")
        .find((line) => /^#\s+/.test(line))
        ?.replace(/^#\s+/, "")
        .trim();
      if (firstHeading) onTitle(firstHeading);
      onChange(markdown);
      setMode("write");
      toast.success(
        result.messages.length
          ? `DOCX imported with ${result.messages.length} formatting note(s).`
          : "DOCX imported successfully.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not import this DOCX file.");
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const tools = [
    { label: "Heading", Icon: Heading2, action: () => insertFormat("## ", "", "Section title") },
    { label: "Bold", Icon: Bold, action: () => insertFormat("**", "**") },
    { label: "Italic", Icon: Italic, action: () => insertFormat("*", "*") },
    { label: "List", Icon: ListIcon, action: () => insertFormat("- ", "", "List item") },
    { label: "Quote", Icon: Quote, action: () => insertFormat("> ", "", "Quote") },
  ];

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-secondary/20 p-2">
        <div className="flex rounded-lg border border-border bg-background p-0.5">
          {(["write", "preview"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-md px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition ${mode === item ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
        {tools.map(({ label, Icon, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            title={label}
            aria-label={label}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-background hover:text-brand"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <input
          ref={fileRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void importDocx(file);
          }}
        />
        <button
          type="button"
          disabled={importing}
          onClick={() => fileRef.current?.click()}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-brand transition hover:bg-brand/10 disabled:opacity-50"
        >
          {importing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Upload className="h-3.5 w-3.5" />
          )}
          Import DOCX
        </button>
      </div>
      {mode === "write" ? (
        <textarea
          ref={textareaRef}
          rows={18}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            "Write your story here...\n\n## Add section headings\n\nUse short paragraphs for easy reading."
          }
          className="min-h-[28rem] w-full resize-y bg-transparent px-5 py-4 font-mono text-sm leading-7 outline-none"
        />
      ) : (
        <div className="min-h-[28rem] px-5 py-5">
          <MarkdownContent value={value} compact />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
        <span>Markdown formatting · DOCX headings, lists and emphasis are preserved</span>
        <span>{value.trim() ? value.trim().split(/\s+/).length : 0} words</span>
      </div>
    </div>
  );
}

function Enquiries({
  demo,
  role,
  userId,
}: {
  demo: boolean;
  role: "admin" | "editor" | "sales_manager" | "sales";
  userId: string;
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [assignee, setAssignee] = useState("all");
  const { data, isLoading, error, refetch } = useQuery<EnquiryRow[]>({
    queryKey: ["admin", "enquiries"],
    queryFn: async () => {
      if (demo) return getDemoRows("enquiries") as EnquiryRow[];
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as EnquiryRow[];
    },
  });

  const { data: team = [] } = useQuery<TeamMember[]>({
    queryKey: ["admin", "sales-team"],
    enabled: !demo && (role === "admin" || role === "sales_manager"),
    queryFn: async () => {
      const [{ data: profiles, error: profileError }, { data: roles, error: roleError }] =
        await Promise.all([
          supabase.from("profiles").select("id, email, full_name, active"),
          supabase.from("user_roles").select("user_id, role").eq("role", "sales"),
        ]);
      if (profileError || roleError) throw profileError ?? roleError;
      const salesIds = new Set((roles ?? []).map((item) => item.user_id));
      return (profiles ?? [])
        .filter((profile) => salesIds.has(profile.id))
        .map((profile) => ({ ...profile, role: "sales" as const }));
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<EnquiryRow> }) => {
      if (demo) {
        updateDemoRow("enquiries", id, changes);
        return;
      }
      const { error } = await supabase.from("enquiries").update(changes).eq("id", id);
      if (error) throw error;
      const { error: activityError } = await supabase.from("lead_activities").insert({
        enquiry_id: id,
        actor_id: userId,
        action: "updated",
        details: changes,
      });
      if (activityError) console.warn("Lead activity could not be recorded", activityError.message);
    },
    onSuccess: () => {
      toast.success("Enquiry updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const assignment = useMutation({
    mutationFn: async ({
      enquiryId,
      assignedTo,
    }: {
      enquiryId: string;
      assignedTo: string | null;
    }) => {
      if (demo) {
        updateDemoRow("enquiries", enquiryId, { assigned_to: assignedTo });
        return { notified: false };
      }
      return assignLead({ data: { enquiryId, assignedTo } });
    },
    onSuccess: (result) => {
      toast.success(
        result?.notified ? "Lead assigned and sales executive notified." : "Lead assignment saved.",
      );
      queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];
  const statuses = ["new", "contacted", "quoted", "closed"];
  const visibleRows = rows.filter((row) => {
    if (status !== "all" && row.status !== status) return false;
    if (assignee === "unassigned" && row.assigned_to) return false;
    if (assignee !== "all" && assignee !== "unassigned" && row.assigned_to !== assignee)
      return false;
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return [row.name, row.company, row.email, row.phone, row.message]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  function exportCsv() {
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const header = [
      "Created",
      "Name",
      "Company",
      "Email",
      "Phone",
      "Status",
      "Priority",
      "Assigned To",
      "Follow Up",
      "Message",
      "Internal Notes",
    ];
    const lines = visibleRows.map((row) => [
      row.created_at,
      row.name,
      row.company,
      row.email,
      row.phone,
      row.status,
      row.priority,
      team.find((member) => member.id === row.assigned_to)?.email ?? "",
      row.follow_up_at,
      row.message,
      row.internal_notes,
    ]);
    const blob = new Blob(
      [[header, ...lines].map((line) => line.map(escape).join(",")).join("\n")],
      {
        type: "text/csv;charset=utf-8",
      },
    );
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `modtech-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(href);
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">/ pipeline</p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Enquiries</h1>
        <button
          type="button"
          onClick={exportCsv}
          disabled={!visibleRows.length}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition hover:border-brand hover:text-brand disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Review incoming opportunities and move each conversation through the sales pipeline.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(status === item ? "all" : item)}
            aria-pressed={status === item}
            className={`rounded-2xl border p-4 text-left transition ${
              status === item
                ? "border-brand bg-brand/10"
                : "border-border bg-card hover:border-brand/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {item}
              </span>
              <Activity
                className={`h-3.5 w-3.5 ${item === "new" ? "text-brand" : "text-muted-foreground"}`}
              />
            </div>
            <div className="mt-2 font-display text-2xl font-bold">
              {rows.filter((row) => row.status === item).length}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, company, email or message..."
            aria-label="Search enquiries"
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none ring-brand/30 transition focus:border-brand focus:ring-2"
          />
        </label>
        {(role === "admin" || role === "sales_manager") && (
          <select
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            aria-label="Filter by assignee"
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-brand"
          >
            <option value="all">All owners</option>
            <option value="unassigned">Unassigned</option>
            {team.map((member) => (
              <option key={member.id} value={member.id}>
                {member.full_name || member.email}
              </option>
            ))}
          </select>
        )}
        <span className="shrink-0 text-xs text-muted-foreground">
          {visibleRows.length} of {rows.length} leads
        </span>
      </div>
      {isLoading ? (
        <div className="mt-8 space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-card" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertTriangle className="mx-auto h-7 w-7 text-destructive" />
          <p className="mt-3 text-sm text-destructive">Could not load enquiries.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground hover:border-brand hover:text-brand"
          >
            Try again
          </button>
        </div>
      ) : visibleRows.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-3 text-sm text-muted-foreground">
            {rows.length === 0 ? "No enquiries yet." : "No enquiries match your filters."}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {visibleRows.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl border bg-card p-5 shadow-card transition hover:border-brand/40 ${r.status === "new" ? "border-brand/30" : "border-border"}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`h-2 w-2 rounded-full ${r.status === "new" ? "bg-brand shadow-glow" : "bg-muted-foreground/40"}`}
                />
                <div className="font-display text-lg font-semibold">{r.name}</div>
                {r.company && <span className="text-sm text-muted-foreground">· {r.company}</span>}
                <select
                  value={r.status}
                  disabled={update.isPending}
                  onChange={(e) => update.mutate({ id: r.id, changes: { status: e.target.value } })}
                  aria-label={`Status for ${r.name}`}
                  className="ml-auto rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] disabled:opacity-50"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <a
                  href={`mailto:${r.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-brand"
                >
                  <Mail className="h-3 w-3" /> {r.email}
                </a>
                {r.phone && (
                  <a
                    href={`tel:${r.phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-brand"
                  >
                    <Phone className="h-3 w-3" /> {r.phone}
                  </a>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3 w-3" /> {new Date(r.created_at).toLocaleString("en-GB")}
                </span>
              </div>
              <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
                {(role === "admin" || role === "sales_manager") && (
                  <label className="text-xs text-muted-foreground">
                    <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-wider">
                      Owner
                    </span>
                    <select
                      value={r.assigned_to ?? ""}
                      disabled={assignment.isPending}
                      onChange={(event) =>
                        assignment.mutate({
                          enquiryId: r.id,
                          assignedTo: event.target.value || null,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
                    >
                      <option value="">Unassigned</option>
                      {team
                        .filter((member) => member.active)
                        .map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.full_name || member.email}
                          </option>
                        ))}
                    </select>
                  </label>
                )}
                <label className="text-xs text-muted-foreground">
                  <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-wider">
                    Priority
                  </span>
                  <select
                    value={r.priority || "normal"}
                    disabled={update.isPending}
                    onChange={(event) =>
                      update.mutate({ id: r.id, changes: { priority: event.target.value } })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    {["low", "normal", "high", "urgent"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs text-muted-foreground">
                  <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-wider">
                    Next follow-up
                  </span>
                  <input
                    key={r.follow_up_at ?? "no-follow-up"}
                    type="datetime-local"
                    defaultValue={formatDateTimeLocal(r.follow_up_at)}
                    onBlur={(event) => {
                      const nextValue = event.target.value
                        ? new Date(event.target.value).toISOString()
                        : null;
                      if (nextValue === r.follow_up_at) return;
                      update.mutate({
                        id: r.id,
                        changes: { follow_up_at: nextValue },
                      });
                    }}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground"
                  />
                </label>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-secondary/30 p-4 text-sm leading-relaxed text-muted-foreground">
                {r.message}
              </p>
              <label className="mt-3 block">
                <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  Internal sales notes
                </span>
                <textarea
                  defaultValue={r.internal_notes ?? ""}
                  rows={2}
                  placeholder="Add qualification, quotation or next-step notes..."
                  onBlur={(event) => {
                    if (event.target.value !== (r.internal_notes ?? ""))
                      update.mutate({ id: r.id, changes: { internal_notes: event.target.value } });
                  }}
                  className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Team({
  demo,
  role,
  userId,
}: {
  demo: boolean;
  role: "admin" | "editor" | "sales_manager" | "sales";
  userId: string;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "sales" as TeamMember["role"],
  });
  const [resendingId, setResendingId] = useState<string | null>(null);
  const {
    data: members = [],
    isLoading,
    error,
    refetch,
  } = useQuery<TeamMember[]>({
    queryKey: ["admin", "team"],
    queryFn: async () => {
      if (demo) return [];
      const [{ data: profiles, error: profileError }, { data: roles, error: roleError }] =
        await Promise.all([
          supabase.from("profiles").select("id, email, full_name, active").order("created_at"),
          supabase.from("user_roles").select("user_id, role"),
        ]);
      if (profileError || roleError) throw profileError ?? roleError;
      const roleByUser = new Map((roles ?? []).map((item) => [item.user_id, item.role]));
      return (profiles ?? [])
        .filter((profile) => roleByUser.has(profile.id))
        .map((profile) => ({ ...profile, role: roleByUser.get(profile.id)! }));
    },
  });

  const invite = useMutation({
    mutationFn: async () => {
      if (demo) return { warning: "Demo mode does not send email." };
      return inviteTeamMember({
        data: {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
        },
      });
    },
    onSuccess: (result) => {
      if (result.warning) toast.warning(result.warning);
      else toast.success("Team member created and invitation code sent.");
      setForm({ fullName: "", email: "", role: "sales" });
      queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "sales-team"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const manageMember = useMutation({
    mutationFn: async ({
      member,
      changes,
    }: {
      member: TeamMember;
      changes: Partial<TeamMember>;
    }) => {
      if (demo) return { ok: true };
      return updateTeamMember({
        data: {
          userId: member.id,
          role: changes.role ?? member.role,
          active: changes.active ?? member.active,
        },
      });
    },
    onSuccess: () => {
      toast.success("Team access updated.");
      queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "sales-team"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function resendOtp(member: TeamMember) {
    const email = member.email;
    if (!email) return;
    setResendingId(member.id);
    try {
      await requestAuthEmail({ data: { email, flow: "sign_in" } });
      toast.success(`Sign-in code sent to ${email}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the sign-in code.");
    } finally {
      setResendingId(null);
    }
  }

  const roleLabel: Record<TeamMember["role"], string> = {
    admin: "Administrator",
    editor: "Content Editor",
    sales_manager: "Sales Manager",
    sales: "Sales Executive",
  };

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
        / access & ownership
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Team & access</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Add authorised team members. They receive a one-time sign-in code by email; no password
        needs to be shared.
      </p>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold">People & roles</h2>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              {members.length} members
            </span>
          </div>
          {isLoading ? (
            <div className="mt-5 h-32 animate-pulse rounded-xl bg-secondary" />
          ) : error ? (
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 text-sm text-destructive underline"
            >
              Could not load team. Try again.
            </button>
          ) : members.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No team members are visible yet.
            </div>
          ) : (
            <div className="mt-5 divide-y divide-border">
              {members.map((member) => (
                <div key={member.id} className="flex flex-wrap items-center gap-3 py-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 font-display font-bold text-brand">
                    {(member.full_name || member.email || "T").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {member.full_name || "Team member"}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{member.email}</div>
                  </div>
                  {role === "admin" ? (
                    <select
                      value={member.role}
                      disabled={manageMember.isPending || member.id === userId}
                      onChange={(event) =>
                        manageMember.mutate({
                          member,
                          changes: { role: event.target.value as TeamMember["role"] },
                        })
                      }
                      aria-label={`Role for ${member.full_name || member.email}`}
                      title={member.id === userId ? "You cannot change your own role." : undefined}
                      className="rounded-full border border-brand/30 bg-background px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-brand outline-none"
                    >
                      <option value="admin">Administrator</option>
                      <option value="editor">Content Editor</option>
                      <option value="sales_manager">Sales Manager</option>
                      <option value="sales">Sales Executive</option>
                    </select>
                  ) : (
                    <span className="rounded-full border border-brand/30 bg-brand/5 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-brand">
                      {roleLabel[member.role]}
                    </span>
                  )}
                  <span
                    className={`rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider ${member.active ? "border-brand/30 bg-brand/5 text-brand" : "border-destructive/40 bg-destructive/5 text-destructive"}`}
                  >
                    {member.active ? "Active" : "Inactive"}
                  </span>
                  <button
                    type="button"
                    disabled={manageMember.isPending || member.id === userId}
                    onClick={() =>
                      manageMember.mutate({ member, changes: { active: !member.active } })
                    }
                    className={`rounded-full border px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider transition ${member.active ? "border-border text-muted-foreground hover:border-destructive hover:text-destructive" : "border-border text-muted-foreground hover:border-brand hover:text-brand"}`}
                    title={
                      member.id === userId ? "You cannot deactivate your own account." : undefined
                    }
                  >
                    {member.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    disabled={!member.active || resendingId !== null}
                    onClick={() => void resendOtp(member)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resendingId === member.id && <Loader2 className="h-3 w-3 animate-spin" />}
                    Send code
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            invite.mutate();
          }}
          className="h-fit rounded-2xl border border-brand/25 bg-brand/5 p-5"
        >
          <div className="flex items-center gap-2 text-brand">
            <UserPlus className="h-4 w-4" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Add team member</span>
          </div>
          <div className="mt-5 space-y-4">
            <label className="block text-xs text-muted-foreground">
              Full name
              <input
                required
                minLength={2}
                value={form.fullName}
                onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              Work email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
              />
            </label>
            <label className="block text-xs text-muted-foreground">
              Role
              <select
                value={form.role}
                onChange={(event) =>
                  setForm({ ...form, role: event.target.value as TeamMember["role"] })
                }
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-brand"
              >
                <option value="sales">Sales Executive</option>
                {role === "admin" && <option value="admin">Administrator</option>}
                {role === "admin" && <option value="sales_manager">Sales Manager</option>}
                {role === "admin" && <option value="editor">Content Editor</option>}
              </select>
            </label>
          </div>
          <button
            type="submit"
            disabled={invite.isPending}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-brand-foreground disabled:opacity-50"
          >
            {invite.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}{" "}
            Create & send OTP
          </button>
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Supabase generates each secure code and Modtech sends it through Brevo.
          </p>
        </form>
      </div>
    </div>
  );
}

const SETTING_FIELDS: {
  key: string;
  label: string;
  hint: string;
  placeholder: string;
  required?: boolean;
}[] = [
  {
    key: "admin_notify_email",
    label: "Lead notification email",
    hint: "Every new enquiry is emailed here.",
    placeholder: "sales@yourdomain.com",
  },
  {
    key: "sender_email",
    label: "Reply-to email",
    hint: "Customer replies come here. Brevo uses the verified technical sender automatically.",
    placeholder: "info@yourdomain.com",
  },
  {
    key: "sender_name",
    label: "Sender name",
    hint: "Shown as the From name in the inbox.",
    placeholder: "Modtech Machinery",
  },
  {
    key: "site_url",
    label: "Public website URL",
    hint: "Used for branded links in customer and sales emails.",
    placeholder: "https://www.modtechworld.com",
  },
  {
    key: "email_logo_url",
    label: "Email logo URL",
    hint: "Optional full HTTPS URL to a publicly accessible logo. The text logo remains as fallback.",
    placeholder: "https://www.modtechworld.com/modtech-logo.png",
    required: false,
  },
];

function Settings({ demo }: { demo: boolean }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, string> | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      if (demo) {
        return Object.fromEntries(
          getDemoRows("site_settings").map((row) => [String(row["key"]), String(row["value"])]),
        );
      }
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      return Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Record<
        string,
        string
      >;
    },
  });

  useEffect(() => {
    if (data && !form) setForm({ ...data });
  }, [data, form]);

  const save = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      if (demo) {
        saveDemoSettings(values);
        return;
      }
      const rows = SETTING_FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: (_result, values) => {
      toast.success("Email settings saved.");
      setForm({ ...values });
      queryClient.setQueryData(["admin", "settings"], { ...values });
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const values = form ?? data ?? {};
  const dirty = Boolean(form && JSON.stringify(form) !== JSON.stringify(data ?? {}));

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold tracking-tight">Email Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Set where new website enquiries and customer replies are sent. Modtech uses the active,
        verified Brevo sender automatically.
      </p>
      {isLoading ? (
        <div className="mt-8 h-40 animate-pulse rounded-xl bg-card" />
      ) : error ? (
        <div className="mt-8 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Could not load email settings.
          <button
            type="button"
            onClick={() => void refetch()}
            className="ml-3 font-mono text-[10px] uppercase tracking-wider underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      ) : (
        <form
          className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(values);
          }}
        >
          {SETTING_FIELDS.map((f) => (
            <div key={f.key}>
              <label
                className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
                htmlFor={f.key}
              >
                {f.label}
              </label>
              <input
                id={f.key}
                type={f.key.endsWith("_url") ? "url" : f.key.includes("email") ? "email" : "text"}
                required={f.required !== false}
                value={values[f.key] ?? ""}
                placeholder={f.placeholder}
                onChange={(e) => setForm({ ...values, [f.key]: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">{f.hint}</p>
            </div>
          ))}
          <button
            type="submit"
            disabled={save.isPending}
            className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground transition hover:translate-y-[-2px] disabled:opacity-60"
          >
            {save.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}{" "}
            Save settings
          </button>
        </form>
      )}
      <UnsavedChangesGuard dirty={dirty} />
    </div>
  );
}
