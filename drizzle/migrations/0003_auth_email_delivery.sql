-- Server-side auth email throttling for Supabase OTPs delivered through Brevo.

CREATE TABLE IF NOT EXISTS public.auth_email_requests (
  email_hash text NOT NULL,
  flow text NOT NULL CHECK (flow IN ('sign_in', 'invite', 'recovery')),
  requested_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (email_hash, flow)
);

REVOKE ALL ON public.auth_email_requests FROM anon, authenticated;
GRANT ALL ON public.auth_email_requests TO service_role;
ALTER TABLE public.auth_email_requests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.reserve_auth_email_request(
  _email_hash text,
  _flow text,
  _minimum_interval_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reserved boolean;
BEGIN
  IF _flow NOT IN ('sign_in', 'invite', 'recovery') THEN
    RAISE EXCEPTION 'Unsupported auth email flow';
  END IF;

  INSERT INTO public.auth_email_requests (email_hash, flow, requested_at)
  VALUES (_email_hash, _flow, now())
  ON CONFLICT (email_hash, flow) DO UPDATE
    SET requested_at = EXCLUDED.requested_at
    WHERE auth_email_requests.requested_at <=
      now() - make_interval(secs => GREATEST(_minimum_interval_seconds, 1))
  RETURNING true INTO reserved;

  RETURN COALESCE(reserved, false);
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_auth_email_request(text, text, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_auth_email_request(text, text, integer)
  TO service_role;
