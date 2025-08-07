import { MigrationInterface, QueryRunner } from 'typeorm';

export class Si53Studio1754555605540 implements MigrationInterface {
  name = 'Si53Studio1754555605540';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "studio" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "TABLE_STATUS" character varying(255) NOT NULL DEFAULT 'inactive', CONSTRAINT "pk_table_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio"."TABLE_STATUS" IS 'The status of game table: inactive, active, and failure Default value is inactive.'`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_table_id" ON "studio" ("TABLE_ID") `);
    await queryRunner.query(
      `COMMENT ON TABLE "studio" IS 'This table contains studio game table.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "studio-cdn" ("ID" SERIAL NOT NULL, "TABLE_ID" character varying(255) NOT NULL, "CDN" jsonb NOT NULL, CONSTRAINT "pk_cdn_table_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio-cdn"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio-cdn"."TABLE_ID" IS 'Unique Table Name'; COMMENT ON COLUMN "studio-cdn"."CDN" IS 'CDN Destination'`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "idx_cdn_table_id" ON "studio-cdn" ("TABLE_ID") `);
    await queryRunner.query(`COMMENT ON TABLE "studio-cdn" IS 'The cdn path of game table.'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE "studio-cdn" IS NULL`);
    await queryRunner.query(`DROP INDEX "public"."idx_cdn_table_id"`);
    await queryRunner.query(`DROP TABLE "studio-cdn"`);
    await queryRunner.query(`COMMENT ON TABLE "studio" IS NULL`);
    await queryRunner.query(`DROP INDEX "public"."idx_table_id"`);
    await queryRunner.query(`DROP TABLE "studio"`);
  }
}
