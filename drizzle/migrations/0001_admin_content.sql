-- Shared page copy edited from the admin control centre.
CREATE TABLE IF NOT EXISTS public.site_content (
  page_id text PRIMARY KEY,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_content' AND policyname = 'public read site content'
  ) THEN
    CREATE POLICY "public read site content" ON public.site_content
      FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_content' AND policyname = 'staff manage site content'
  ) THEN
    CREATE POLICY "staff manage site content" ON public.site_content
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
      WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
  END IF;
END $$;

DROP TRIGGER IF EXISTS site_content_touch ON public.site_content;
CREATE TRIGGER site_content_touch BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Email delivery settings used by the enquiry workflow.
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'staff manage site settings'
  ) THEN
    CREATE POLICY "staff manage site settings" ON public.site_settings
      FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DROP TRIGGER IF EXISTS site_settings_touch ON public.site_settings;
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
