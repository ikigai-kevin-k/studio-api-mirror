-- Up Migration

CREATE TABLE IF NOT EXISTS "studio_error_signal_log" ("ID" SERIAL NOT NULL, "DEVICE_ID" character varying(255) NOT NULL, "ERROR_SIGNAL" jsonb NOT NULL DEFAULT '{}', "RESOLVED" boolean NOT NULL DEFAULT false, "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), CONSTRAINT "pk_studio_error_signal_log_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio_error_signal_log"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio_error_signal_log"."DEVICE_ID" IS 'Error Signal Source Device where the error occurred.'; COMMENT ON COLUMN "studio_error_signal_log"."ERROR_SIGNAL" IS 'Error Signal'; COMMENT ON COLUMN "studio_error_signal_log"."RESOLVED" IS 'Is Error resolved.'; COMMENT ON COLUMN "studio_error_signal_log"."CREATED_AT" IS 'When the row was created'; COMMENT ON COLUMN "studio_error_signal_log"."UPDATED_AT" IS 'When the row was updated';
CREATE INDEX IF NOT EXISTS "idx_studio_error_signal_log_resolved" ON "studio_error_signal_log" ("RESOLVED");

CREATE INDEX IF NOT EXISTS "idx_studio_error_signal_log_device_id" ON "studio_error_signal_log" ("DEVICE_ID");

COMMENT ON TABLE "studio_error_signal_log" IS 'The error signal logs.';
