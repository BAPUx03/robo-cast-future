ALTER TABLE public.blog_posts
  ALTER COLUMN author SET DEFAULT 'Modtech Machine';

UPDATE public.blog_posts
SET
  title = replace(title, 'Modtech Machinery', 'Modtech Machine'),
  excerpt = replace(excerpt, 'Modtech Machinery', 'Modtech Machine'),
  body = replace(body, 'Modtech Machinery', 'Modtech Machine'),
  author = replace(author, 'Modtech Machinery', 'Modtech Machine')
WHERE title LIKE '%Modtech Machinery%'
   OR excerpt LIKE '%Modtech Machinery%'
   OR body LIKE '%Modtech Machinery%'
   OR author LIKE '%Modtech Machinery%';

UPDATE public.news_items
SET
  title = replace(title, 'Modtech Machinery', 'Modtech Machine'),
  excerpt = replace(excerpt, 'Modtech Machinery', 'Modtech Machine'),
  body = replace(body, 'Modtech Machinery', 'Modtech Machine')
WHERE title LIKE '%Modtech Machinery%'
   OR excerpt LIKE '%Modtech Machinery%'
   OR body LIKE '%Modtech Machinery%';

UPDATE public.products
SET
  title = replace(title, 'Modtech Machinery', 'Modtech Machine'),
  tagline = replace(tagline, 'Modtech Machinery', 'Modtech Machine'),
  description = replace(description, 'Modtech Machinery', 'Modtech Machine')
WHERE title LIKE '%Modtech Machinery%'
   OR tagline LIKE '%Modtech Machinery%'
   OR description LIKE '%Modtech Machinery%';

UPDATE public.exhibitions
SET
  title = replace(title, 'Modtech Machinery', 'Modtech Machine'),
  location = replace(location, 'Modtech Machinery', 'Modtech Machine')
WHERE title LIKE '%Modtech Machinery%'
   OR location LIKE '%Modtech Machinery%';

UPDATE public.gallery_items
SET
  title = replace(title, 'Modtech Machinery', 'Modtech Machine'),
  alt_text = replace(alt_text, 'Modtech Machinery', 'Modtech Machine'),
  caption = replace(caption, 'Modtech Machinery', 'Modtech Machine'),
  location = replace(location, 'Modtech Machinery', 'Modtech Machine')
WHERE title LIKE '%Modtech Machinery%'
   OR alt_text LIKE '%Modtech Machinery%'
   OR caption LIKE '%Modtech Machinery%'
   OR location LIKE '%Modtech Machinery%';

UPDATE public.site_settings
SET value = 'Modtech Machine'
WHERE key = 'sender_name'
  AND value = 'Modtech Machinery';
