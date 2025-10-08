-- Down Migration

COMMENT ON TABLE "studio_cdn" IS NULL;

DROP INDEX "public"."idx_cdn_table_id";

DROP TABLE "studio_cdn";

COMMENT ON TABLE "studio" IS NULL;

DROP INDEX IF EXISTS "public"."idx_table_id";

DROP TABLE "studio";

