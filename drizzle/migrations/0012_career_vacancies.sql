-- Publish career openings without collecting applicant data on the website.
CREATE TABLE public.career_vacancies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 160),
  openings integer NOT NULL CHECK (openings > 0),
  qualification text NOT NULL CHECK (length(trim(qualification)) BETWEEN 1 AND 300),
  experience text NOT NULL CHECK (length(trim(experience)) BETWEEN 1 AND 160),
  sort_order integer NOT NULL DEFAULT 100,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.career_vacancies TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.career_vacancies TO authenticated;
GRANT ALL ON public.career_vacancies TO service_role;
ALTER TABLE public.career_vacancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read published career vacancies" ON public.career_vacancies
  FOR SELECT TO anon, authenticated
  USING (
    published
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
  );

CREATE POLICY "staff manage career vacancies" ON public.career_vacancies
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER career_vacancies_touch BEFORE UPDATE ON public.career_vacancies
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX career_vacancies_public_order_idx
  ON public.career_vacancies (published, sort_order, created_at DESC);
