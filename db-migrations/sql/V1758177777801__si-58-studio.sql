-- Up Migration

ALTER TABLE "studio" ADD "GAME_ID" character varying(255);

COMMENT ON COLUMN "studio"."GAME_ID" IS 'Game Code ID';

ALTER TABLE "studio" ADD "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now();

COMMENT ON COLUMN "studio"."CREATED_AT" IS 'When the row was created';

ALTER TABLE "studio" ADD "UPDATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now();

COMMENT ON COLUMN "studio"."UPDATED_AT" IS 'When the row was updated';

