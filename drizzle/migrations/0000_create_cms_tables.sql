-- roles
CREATE TYPE public.app_role AS ENUM ('admin','editor');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile write" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- first signed-in user can claim admin when no admin exists yet
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE has_admin boolean;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO has_admin;
  IF has_admin THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (auth.uid(), 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- blog posts
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  cover_url text,
  category text NOT NULL DEFAULT 'casting',
  kind text NOT NULL DEFAULT 'blog',
  tags text[] NOT NULL DEFAULT '{}',
  author text NOT NULL DEFAULT 'Modtech Machinery',
  read_minutes int NOT NULL DEFAULT 4,
  pinned boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published posts" ON public.blog_posts FOR SELECT TO anon USING (published);
CREATE POLICY "authed read posts" ON public.blog_posts FOR SELECT TO authenticated USING (published OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "staff manage posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER blog_posts_touch BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- products / machines
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'casting',
  image_url text,
  highlights text[] NOT NULL DEFAULT '{}',
  applications text[] NOT NULL DEFAULT '{}',
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read products" ON public.products FOR SELECT TO anon USING (published);
CREATE POLICY "authed read products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER products_touch BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- news
CREATE TABLE public.news_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT 'News',
  category text NOT NULL DEFAULT 'casting',
  date_label text NOT NULL DEFAULT '',
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_items TO authenticated;
GRANT ALL ON public.news_items TO service_role;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read news" ON public.news_items FOR SELECT TO anon USING (published);
CREATE POLICY "authed read news" ON public.news_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage news" ON public.news_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER news_touch BEFORE UPDATE ON public.news_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- exhibitions
CREATE TABLE public.exhibitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date_label text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.exhibitions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exhibitions TO authenticated;
GRANT ALL ON public.exhibitions TO service_role;
ALTER TABLE public.exhibitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read exhibitions" ON public.exhibitions FOR SELECT TO anon USING (published);
CREATE POLICY "authed read exhibitions" ON public.exhibitions FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff manage exhibitions" ON public.exhibitions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER exhibitions_touch BEFORE UPDATE ON public.exhibitions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- enquiries
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can submit" ON public.enquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "authed can submit" ON public.enquiries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "staff read enquiries" ON public.enquiries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "staff update enquiries" ON public.enquiries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE POLICY "admins delete enquiries" ON public.enquiries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- seed news
INSERT INTO public.news_items (title, excerpt, tag, category, date_label, image_url, sort_order) VALUES
('Inside the MTW-300 wax injector & pour cell','Servo clamp control, integrated conditioning tanks and a robotic pour cell engineered for repeatable quality.','Casting','casting','JAN 2025','/products/news-casting-pour.jpg',1),
('Six-axis welding cell deployed for a Tier-1 supplier','How a robotic welding cell raised yield by 28% and cut cycle time across the wax-to-shell process.','Robotic','robotic','MAR 2025','/products/news-robotic-cell.jpg',2),
('PLC-driven shelling line with vision-based QC','Modular conveyor + vision pipeline delivers hands-off shell building with closed-loop process control.','Automation','automation','FEB 2025','/products/news-automation-line.jpg',3);

-- seed exhibitions
INSERT INTO public.exhibitions (title, date_label, location, image_url, sort_order) VALUES
('ICI 71st Technical Conference & Equipment Expo','Oct 2024','Covington, KY · USA','https://www.modtechworld.com/storage/exhibitions/May2025/vQYP3JHX80GSroJGgtEo.jpg',1),
('International Foundry Trade Fair','Mar 2025','Düsseldorf · Germany','https://www.modtechworld.com/storage/exhibitions/May2025/2mIAsEaS12gbw0p6BlrS.JPG',2),
('Investment Casting Institute Expo','May 2025','Atlanta, GA · USA','https://www.modtechworld.com/storage/exhibitions/May2025/Ja9xzivUV0GVe6ITg6zS.jpg',3),
('IFEX — India Foundry Congress','Feb 2025','Greater Noida · India','https://www.modtechworld.com/storage/exhibitions/May2025/OQu3Z5bMVPEuE6aW7Eo9.png',4),
('EUROGUSS Foundry Show','Jul 2025','Nuremberg · Germany','https://www.modtechworld.com/storage/exhibitions/July2025/42mZaBVQsgrHVTXpAXb3.jpg',5);

-- seed blog posts
INSERT INTO public.blog_posts (slug, title, excerpt, body, cover_url, category, kind, tags, read_minutes, pinned, published_at) VALUES
('choosing-the-right-wax-injector','How to choose the right wax injector for your foundry','Clamp force, daylight, shot volume and control strategy — a practical buying guide for pattern shops.',
'Selecting a wax injector starts with the part, not the machine. Map your largest pattern, then work backwards to clamp force, daylight and shot volume.

## 1. Size the clamp force
Deep-draw and IGT-class patterns need rigid 4-pillar frames and 60T–300T clamp force. Smaller automotive and medical patterns are usually well served by an open C-frame press at 30T–150T, which is far quicker to change over.

## 2. Control the wax, not just the press
Consistency comes from temperature. Closed-loop conditioning at ±0.5 °C, low-shear stirring and servo dosing remove most of the shift-to-shift variation foundries blame on tooling.

## 3. Plan for automation early
If pattern volumes are rising, specify a press that can later drop into a robotic wax injection cell — auto eject, recipe storage and a PLC/HMI with traceability are the pieces you cannot retrofit cheaply.',
'/products/m-wax-injector.jpg','casting','blog','{"wax injector","buying guide","foundry"}',6,true,now() - interval '4 days'),
('robotic-shelling-cell-roi','Robotic shelling: where the payback actually comes from','Dip, drain, stucco and dry — automated cycles remove the two biggest sources of shell scrap.',
'A robotic shelling cell is rarely justified by labour alone. The measurable gains come from repeatability.

## Consistent dip and drain
A six-axis robot repeats immersion depth, dwell and drain angle to the millimetre, so primary coat thickness stops drifting between operators and shifts.

## Recipe per part
Every part number carries its own dip time, rotation profile and dry duration. Scrap from over-thick back-up coats drops sharply.

## Traceability
PLC and SCADA logging means every tree has a record: coats, times, slurry viscosity. When a defect appears, the data narrows the cause in minutes.',
'/products/m-shelling-cell.jpg','robotic','case-study','{"robotics","shelling","automation"}',5,true,now() - interval '9 days'),
('slurry-viscosity-control','Slurry viscosity control: the quiet driver of shell quality','Why closed-loop viscosity monitoring beats manual cup tests for consistent shell builds.',
'Manual cup tests sample the slurry a few times a shift. Viscosity moves continuously.

## Closed-loop monitoring
An inline probe reads viscosity in real time and triggers binder or water top-up against the recipe, holding the slurry inside a tight band all day.

## What it changes on the floor
Fewer rejected shells, less rework in fettling and predictable dry times — because the coat thickness stops swinging.

## Getting started
Most foundries begin on the primary tank, where variation costs the most, and extend to back-up tanks after the first quarter of data.',
'/products/m-slurry-tank.jpg','casting','article','{"slurry","process control","quality"}',4,false,now() - interval '16 days'),
('wax-room-automation-guide','Wax room automation: a staged roadmap','From standalone injector to KAWAS wax recovery — how to automate without stopping production.',
'Automating a wax room in one shutdown is rarely realistic. Stage it.

## Stage 1 — Stabilise
Melting and conditioning tanks with PID control. Nothing downstream is repeatable until wax temperature is.

## Stage 2 — Automate injection
Auto close, inject, dwell, open and eject. Cycle counters give you the baseline data for the business case.

## Stage 3 — Close the loop
KAWAS-style wax recovery returns over 95% of runner and gate wax, cutting consumable spend and manual handling in one move.',
'/products/m-injection-cell.jpg','automation','blog','{"wax room","automation","KAWAS"}',5,false,now() - interval '25 days');
