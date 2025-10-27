DROP INDEX IF EXISTS public.idx_table_id;
DROP INDEX IF EXISTS public.idx_studio_status_table_id;
DROP INDEX IF EXISTS public.idx_studio_error_signal_log_resolved;
DROP INDEX IF EXISTS public.idx_studio_error_signal_log_device_id;
DROP INDEX IF EXISTS public.idx_studio_device_id;
DROP INDEX IF EXISTS public.idx_studio_cdn_table_id;
DROP INDEX IF EXISTS public.idx_status_table_id;
DROP INDEX IF EXISTS public.idx_cdn_table_id;

DROP TABLE IF EXISTS public.studio_status;
DROP TABLE IF EXISTS public.studio_error_signal_log;
DROP TABLE IF EXISTS public.studio_device;
DROP TABLE IF EXISTS public.studio_cdn;
DROP TABLE IF EXISTS public.studio;

DROP SEQUENCE IF EXISTS public."studio_status_ID_seq";
DROP SEQUENCE IF EXISTS public."studio_error_signal_log_ID_seq";
DROP SEQUENCE IF EXISTS public."studio_device_ID_seq";
DROP SEQUENCE IF EXISTS public."studio_cdn_ID_seq";
DROP SEQUENCE IF EXISTS public."studio_ID_seq";

