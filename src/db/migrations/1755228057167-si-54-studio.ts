import { MigrationInterface, QueryRunner } from 'typeorm';

export class Si54Studio1755228057167 implements MigrationInterface {
  name = 'Si54Studio1755228057167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "studio-status" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "UPTIME" integer NOT NULL DEFAULT '0', "TIMESTAMP" TIMESTAMP(3) NOT NULL DEFAULT now(), "MAINTENANCE" boolean NOT NULL DEFAULT true, "SDP" character varying(255) NOT NULL DEFAULT 'standby', "IDP" character varying(255) NOT NULL DEFAULT 'standby', "BROKER" character varying(255) NOT NULL DEFAULT 'down', "Z_CAM" character varying(255) NOT NULL DEFAULT 'down', "ROULETTE" character varying(255) NOT NULL DEFAULT 'down', "SHAKER" character varying(255) NOT NULL DEFAULT 'down', "BARCODE_SCANNER" character varying(255) NOT NULL DEFAULT 'down', "NFC_SCANNER" character varying(255) NOT NULL DEFAULT 'down', CONSTRAINT "pk_machine_table_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio-status"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio-status"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio-status"."UPTIME" IS 'Execution time (in seconds since startup)'; COMMENT ON COLUMN "studio-status"."TIMESTAMP" IS 'The timestamp of the last update'; COMMENT ON COLUMN "studio-status"."MAINTENANCE" IS 'Under maintenance'; COMMENT ON COLUMN "studio-status"."SDP" IS 'SDP service status'; COMMENT ON COLUMN "studio-status"."IDP" IS 'IDP service status'; COMMENT ON COLUMN "studio-status"."BROKER" IS 'Broker device status'; COMMENT ON COLUMN "studio-status"."Z_CAM" IS 'ZCam device status'; COMMENT ON COLUMN "studio-status"."ROULETTE" IS 'Roulette device status'; COMMENT ON COLUMN "studio-status"."SHAKER" IS 'Shaker device status'; COMMENT ON COLUMN "studio-status"."BARCODE_SCANNER" IS 'Barcode scanner device status'; COMMENT ON COLUMN "studio-status"."NFC_SCANNER" IS 'NFC scanner device status'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX  IF NOT EXISTS "idx_status_table_id" ON "studio-status" ("TABLE_ID") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "studio-status" IS 'The machine status of studio game table.'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE "studio-status" IS NULL`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_status_table_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "studio-status"`);
  }
}
