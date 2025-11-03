ALTER TABLE "studio_error_signal_log" ALTER COLUMN "ERROR_SIGNAL" SET DEFAULT NULL;
ALTER TABLE "studio_error_signal_log" DROP COLUMN IF EXISTS "CONTENT";
ALTER TABLE "studio_error_signal_log" DROP COLUMN IF EXISTS "MESSAGE_ID";

CREATE INDEX IF NOT EXISTS "idx_studio_error_signal_log_resolved" ON "studio_error_signal_log" ("RESOLVED");