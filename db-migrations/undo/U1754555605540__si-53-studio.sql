-- Down Migration

COMMENT ON TABLE "studio-cdn" IS NULL;

DROP INDEX "public"."idx_cdn_table_id";

DROP TABLE "studio-cdn";

COMMENT ON TABLE "studio" IS NULL;

DROP INDEX IF EXISTS "public"."idx_table_id";

DROP TABLE "studio";

