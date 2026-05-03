-- =====================================================
-- 020_test_online_public_identification.sql
-- Additive patch for immediate public passation via /test-online
-- Keeps the existing test_online flow and scoring intact.
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'candidate_first_name'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN candidate_first_name TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'candidate_last_name'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN candidate_last_name TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'candidate_hotel'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN candidate_hotel TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'candidate_service'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN candidate_service TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'candidate_phone'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN candidate_phone TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'candidate_email'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN candidate_email TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'public_access_token_hash'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN public_access_token_hash TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'public_access_expires_at'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN public_access_expires_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'identification_completed_at'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN identification_completed_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'last_seen_at'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN last_seen_at TIMESTAMPTZ;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'a_revoir_seance_2'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN a_revoir_seance_2 BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'test_online_status' AND column_name = 'commentaire'
    ) THEN
        ALTER TABLE public.test_online_status ADD COLUMN commentaire TEXT;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_test_online_status_candidate_phone
    ON public.test_online_status(candidate_phone);

CREATE INDEX IF NOT EXISTS idx_test_online_status_candidate_hotel
    ON public.test_online_status(candidate_hotel);

CREATE INDEX IF NOT EXISTS idx_test_online_status_candidate_service
    ON public.test_online_status(candidate_service);

CREATE INDEX IF NOT EXISTS idx_test_online_status_public_token_hash
    ON public.test_online_status(public_access_token_hash);
