import { MigrationInterface, QueryRunner } from 'typeorm';

export class Si58Studio1759217201624 implements MigrationInterface {
  name = 'Si58Studio1759217201624';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "studio" ADD "GAME_ID" character varying(255)`);
    await queryRunner.query(`COMMENT ON COLUMN "studio"."GAME_ID" IS 'Game Code ID'`);
    await queryRunner.query(
      `ALTER TABLE "studio" ADD "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "studio"."CREATED_AT" IS 'When the player session was created'`,
    );
    await queryRunner.query(
      `ALTER TABLE "studio" ADD "UPDATED_AT" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "studio"."UPDATED_AT" IS 'When the player session was updated'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "studio"."UPDATED_AT" IS 'When the player session was updated'`,
    );
    await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "UPDATED_AT"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "studio"."CREATED_AT" IS 'When the player session was created'`,
    );
    await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "CREATED_AT"`);
    await queryRunner.query(`COMMENT ON COLUMN "studio"."GAME_ID" IS 'Game Code ID'`);
    await queryRunner.query(`ALTER TABLE "studio" DROP COLUMN "GAME_ID"`);
  }
}
