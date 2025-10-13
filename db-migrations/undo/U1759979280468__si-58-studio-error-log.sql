-- Down Migration

COMMENT ON TABLE "studio_error_signal_log" IS NULL;

DROP INDEX IF EXISTS "public"."idx_studio_error_signal_log_device_id";

DROP INDEX IF EXISTS "public"."idx_studio_error_signal_log_resolved";

DROP TABLE "studio_error_signal_log";