-- db-migrations/studio/undo/U1762914936000__rename_studio_game.sql
DO $$ BEGIN
    -- Check if the old column exists in the 'studio_game' table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'studio_game' 
            AND column_name = 'PHYSICAL_TABLE_CODE'
            AND table_schema = current_schema()
             ) 
    THEN
        -- If it exists, rename it
        ALTER TABLE "studio_game" RENAME COLUMN "PHYSICAL_TABLE_CODE" TO "GAME_ID";
    END IF;
END $$;

DO $$ BEGIN
    -- Check if the old column exists in the 'studio_game' table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'studio_game' 
            AND column_name = 'PRIMARY_PHYSICAL_TABLE_ID'
            AND table_schema = current_schema()
             ) 
    THEN
        -- If it exists, rename it
        ALTER TABLE "studio_game" RENAME COLUMN "PRIMARY_PHYSICAL_TABLE_ID" TO "PRIMARY_TABLE_ID";
    END IF;
END $$;

DO $$ BEGIN
    -- Check if the old column exists in the 'studio_game' table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'studio_game' 
            AND column_name = 'SECONDARY_PHYSICAL_TABLE_ID'
            AND table_schema = current_schema()
             ) 
    THEN
        -- If it exists, rename it
        ALTER TABLE "studio_game" RENAME COLUMN "SECONDARY_PHYSICAL_TABLE_ID" TO "SECONDARY_TABLE_ID";
    END IF;
END $$;

DO $$ BEGIN
    -- Check if the old column exists in the 'studio_game' table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'studio_game' 
            AND column_name = 'CURRENT_PHYSICAL_TABLE_ID'
            AND table_schema = current_schema()
             ) 
    THEN
        -- If it exists, rename it
        ALTER TABLE "studio_game" RENAME COLUMN "CURRENT_PHYSICAL_TABLE_ID" TO "CURRENT_TABLE_ID";
    END IF;
END $$;


ALTER TABLE studio_game DROP CONSTRAINT IF EXISTS uq_studio_game_physical_table_code;
CREATE UNIQUE INDEX IF NOT EXISTS uq_studio_game_game_id ON "studio_game" ("GAME_ID"); 

COMMENT ON COLUMN "studio_game"."GAME_ID" IS 'Unique Game Code';
COMMENT ON COLUMN "studio_game"."PRIMARY_TABLE_ID" IS 'Primary Table ID';
COMMENT ON COLUMN "studio_game"."SECONDARY_TABLE_ID" IS 'Secondary Table ID';
COMMENT ON COLUMN "studio_game"."CURRENT_TABLE_ID" IS 'Current Table ID';