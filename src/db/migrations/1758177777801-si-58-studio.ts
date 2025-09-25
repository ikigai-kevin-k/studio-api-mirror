import { MigrationInterface, QueryRunner } from 'typeorm';

export class Si58Studio1758177777801 implements MigrationInterface {
  name = 'Si58Studio1758177777801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "studio" ADD "GAME_ID" character varying(255) NOT NULL DEFAULT 'N/A'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "studio"."GAME_ID" IS 'Game Code ID'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "studio"."GAME_ID" IS 'Game Code ID'`);
    await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "GAME_ID"`);
  }
}
