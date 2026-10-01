-- Server-side abuse protection for the public enquiry form.

CREATE TABLE IF NOT EXISTS public.enquiry_rate_limits (
  fingerprint_hash text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 1 CHECK (request_count >= 1)
);

REVOKE ALL ON public.enquiry_rate_limits FROM anon, authenticated;
GRANT ALL ON public.enquiry_rate_limits TO service_role;
ALTER TABLE public.enquiry_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.reserve_enquiry_request(
  _fingerprint_hash text,
  _window_seconds integer DEFAULT 3600,
  _maximum_requests integer DEFAULT 5
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  allowed boolean;
BEGIN
  IF length(_fingerprint_hash) < 16 THEN
    RAISE EXCEPTION 'Invalid enquiry fingerprint';
  END IF;

  -- Keep the tiny abuse-protection table self-cleaning without a cron job.
  DELETE FROM public.enquiry_rate_limits
  WHERE window_started_at < now() - interval '24 hours';

  INSERT INTO public.enquiry_rate_limits (
    fingerprint_hash,
    window_started_at,
    request_count
  )
  VALUES (_fingerprint_hash, now(), 1)
  ON CONFLICT (fingerprint_hash) DO UPDATE
    SET
      window_started_at = CASE
        WHEN enquiry_rate_limits.window_started_at <=
          now() - make_interval(secs => GREATEST(_window_seconds, 60))
          THEN now()
        ELSE enquiry_rate_limits.window_started_at
      END,
      request_count = CASE
        WHEN enquiry_rate_limits.window_started_at <=
          now() - make_interval(secs => GREATEST(_window_seconds, 60))
          THEN 1
        ELSE enquiry_rate_limits.request_count + 1
      END
  RETURNING request_count <= GREATEST(_maximum_requests, 1) INTO allowed;

  RETURN COALESCE(allowed, false);
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_enquiry_request(text, integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_enquiry_request(text, integer, integer)
  TO service_role;
