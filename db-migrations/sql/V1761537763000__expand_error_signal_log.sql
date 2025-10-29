DROP INDEX "public"."idx_studio_error_signal_log_resolved";

ALTER TABLE "studio_error_signal_log" ADD "MESSAGE_ID" character varying(255);

COMMENT ON COLUMN "studio_error_signal_log"."MESSAGE_ID" IS 'Message ID of Error Signal';

ALTER TABLE "studio_error_signal_log" ADD "CONTENT" character varying(255);

COMMENT ON COLUMN "studio_error_signal_log"."CONTENT" IS 'Content of Error Signal';

ALTER TABLE "studio_error_signal_log" ALTER COLUMN "ERROR_SIGNAL" SET NOT NULL;

