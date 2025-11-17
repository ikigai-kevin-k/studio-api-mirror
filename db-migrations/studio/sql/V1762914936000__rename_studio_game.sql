-- db-migrations/studio/sql/V1762914936000__rename_studio_game.sql
DO $$ BEGIN
    -- Check if the old column exists in the 'studio_game' table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'studio_game' 
            AND column_name = 'GAME_ID'
            AND table_schema = current_schema()
             ) 
    THEN
        -- If it exists, rename it
        ALTER TABLE "studio_game" RENAME COLUMN "GAME_ID" TO "PHYSICAL_TABLE_CODE";
    END IF;
END $$;

DO $$ BEGIN
    -- Check if the old column exists in the 'studio_game' table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'studio_game' 
            AND column_name = 'PRIMARY_TABLE_ID'
            AND table_schema = current_schema()
             ) 
    THEN
        -- If it exists, rename it
        ALTER TABLE "studio_game" RENAME COLUMN "PRIMARY_TABLE_ID" TO "PRIMARY_PHYSICAL_TABLE_ID";
    END IF;
END $$;

DO $$ BEGIN
    -- Check if the old column exists in the 'studio_game' table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'studio_game' 
            AND column_name = 'SECONDARY_TABLE_ID'
            AND table_schema = current_schema()
             ) 
    THEN
        -- If it exists, rename it
        ALTER TABLE "studio_game" RENAME COLUMN "SECONDARY_TABLE_ID" TO "SECONDARY_PHYSICAL_TABLE_ID";
    END IF;
END $$;

DO $$ BEGIN
    -- Check if the old column exists in the 'studio_game' table
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'studio_game' 
            AND column_name = 'CURRENT_TABLE_ID'
            AND table_schema = current_schema()
             ) 
    THEN
        -- If it exists, rename it
        ALTER TABLE "studio_game" RENAME COLUMN "CURRENT_TABLE_ID" TO "CURRENT_PHYSICAL_TABLE_ID";
    END IF;
END $$;


ALTER TABLE studio_game DROP CONSTRAINT IF EXISTS uq_studio_game_game_id;
CREATE UNIQUE INDEX IF NOT EXISTS uq_studio_game_physical_table_code ON "studio_game" ("PHYSICAL_TABLE_CODE"); 

COMMENT ON COLUMN "studio_game"."PHYSICAL_TABLE_CODE" IS 'Unique Physical Table Code';
COMMENT ON COLUMN "studio_game"."PRIMARY_PHYSICAL_TABLE_ID" IS 'Primary Physical Table ID';
COMMENT ON COLUMN "studio_game"."SECONDARY_PHYSICAL_TABLE_ID" IS 'Secondary Physical Table ID';
COMMENT ON COLUMN "studio_game"."CURRENT_PHYSICAL_TABLE_ID" IS 'Current Physical Table ID';
