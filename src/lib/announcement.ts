import { supabase } from "@/integrations/supabase/client";
import { DEMO_MODE, getDemoRows } from "@/lib/demo-admin";

export type Announcement = {
  id: number;
  message: string;
  redirect_url: string;
  is_visible: boolean;
  active_until: string | null;
  updated_at?: string;
};

export const DEFAULT_ANNOUNCEMENT: Announcement = {
  id: 1,
  message:
    "Engineering manufacturing systems since 1990 — Investment Casting Machines & Robotic Automation",
  redirect_url: "/contact",
  is_visible: true,
  active_until: null,
};

export function isAnnouncementActive(
  announcement: Announcement | null | undefined,
  now = Date.now(),
) {
  if (!announcement?.is_visible || !announcement.message.trim()) return false;
  if (!announcement.active_until) return true;
  const end = new Date(announcement.active_until).getTime();
  return Number.isFinite(end) && end > now;
}

export function safeAnnouncementUrl(value: string) {
  const url = value.trim();
  if (!url) return undefined;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return undefined;
}

export async function fetchPublicAnnouncement(): Promise<Announcement | null> {
  if (DEMO_MODE) {
    const row = getDemoRows("announcement_bar")[0] as unknown as Announcement | undefined;
    const announcement = row ?? DEFAULT_ANNOUNCEMENT;
    return isAnnouncementActive(announcement) ? announcement : null;
  }

  const { data, error } = await supabase
    .from("announcement_bar")
    .select("id, message, redirect_url, is_visible, active_until, updated_at")
    .eq("id", 1)
    .maybeSingle();

  if (error) return DEFAULT_ANNOUNCEMENT;
  return data && isAnnouncementActive(data) ? data : null;
}
