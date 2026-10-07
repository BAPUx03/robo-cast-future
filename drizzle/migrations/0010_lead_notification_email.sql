-- Route every new website enquiry notification to the current sales inbox.
INSERT INTO public.site_settings (key, value)
VALUES ('admin_notify_email', 'pruthvirajsinh.biz@gmail.com')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;
