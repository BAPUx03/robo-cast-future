-- Structured machine specifications, source traceability and gallery captions.
-- Existing rows keep their current public content; built-in catalogue values remain
-- the fallback until an editor saves a verified override.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS specification_tables jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS specification_status text NOT NULL DEFAULT 'project-specific',
  ADD COLUMN IF NOT EXISTS specification_note text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS official_source_url text,
  ADD COLUMN IF NOT EXISTS datasheet_url text,
  ADD COLUMN IF NOT EXISTS gallery_captions text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_specification_tables_array_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_specification_tables_array_check
  CHECK (jsonb_typeof(specification_tables) = 'array');

ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_specification_status_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_specification_status_check
  CHECK (specification_status IN ('verified', 'project-specific', 'source-review'));
