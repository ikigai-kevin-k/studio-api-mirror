import { MigrationInterface, QueryRunner } from 'typeorm';

export class Si58Device1759219145956 implements MigrationInterface {
  name = 'Si58Device1759219145956';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "studio_status" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "UPTIME" integer NOT NULL DEFAULT '0', "MAINTENANCE" boolean NOT NULL DEFAULT true, "SDP" character varying(255) NOT NULL DEFAULT 'standby', "IDP" character varying(255) NOT NULL DEFAULT 'standby', "BROKER" character varying(255) NOT NULL DEFAULT 'down', "Z_CAM" character varying(255) NOT NULL DEFAULT 'down', "ROULETTE" character varying(255) NOT NULL DEFAULT 'down', "SHAKER" character varying(255) NOT NULL DEFAULT 'down', "BARCODE_SCANNER" character varying(255) NOT NULL DEFAULT 'down', "NFC_SCANNER" character varying(255) NOT NULL DEFAULT 'down', "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), CONSTRAINT "pk_studio_status_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio_status"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio_status"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio_status"."UPTIME" IS 'Execution time (in seconds since startup)'; COMMENT ON COLUMN "studio_status"."MAINTENANCE" IS 'Under maintenance'; COMMENT ON COLUMN "studio_status"."SDP" IS 'SDP service status'; COMMENT ON COLUMN "studio_status"."IDP" IS 'IDP service status'; COMMENT ON COLUMN "studio_status"."BROKER" IS 'Broker device status'; COMMENT ON COLUMN "studio_status"."Z_CAM" IS 'ZCam device status'; COMMENT ON COLUMN "studio_status"."ROULETTE" IS 'Roulette device status'; COMMENT ON COLUMN "studio_status"."SHAKER" IS 'Shaker device status'; COMMENT ON COLUMN "studio_status"."BARCODE_SCANNER" IS 'Barcode scanner device status'; COMMENT ON COLUMN "studio_status"."NFC_SCANNER" IS 'NFC scanner device status'; COMMENT ON COLUMN "studio_status"."CREATED_AT" IS 'When the row was created'; COMMENT ON COLUMN "studio_status"."UPDATED_AT" IS 'When the row was updated'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_studio_status_table_id" ON "studio_status" ("TABLE_ID") `,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "studio_status" IS 'The machine status of studio game table.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "studio_device" ("ID" SERIAL NOT NULL, "DEVICE_ID" character varying(255) NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), CONSTRAINT "pk_studio_device_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio_device"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio_device"."DEVICE_ID" IS 'Unique device Name'; COMMENT ON COLUMN "studio_device"."TABLE_ID" IS 'Table Id'; COMMENT ON COLUMN "studio_device"."CREATED_AT" IS 'When the row was created'; COMMENT ON COLUMN "studio_device"."UPDATED_AT" IS 'When the row was updated'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_studio_device_id" ON "studio_device" ("DEVICE_ID") `,
    );
    await queryRunner.query(`COMMENT ON TABLE "studio_device" IS 'The device of game table.'`);
    await queryRunner.query(
      `CREATE TABLE "studio_cdn" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "CDN" jsonb NOT NULL, "CREATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), "UPDATED_AT" TIMESTAMP(3) NOT NULL DEFAULT now(), CONSTRAINT "pk_studio_cdn_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio_cdn"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio_cdn"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio_cdn"."CDN" IS 'CDN Destination'; COMMENT ON COLUMN "studio_cdn"."CREATED_AT" IS 'When the row was created'; COMMENT ON COLUMN "studio_cdn"."UPDATED_AT" IS 'When the row was updated'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_studio_cdn_table_id" ON "studio_cdn" ("TABLE_ID") `,
    );
    await queryRunner.query(`COMMENT ON TABLE "studio_cdn" IS 'The cdn path of game table.'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE "studio_cdn" IS NULL`);
    await queryRunner.query(`DROP INDEX "public"."idx_studio_cdn_table_id"`);
    await queryRunner.query(`DROP TABLE "studio_cdn"`);
    await queryRunner.query(`COMMENT ON TABLE "studio_device" IS NULL`);
    await queryRunner.query(`DROP INDEX "public"."idx_studio_device_id"`);
    await queryRunner.query(`DROP TABLE "studio_device"`);
    await queryRunner.query(`COMMENT ON TABLE "studio_status" IS NULL`);
    await queryRunner.query(`DROP INDEX "public"."idx_studio_status_table_id"`);
    await queryRunner.query(`DROP TABLE "studio_status"`);
  }
}
