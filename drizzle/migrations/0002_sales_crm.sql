-- Sales CRM, role-based access and audit history.
-- Apply after 0000_create_cms_tables.sql and 0001_admin_content.sql.

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'sales';

CREATE OR REPLACE FUNCTION public.has_role_name(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = _role
  );
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS internal_notes text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS follow_up_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'enquiries_priority_check'
  ) THEN
    ALTER TABLE public.enquiries ADD CONSTRAINT enquiries_priority_check
      CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS enquiries_assigned_to_idx ON public.enquiries (assigned_to);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON public.enquiries (status);
CREATE INDEX IF NOT EXISTS enquiries_follow_up_at_idx ON public.enquiries (follow_up_at);

DROP TRIGGER IF EXISTS enquiries_touch ON public.enquiries;
CREATE TRIGGER enquiries_touch BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_activities_enquiry_idx
  ON public.lead_activities (enquiry_id, created_at DESC);

GRANT SELECT, INSERT ON public.lead_activities TO authenticated;
GRANT ALL ON public.lead_activities TO service_role;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- Team directory: admins see everyone; sales managers see sales users; users see themselves.
DROP POLICY IF EXISTS "own profile read" ON public.profiles;
CREATE POLICY "role based profile read" ON public.profiles FOR SELECT TO authenticated USING (
  auth.uid() = id
  OR public.has_role_name(auth.uid(), 'admin')
  OR (
    public.has_role_name(auth.uid(), 'sales_manager')
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = profiles.id AND ur.role::text = 'sales'
    )
  )
);

DROP POLICY IF EXISTS "read own roles" ON public.user_roles;
CREATE POLICY "read permitted roles" ON public.user_roles FOR SELECT TO authenticated USING (
  user_id = auth.uid()
  OR public.has_role_name(auth.uid(), 'admin')
  OR (
    public.has_role_name(auth.uid(), 'sales_manager')
    AND role::text = 'sales'
  )
);

-- Leads: managers/admins see all; executives see only assigned records.
DROP POLICY IF EXISTS "staff read enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "staff update enquiries" ON public.enquiries;
CREATE POLICY "sales read enquiries" ON public.enquiries FOR SELECT TO authenticated USING (
  public.has_role_name(auth.uid(), 'admin')
  OR public.has_role_name(auth.uid(), 'sales_manager')
  OR (public.has_role_name(auth.uid(), 'sales') AND assigned_to = auth.uid())
);
CREATE POLICY "sales update enquiries" ON public.enquiries FOR UPDATE TO authenticated USING (
  public.has_role_name(auth.uid(), 'admin')
  OR public.has_role_name(auth.uid(), 'sales_manager')
  OR (public.has_role_name(auth.uid(), 'sales') AND assigned_to = auth.uid())
) WITH CHECK (
  public.has_role_name(auth.uid(), 'admin')
  OR public.has_role_name(auth.uid(), 'sales_manager')
  OR (public.has_role_name(auth.uid(), 'sales') AND assigned_to = auth.uid())
);

DROP POLICY IF EXISTS "admins delete enquiries" ON public.enquiries;
CREATE POLICY "admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated USING (
  public.has_role_name(auth.uid(), 'admin')
);

CREATE POLICY "sales read lead activity" ON public.lead_activities FOR SELECT TO authenticated USING (
  public.has_role_name(auth.uid(), 'admin')
  OR public.has_role_name(auth.uid(), 'sales_manager')
  OR EXISTS (
    SELECT 1 FROM public.enquiries e
    WHERE e.id = lead_activities.enquiry_id AND e.assigned_to = auth.uid()
  )
);

CREATE POLICY "sales add lead activity" ON public.lead_activities FOR INSERT TO authenticated WITH CHECK (
  actor_id = auth.uid()
  AND (
    public.has_role_name(auth.uid(), 'admin')
    OR public.has_role_name(auth.uid(), 'sales_manager')
    OR EXISTS (
      SELECT 1 FROM public.enquiries e
      WHERE e.id = lead_activities.enquiry_id AND e.assigned_to = auth.uid()
    )
  )
);

-- Keep profile records in sync with Supabase Auth users.
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT OR UPDATE OF email, raw_user_meta_data ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', '')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Only content roles may read unpublished content. Existing write policies remain unchanged.
DROP POLICY IF EXISTS "authed read products" ON public.products;
CREATE POLICY "authed read products" ON public.products FOR SELECT TO authenticated USING (
  published OR public.has_role_name(auth.uid(), 'admin') OR public.has_role_name(auth.uid(), 'editor')
);
DROP POLICY IF EXISTS "authed read news" ON public.news_items;
CREATE POLICY "authed read news" ON public.news_items FOR SELECT TO authenticated USING (
  published OR public.has_role_name(auth.uid(), 'admin') OR public.has_role_name(auth.uid(), 'editor')
);
DROP POLICY IF EXISTS "authed read exhibitions" ON public.exhibitions;
CREATE POLICY "authed read exhibitions" ON public.exhibitions FOR SELECT TO authenticated USING (
  published OR public.has_role_name(auth.uid(), 'admin') OR public.has_role_name(auth.uid(), 'editor')
);
