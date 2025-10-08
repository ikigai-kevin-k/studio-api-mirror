-- Down Migration

COMMENT ON COLUMN "studio"."UPDATED_AT" IS 'When the row was updated';

ALTER TABLE "studio" DROP COLUMN "UPDATED_AT";

COMMENT ON COLUMN "studio"."CREATED_AT" IS 'When the row was created';

ALTER TABLE "studio" DROP COLUMN "CREATED_AT";

COMMENT ON COLUMN "studio"."GAME_ID" IS 'Game Code ID';

ALTER TABLE "studio" DROP COLUMN "GAME_ID";

