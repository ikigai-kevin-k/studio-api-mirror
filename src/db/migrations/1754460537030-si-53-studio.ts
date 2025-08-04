import { MigrationInterface, QueryRunner } from 'typeorm';

export class Si53Studio1754460537030 implements MigrationInterface {
  name = 'Si53Studio1754460537030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "studio" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "TABLE_STATUS" character varying(255) NOT NULL DEFAULT 'inactive', CONSTRAINT "UQ_ba3faae3dc82f8982d6d9e10931" UNIQUE ("TABLE_ID"), CONSTRAINT "pk_table_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio"."TABLE_STATUS" IS 'The status of game table: inactive, active, and failure Default value is inactive.'`,
    );
    await queryRunner.query(
      `COMMENT ON TABLE "studio" IS 'This table contains studio game table.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "studio-cdn" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "PRIMARY_HD" character varying(255) NOT NULL DEFAULT '', "PRIMARY_HI" character varying(255) NOT NULL DEFAULT '', "PRIMARY_ME" character varying(255) NOT NULL DEFAULT '', "PRIMARY_LO" character varying(255) NOT NULL DEFAULT '', "SECONDARY_HD" character varying(255) NOT NULL DEFAULT '', "SECONDARY_HI" character varying(255) NOT NULL DEFAULT '', "SECONDARY_ME" character varying(255) NOT NULL DEFAULT '', "SECONDARY_LO" character varying(255) NOT NULL DEFAULT '', CONSTRAINT "UQ_a5d90c771c90a96b511cbcced63" UNIQUE ("TABLE_ID"), CONSTRAINT "pk_cdn_table_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio-cdn"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio-cdn"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio-cdn"."PRIMARY_HD" IS 'Primary hd stream path'; COMMENT ON COLUMN "studio-cdn"."PRIMARY_HI" IS 'Primary hi stream path'; COMMENT ON COLUMN "studio-cdn"."PRIMARY_ME" IS 'Primary me stream path'; COMMENT ON COLUMN "studio-cdn"."PRIMARY_LO" IS 'Primary lo stream path'; COMMENT ON COLUMN "studio-cdn"."SECONDARY_HD" IS 'Secondary hd stream path'; COMMENT ON COLUMN "studio-cdn"."SECONDARY_HI" IS 'Secondary hi stream path'; COMMENT ON COLUMN "studio-cdn"."SECONDARY_ME" IS 'Secondary me stream path'; COMMENT ON COLUMN "studio-cdn"."SECONDARY_LO" IS 'Secondary lo stream path'`,
    );
    await queryRunner.query(`COMMENT ON TABLE "studio-cdn" IS 'The cdn path of game table.'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE "studio-cdn" IS NULL`);
    await queryRunner.query(`DROP TABLE "studio-cdn"`);
    await queryRunner.query(`COMMENT ON TABLE "studio" IS NULL`);
    await queryRunner.query(`DROP TABLE "studio"`);
  }
}
