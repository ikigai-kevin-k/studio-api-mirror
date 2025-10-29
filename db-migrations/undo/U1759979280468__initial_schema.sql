DROP TABLE IF EXISTS public.studio_status CASCADE;
DROP TABLE IF EXISTS public.studio_error_signal_log CASCADE;
DROP TABLE IF EXISTS public.studio_device CASCADE;
DROP TABLE IF EXISTS public.studio_cdn CASCADE;
DROP TABLE IF EXISTS public.studio CASCADE;

-- Explicitly drop sequences that may not be automatically dropped
DROP SEQUENCE IF EXISTS public."studio_status_ID_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."studio_error_signal_log_ID_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."studio_device_ID_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."studio_cdn_ID_seq" CASCADE;
DROP SEQUENCE IF EXISTS public."studio_ID_seq" CASCADE;
