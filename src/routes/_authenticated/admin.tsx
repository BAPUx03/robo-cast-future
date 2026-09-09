import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/cms";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Modtech Machinery" },
      { name: "description", content: "Manage blog posts, products, news, exhibitions and enquiries for Modtech Machinery." },
      { property: "og:title", content: "Modtech Machinery Admin" },
      { property: "og:description", content: "Content management for the Modtech Machinery website." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Tab = "posts" | "products" | "news" | "exhibitions" | "enquiries";

const TABS: { id: Tab; label: string }[] = [
  { id: "posts", label: "Blog & Articles" },
  { id: "products", label: "Products" },
  { id: "news", label: "News" },
  { id: "exhibitions", label: "Exhibitions" },
  { id: "enquiries", label: "Enquiries" },
];

type Row = Record<string, unknown> & { id?: string };

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "bool" | "list" | "select";
  options?: string[];
  full?: boolean;
};

const SCHEMAS: Record<Exclude<Tab, "enquiries">, { table: string; order: string; asc?: boolean; titleKey: string; fields: FieldDef[]; blank: Row }> = {
  posts: {
    table: "blog_posts",
    order: "published_at",
    titleKey: "title",
    fields: [
      { key: "title", label: "Title", full: true },
      { key: "slug", label: "URL slug" },
      { key: "kind", label: "Type", type: "select", options: ["blog", "article", "news", "case_study"] },
      { key: "category", label: "Topic", type: "select", options: ["casting", "automation", "robotics", "company"] },
      { key: "author", label: "Author" },
      { key: "read_minutes", label: "Read minutes", type: "number" },
      { key: "cover_url", label: "Cover image URL", full: true },
      { key: "excerpt", label: "Short summary", type: "textarea", full: true },
      { key: "body", label: "Full content", type: "textarea", full: true },
      { key: "tags", label: "Tags (comma separated)", type: "list", full: true },
      { key: "pinned", label: "Pinned", type: "bool" },
      { key: "published", label: "Published", type: "bool" },
    ],
    blank: { title: "", slug: "", kind: "blog", category: "casting", author: "Modtech Machinery", read_minutes: 4, cover_url: "", excerpt: "", body: "", tags: [], pinned: false, published: true },
  },
  products: {
    table: "products",
    order: "sort_order",
    asc: true,
    titleKey: "title",
    fields: [
      { key: "title", label: "Machine name", full: true },
      { key: "code", label: "Code" },
      { key: "slug", label: "URL slug" },
      { key: "category", label: "Division", type: "select", options: ["casting", "automation", "robotics"] },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "image_url", label: "Image URL", full: true },
      { key: "tagline", label: "Tagline", full: true },
      { key: "description", label: "Description", type: "textarea", full: true },
      { key: "highlights", label: "Highlights (comma separated)", type: "list", full: true },
      { key: "applications", label: "Applications (comma separated)", type: "list", full: true },
      { key: "published", label: "Published", type: "bool" },
    ],
    blank: { title: "", code: "", slug: "", category: "casting", sort_order: 100, image_url: "", tagline: "", description: "", highlights: [], applications: [], published: true },
  },
  news: {
    table: "news_items",
    order: "sort_order",
    asc: true,
    titleKey: "title",
    fields: [
      { key: "title", label: "Headline", full: true },
      { key: "tag", label: "Label" },
      { key: "category", label: "Topic", type: "select", options: ["casting", "automation", "robotics"] },
      { key: "date_label", label: "Date text" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "image_url", label: "Image URL", full: true },
      { key: "excerpt", label: "Summary", type: "textarea", full: true },
      { key: "published", label: "Published", type: "bool" },
    ],
    blank: { title: "", tag: "News", category: "casting", date_label: "", sort_order: 100, image_url: "", excerpt: "", published: true },
  },
  exhibitions: {
    table: "exhibitions",
    order: "sort_order",
    asc: true,
    titleKey: "title",
    fields: [
      { key: "title", label: "Event name", full: true },
      { key: "date_label", label: "Date text" },
      { key: "location", label: "Location" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "image_url", label: "Image URL", full: true },
      { key: "published", label: "Published", type: "bool" },
    ],
    blank: { title: "", date_label: "", location: "", sort_order: 100, image_url: "", published: true },
  },
};

function AdminPage() {
  const [tab, setTab] = useState<Tab>("posts");
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    supabase.rpc("claim_admin");
  }, []);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-carbon/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo className="h-7" />
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand">/ admin</span>
          <div className="ml-auto flex items-center gap-4">
            {email && <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>}
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition hover:border-brand hover:text-brand">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3 sm:px-8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition ${
                tab === t.id ? "border-brand bg-brand text-brand-foreground" : "border-border text-muted-foreground hover:border-brand/60 hover:text-foreground"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {tab === "enquiries" ? <Enquiries /> : <Collection tab={tab} />}
      </div>
    </main>
  );
}

function Collection({ tab }: { tab: Exclude<Tab, "enquiries"> }) {
  const schema = SCHEMAS[tab];
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", schema.table],
    queryFn: async () => {
      const { data, error } = await supabase.from(schema.table as never).select("*").order(schema.order, { ascending: schema.asc ?? false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (row: Row) => {
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(schema.table as never).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", schema.table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold tracking-tight">{TABS.find((t) => t.id === tab)?.label}</h1>
        <button onClick={() => setEditing({ ...schema.blank })}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-foreground shadow-glow transition hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> New entry
        </button>
      </div>

      {isLoading ? (
        <div className="mt-8 space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-card" />)}</div>
      ) : (
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {rows.length === 0 && <p className="p-6 text-sm text-muted-foreground">Nothing here yet. Add your first entry.</p>}
          {rows.map((row) => (
            <div key={String(row["id"])} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm font-semibold">{String(row[schema.titleKey] ?? "Untitled")}</div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {row["published"] === false ? "Draft" : "Published"}
                  {row["pinned"] === true ? " · Pinned" : ""}
                </div>
              </div>
              <button onClick={() => setEditing({ ...row })} className="rounded-full border border-border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition hover:border-brand hover:text-brand">Edit</button>
              <button
                onClick={() => { if (confirm("Delete this entry?")) remove.mutate(String(row["id"])); }}
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
            if ("slug" in next && !String(next["slug"] ?? "").trim()) next["slug"] = slugify(String(next["title"] ?? ""));
            save.mutate(next);
          }}
        />
      )}
    </div>
  );
}

function EditorDrawer({
  fields, row, busy, onChange, onClose, onSave,
}: {
  fields: FieldDef[];
  row: Row;
  busy: boolean;
  onChange: (row: Row) => void;
  onClose: () => void;
  onSave: (row: Row) => void;
}) {
  function set(key: string, value: unknown) {
    onChange({ ...row, [key]: value });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-carbon/70 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-border bg-background p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{row["id"] ? "Edit entry" : "New entry"}</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-border transition hover:border-brand hover:text-brand">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="mt-6 grid gap-5 sm:grid-cols-2"
          onSubmit={(e) => { e.preventDefault(); onSave(row); }}
        >
          {fields.map((f) => {
            const value = row[f.key];
            const wrap = f.full || f.type === "textarea" ? "sm:col-span-2" : "";
            const input = "mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none ring-brand/40 transition focus:border-brand focus:ring-2";
            return (
              <div key={f.key} className={wrap}>
                {f.type === "bool" ? (
                  <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                    <input type="checkbox" checked={Boolean(value)} onChange={(e) => set(f.key, e.target.checked)} className="h-4 w-4 accent-[var(--brand)]" />
                    {f.label}
                  </label>
                ) : (
                  <>
                    <label htmlFor={f.key} className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{f.label}</label>
                    {f.type === "textarea" ? (
                      <textarea id={f.key} rows={f.key === "body" ? 12 : 3} value={String(value ?? "")} onChange={(e) => set(f.key, e.target.value)} className={input} />
                    ) : f.type === "select" ? (
                      <select id={f.key} value={String(value ?? "")} onChange={(e) => set(f.key, e.target.value)} className={input}>
                        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === "list" ? (
                      <input id={f.key} value={Array.isArray(value) ? (value as string[]).join(", ") : String(value ?? "")}
                        onChange={(e) => set(f.key, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className={input} />
                    ) : (
                      <input id={f.key} type={f.type === "number" ? "number" : "text"} value={String(value ?? "")}
                        onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)} className={input} />
                    )}
                  </>
                )}
              </div>
            );
          })}

          <div className="sm:col-span-2">
            <button type="submit" disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-brand-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Enquiries() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = data ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">Enquiries</h1>
      {isLoading ? (
        <div className="mt-8 space-y-3">{[0, 1].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-card" />)}</div>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No enquiries yet.</p>
      ) : (
        <div className="mt-8 grid gap-4">
          {rows.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="font-display text-base font-semibold">{r.name}</div>
                {r.company && <span className="text-sm text-muted-foreground">· {r.company}</span>}
                <select
                  value={r.status}
                  onChange={(e) => update.mutate({ id: r.id, status: e.target.value })}
                  className="ml-auto rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
                >
                  {["new", "contacted", "quoted", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <a href={`mailto:${r.email}`} className="hover:text-brand">{r.email}</a>
                {r.phone && <a href={`tel:${r.phone}`} className="hover:text-brand">{r.phone}</a>}
                <span>{new Date(r.created_at).toLocaleString("en-GB")}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
