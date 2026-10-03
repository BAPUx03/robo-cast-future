-- Public office, facility and factory gallery managed from the control centre.
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'facility',
  location text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  alt_text text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gallery_items_category_check
    CHECK (category IN ('office', 'facility', 'factory', 'team', 'events'))
);

GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read gallery items" ON public.gallery_items
  FOR SELECT TO anon USING (published);

CREATE POLICY "authed read gallery items" ON public.gallery_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "staff manage gallery items" ON public.gallery_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER gallery_items_touch
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX gallery_items_public_order_idx
  ON public.gallery_items (published, sort_order, created_at DESC);
