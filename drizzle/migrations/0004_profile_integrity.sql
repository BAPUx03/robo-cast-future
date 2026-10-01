-- Keep public team records aligned with Supabase Auth users.

DELETE FROM public.user_roles AS role_row
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users AS auth_user WHERE auth_user.id = role_row.user_id
);

DELETE FROM public.profiles AS profile
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users AS auth_user WHERE auth_user.id = profile.id
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_auth_user_fkey'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_auth_user_fkey
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'user_roles_profile_fkey'
      AND conrelid = 'public.user_roles'::regclass
  ) THEN
    ALTER TABLE public.user_roles
      ADD CONSTRAINT user_roles_profile_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;
