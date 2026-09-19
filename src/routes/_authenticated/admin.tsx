import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  Bold,
  CalendarDays,
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
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/cms";
import { BrandLogo } from "@/components/brand-logo";
import { MarkdownContent } from "@/components/markdown-content";
import {
  deleteDemoRow,
  endDemoSession,
  getDemoRows,
  saveDemoRow,
  saveDemoSettings,
  updateDemoRow,
} from "@/lib/demo-admin";
import { getSiteContent, saveSiteContent, SITE_CONTENT_PAGES } from "@/lib/site-content";

export const Route = createFileRoute("/_authenticated/admin")({
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
  | "settings";

const TABS = [
  { id: "overview", label: "Overview", description: "Dashboard", Icon: LayoutDashboard },
  { id: "website", label: "Website Content", description: "Pages & contact text", Icon: Globe2 },
  { id: "posts", label: "Blog & Articles", description: "Editorial content", Icon: FileText },
  { id: "products", label: "Products", description: "Machine catalogue", Icon: Package },
  { id: "news", label: "News", description: "Updates & resources", Icon: Newspaper },
  { id: "exhibitions", label: "Exhibitions", description: "Events calendar", Icon: CalendarDays },
  { id: "enquiries", label: "Enquiries", description: "Sales leads", Icon: Inbox },
  { id: "settings", label: "Email Settings", description: "Notifications", Icon: Settings2 },
] as const;

type Row = Record<string, unknown> & { id?: string };

type EnquiryRow = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
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

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "richtext" | "number" | "bool" | "list" | "select" | "json";
  options?: string[];
  full?: boolean;
  required?: boolean;
  hint?: string;
};

type CollectionTab = Exclude<Tab, "overview" | "website" | "enquiries" | "settings">;

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
    description: "Manage machines and product information shown in the public catalogue.",
    fields: [
      { key: "title", label: "Machine name", full: true, required: true },
      { key: "code", label: "Code", required: true },
      { key: "slug", label: "URL slug", required: true },
      {
        key: "category",
        label: "Division",
        type: "select",
        options: ["casting", "automation", "robotics"],
      },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "image_url", label: "Image URL", full: true },
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
      sort_order: 100,
      image_url: "",
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

function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const { user, role, demo } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    if (demo) {
      endDemoSession();
      navigate({ to: "/auth", replace: true });
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
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition hover:border-brand hover:text-brand"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
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
            {TABS.map(({ id, label, description, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`flex min-w-0 items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  tab === id
                    ? "border-brand/50 bg-brand/10 text-foreground shadow-card"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tab === id ? "bg-brand text-brand-foreground" : "bg-secondary text-muted-foreground"}`}
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
          {tab === "overview" ? (
            <DashboardOverview demo={demo} onNavigate={setTab} />
          ) : tab === "website" ? (
            <WebsiteContent />
          ) : tab === "enquiries" ? (
            <Enquiries demo={demo} />
          ) : tab === "settings" ? (
            <Settings demo={demo} />
          ) : (
            <Collection key={tab} demo={demo} tab={tab} />
          )}
        </section>
      </div>
    </main>
  );
}

function DashboardOverview({
  demo,
  onNavigate,
}: {
  demo: boolean;
  onNavigate: (tab: Tab) => void;
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

  const cards = [
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
            Manage public content, review incoming leads and keep the website up to date.
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

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
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
          </div>
        </>
      )}
    </div>
  );
}

function WebsiteContent() {
  const [pageId, setPageId] = useState(SITE_CONTENT_PAGES[0].id);
  const [values, setValues] = useState<Record<string, string>>(() => getSiteContent(pageId));
  const page = SITE_CONTENT_PAGES.find((item) => item.id === pageId) ?? SITE_CONTENT_PAGES[0];
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
    setValues(getSiteContent(pageId));
  }, [pageId]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">
            / website editor
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Website Content</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Update key page copy and global contact information. Changes appear on the local website
            immediately.
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
              onClick={() => setPageId(item.id)}
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
          onSubmit={(event) => {
            event.preventDefault();
            saveSiteContent(pageId, values);
            toast.success(`${page.label} updated.`);
          }}
        >
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <h2 className="font-display text-lg font-bold">{page.label}</h2>
            <p className="mt-1 text-xs text-muted-foreground">{page.description}</p>
          </div>
          <div className="grid gap-5 p-5 sm:p-6">
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
          </div>
          <div className="flex items-center justify-between border-t border-border bg-secondary/20 px-5 py-4 sm:px-6">
            <span className="text-xs text-muted-foreground">Saved locally for this browser.</span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-foreground shadow-glow transition hover:-translate-y-0.5"
            >
              <Save className="h-4 w-4" /> Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Collection({ tab, demo }: { tab: CollectionTab; demo: boolean }) {
  const schema = SCHEMAS[tab];
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", schema.table],
    queryFn: async () => {
      if (demo) return getDemoRows(schema.table) as Row[];
      const { data, error } = await supabase
        .from(schema.table as never)
        .select("*")
        .order(schema.order, { ascending: schema.asc ?? false });
      if (error) throw error;
      return (data ?? []) as Row[];
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
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", schema.table] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];
  const visibleRows = rows.filter((row) => {
    if (status === "published" && row["published"] === false) return false;
    if (status === "draft" && row["published"] !== false) return false;
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return [row[schema.titleKey], row["slug"], row["category"], row["code"]]
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
          Could not load this collection. Please refresh.
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
              key={String(row["id"])}
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
                onClick={() => setEditing({ ...row })}
                className="rounded-full border border-border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition hover:border-brand hover:text-brand"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this entry?")) remove.mutate(String(row["id"]));
                }}
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
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
            if ("slug" in next && !String(next["slug"] ?? "").trim())
              next["slug"] = slugify(String(next["title"] ?? ""));
            for (const field of schema.fields.filter((item) => item.type === "json")) {
              if (typeof next[field.key] === "string") {
                try {
                  next[field.key] = JSON.parse(next[field.key] as string);
                } catch {
                  toast.error(`${field.label} contains invalid JSON.`);
                  return;
                }
              }
            }
            save.mutate(next);
          }}
        />
      )}
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
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [busy, onClose]);

  function set(key: string, value: unknown) {
    const next = { ...row, [key]: value };
    if (key === "title" && "slug" in row && !row["id"] && !String(row["slug"] ?? "").trim()) {
      next["slug"] = slugify(String(value));
    }
    onChange(next);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-carbon/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={row["id"] ? "Edit entry" : "New entry"}
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
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full border border-border transition hover:border-brand hover:text-brand"
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
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
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

function Enquiries({ demo }: { demo: boolean }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const { data, isLoading } = useQuery<EnquiryRow[]>({
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

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (demo) {
        updateDemoRow("enquiries", id, { status });
        return;
      }
      const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];
  const statuses = ["new", "contacted", "quoted", "closed"];
  const visibleRows = rows.filter((row) => {
    if (status !== "all" && row.status !== status) return false;
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return [row.name, row.company, row.email, row.phone, row.message]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-brand">/ pipeline</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Enquiries</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Review incoming opportunities and move each conversation through the sales pipeline.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(status === item ? "all" : item)}
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
                  onChange={(e) => update.mutate({ id: r.id, status: e.target.value })}
                  className="ml-auto rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
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
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-secondary/30 p-4 text-sm leading-relaxed text-muted-foreground">
                {r.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const SETTING_FIELDS: { key: string; label: string; hint: string; placeholder: string }[] = [
  {
    key: "admin_notify_email",
    label: "Lead notification email",
    hint: "Every new enquiry is emailed here.",
    placeholder: "sales@yourdomain.com",
  },
  {
    key: "sender_email",
    label: "Sender email",
    hint: "Must be a verified sender in your Brevo account.",
    placeholder: "noreply@yourdomain.com",
  },
  {
    key: "sender_name",
    label: "Sender name",
    hint: "Shown as the From name in the inbox.",
    placeholder: "Modtech Machinery",
  },
];

function Settings({ demo }: { demo: boolean }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, string> | null>(null);

  const { data, isLoading } = useQuery({
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
    onSuccess: () => {
      toast.success("Email settings saved.");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const values = form ?? data ?? {};

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold tracking-tight">Email Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Set where new website enquiries are sent, and which verified Brevo sender the emails go out
        from.
      </p>
      {isLoading ? (
        <div className="mt-8 h-40 animate-pulse rounded-xl bg-card" />
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
    </div>
  );
}
