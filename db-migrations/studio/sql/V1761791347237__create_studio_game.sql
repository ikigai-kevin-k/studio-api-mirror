CREATE TABLE IF NOT EXISTS "studio_game" (
    "ID" SERIAL NOT NULL, 
    "GAME_ID" character varying(255) NOT NULL, 
    "PRIMARY_TABLE_ID" character varying(255), 
    "SECONDARY_TABLE_ID" character varying(255), 
    "CURRENT_TABLE_ID" character varying(255), 
    "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), 
    "UPDATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), 
    CONSTRAINT "pk_game_id" PRIMARY KEY ("ID")
); 
COMMENT ON COLUMN "studio_game"."ID" IS 'Auto increase number'; 
COMMENT ON COLUMN "studio_game"."GAME_ID" IS 'Unique Game Code'; 
COMMENT ON COLUMN "studio_game"."PRIMARY_TABLE_ID" IS 'Primary Table ID'; 
COMMENT ON COLUMN "studio_game"."SECONDARY_TABLE_ID" IS 'Secondary Table ID'; 
COMMENT ON COLUMN "studio_game"."CURRENT_TABLE_ID" IS 'Current Table ID'; 
COMMENT ON COLUMN "studio_game"."CREATED_AT" IS 'When the row was created'; 
COMMENT ON COLUMN "studio_game"."UPDATED_AT" IS 'When the row was updated';

CREATE INDEX IF NOT EXISTS "idx_game_id" ON "studio_game" ("GAME_ID");

COMMENT ON TABLE "studio_game" IS 'The game table.';
