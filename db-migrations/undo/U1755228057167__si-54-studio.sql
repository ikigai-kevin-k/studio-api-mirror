-- Down Migration

COMMENT ON TABLE "studio-status" IS NULL;

DROP INDEX IF EXISTS "public"."idx_status_table_id";

DROP TABLE IF EXISTS "studio-status";

