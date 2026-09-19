import { supabase } from "@/integrations/supabase/client";
import { getDemoRows } from "@/lib/demo-admin";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  category: string;
  kind: string;
  tags: string[];
  author: string;
  read_minutes: number;
  pinned: boolean;
  published: boolean;
  published_at: string;
};

export const CATEGORY_LABELS: Record<string, string> = {
  casting: "Investment Casting",
  automation: "Automation",
  robotics: "Robotics",
  company: "Company",
};

export const KIND_LABELS: Record<string, string> = {
  blog: "Blog",
  article: "Article",
  news: "News",
  case_study: "Case Study",
};

export async function fetchPublishedPosts() {
  if (import.meta.env.DEV) {
    return (getDemoRows("blog_posts") as BlogPost[])
      .filter((post) => post.published)
      .sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned) ||
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
      );
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function fetchPostBySlug(slug: string) {
  if (import.meta.env.DEV) {
    return (
      (getDemoRows("blog_posts") as BlogPost[]).find(
        (post) => post.slug === slug && post.published,
      ) ?? null
    );
  }
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as BlogPost | null) ?? null;
}

export async function fetchAllPosts() {
  if (import.meta.env.DEV) return getDemoRows("blog_posts") as BlogPost[];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
