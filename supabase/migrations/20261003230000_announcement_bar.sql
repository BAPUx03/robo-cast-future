-- Public announcement bar managed from the admin control centre.
CREATE TABLE IF NOT EXISTS public.announcement_bar (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  message text NOT NULL DEFAULT '',
  redirect_url text NOT NULL DEFAULT '',
  is_visible boolean NOT NULL DEFAULT true,
  active_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.announcement_bar TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.announcement_bar TO authenticated;
GRANT ALL ON public.announcement_bar TO service_role;
ALTER TABLE public.announcement_bar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active announcement" ON public.announcement_bar
  FOR SELECT TO anon, authenticated USING (
    is_visible AND (active_until IS NULL OR active_until > now())
  );

CREATE POLICY "admins manage announcement" ON public.announcement_bar
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS announcement_bar_touch ON public.announcement_bar;
CREATE TRIGGER announcement_bar_touch BEFORE UPDATE ON public.announcement_bar
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.announcement_bar (id, message, redirect_url, is_visible)
VALUES (
  1,
  'Engineering manufacturing systems since 1990 — Investment Casting Machines & Robotic Automation',
  '/contact',
  true
)
ON CONFLICT (id) DO NOTHING;
