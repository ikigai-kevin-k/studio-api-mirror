-- Down Migration

COMMENT ON TABLE "studio_status" IS NULL;

DROP INDEX IF EXISTS "public"."idx_status_table_id";

DROP TABLE IF EXISTS "studio_status";

