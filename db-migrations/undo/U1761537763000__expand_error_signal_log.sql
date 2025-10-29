ALTER TABLE "studio_error_signal_log" ALTER COLUMN "ERROR_SIGNAL" DROP NOT NULL;

COMMENT ON COLUMN "studio_error_signal_log"."CONTENT" IS 'Content of Error Signal';

ALTER TABLE "studio_error_signal_log" DROP COLUMN "CONTENT";

COMMENT ON COLUMN "studio_error_signal_log"."MESSAGE_ID" IS 'Message ID of Error Signal';

ALTER TABLE "studio_error_signal_log" DROP COLUMN "MESSAGE_ID";

CREATE INDEX "idx_studio_error_signal_log_resolved" ON "studio_error_signal_log" ("RESOLVED");