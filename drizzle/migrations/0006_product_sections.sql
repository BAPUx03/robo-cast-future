-- Product taxonomy and editable gallery fields for the admin catalogue.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS section text,
  ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT '{}';

UPDATE public.products
SET category = 'robotics'
WHERE category IN ('automation', 'robotic');

UPDATE public.products
SET section = CASE
  WHEN category = 'casting' AND code LIKE 'WI.%' THEN 'wax-injection-machines'
  WHEN category = 'casting' AND (code LIKE 'WX.%' OR code LIKE 'TK.%') THEN 'wax-processing-conditioning'
  WHEN category = 'casting' AND code LIKE 'WA.%' THEN 'wax-room-automation'
  WHEN category = 'casting' AND code LIKE 'SH.%' THEN 'shelling-solutions'
  WHEN category = 'casting' AND code LIKE 'CI.%' THEN 'ceramic-injectors'
  WHEN category = 'casting' AND code LIKE 'FT.%' THEN 'fettling-equipment'
  WHEN category = 'casting' THEN 'wax-injection-machines'
  WHEN code IN ('RA.01', 'RA.02', 'RA.03') THEN 'end-of-line-packaging'
  ELSE 'flexible-industrial-automation'
END
WHERE section IS NULL OR section NOT IN (
  'wax-injection-machines',
  'wax-processing-conditioning',
  'wax-room-automation',
  'shelling-solutions',
  'ceramic-injectors',
  'fettling-equipment',
  'end-of-line-packaging',
  'flexible-industrial-automation'
);

ALTER TABLE public.products
  ALTER COLUMN section SET DEFAULT 'wax-injection-machines',
  ALTER COLUMN section SET NOT NULL;

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_category_check
  CHECK (category IN ('casting', 'robotics'));

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_section_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_section_check
  CHECK (section IN (
    'wax-injection-machines',
    'wax-processing-conditioning',
    'wax-room-automation',
    'shelling-solutions',
    'ceramic-injectors',
    'fettling-equipment',
    'end-of-line-packaging',
    'flexible-industrial-automation'
  ));

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_section_division_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_section_division_check
  CHECK (
    (
      category = 'casting'
      AND section IN (
        'wax-injection-machines',
        'wax-processing-conditioning',
        'wax-room-automation',
        'shelling-solutions',
        'ceramic-injectors',
        'fettling-equipment'
      )
    )
    OR
    (
      category = 'robotics'
      AND section IN (
        'end-of-line-packaging',
        'flexible-industrial-automation'
      )
    )
  );
