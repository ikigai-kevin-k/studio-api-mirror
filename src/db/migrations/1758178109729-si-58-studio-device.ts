import { MigrationInterface, QueryRunner } from 'typeorm';

export class Si58StudioDevice1758178109729 implements MigrationInterface {
  name = 'Si58StudioDevice1758178109729';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "studio-device" ("ID" SERIAL NOT NULL, "DEVICE_ID" character varying(255) NOT NULL, "TABLE_ID" character varying(255) NOT NULL, CONSTRAINT "pk_device_id" PRIMARY KEY ("ID")); COMMENT ON COLUMN "studio-device"."ID" IS 'Auto increase number'; COMMENT ON COLUMN "studio-device"."DEVICE_ID" IS 'Unique device Name'; COMMENT ON COLUMN "studio-device"."TABLE_ID" IS 'Table Id'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "idx_device_id" ON "studio-device" ("DEVICE_ID") `,
    );
    await queryRunner.query(`COMMENT ON TABLE "studio-device" IS 'The device of game table.'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON TABLE "studio-device" IS NULL`);
    await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_device_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "studio-device"`);
  }
}
