-- Up Migration

CREATE TABLE IF NOT EXISTS "studio" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "TABLE_STATUS" character varying(255) NOT NULL DEFAULT 'inactive', CONSTRAINT "pk_table_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio"."TABLE_STATUS" IS 'The status of game table: inactive, active, and failure Default value is inactive.';

CREATE UNIQUE INDEX IF NOT EXISTS "idx_table_id" ON "studio" ("TABLE_ID");

COMMENT ON TABLE "studio" IS 'This table contains studio game table.';

CREATE TABLE IF NOT EXISTS "studio-cdn" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "CDN" jsonb NOT NULL, CONSTRAINT "pk_cdn_table_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio-cdn"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio-cdn"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio-cdn"."CDN" IS 'CDN Destination';

CREATE UNIQUE INDEX IF NOT EXISTS "idx_cdn_table_id" ON "studio-cdn" ("TABLE_ID");

COMMENT ON TABLE "studio-cdn" IS 'The cdn path of game table.';

