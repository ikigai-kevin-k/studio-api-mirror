-- Down Migration

COMMENT ON TABLE "studio_cdn" IS NULL;

DROP INDEX "public"."idx_studio_cdn_table_id";

DROP TABLE "studio_cdn";

COMMENT ON TABLE "studio_device" IS NULL;

DROP INDEX "public"."idx_studio_device_id";

DROP TABLE "studio_device";

COMMENT ON TABLE "studio_status" IS NULL;

DROP INDEX "public"."idx_studio_status_table_id";

DROP TABLE "studio_status";

