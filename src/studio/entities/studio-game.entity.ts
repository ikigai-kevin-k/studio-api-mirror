import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('studio_game', {
  comment: 'The game table.',
})
@Index('idx_game_id', ['gameId'], { unique: true })
export class StudioGame {
  @PrimaryGeneratedColumn({
    name: 'ID',
    primaryKeyConstraintName: 'pk_game_id',
    comment: 'Auto increase number',
  })
  id!: number;

  @Column({
    name: 'PHYSICAL_TABLE_CODE',
    type: 'varchar',
    length: 255,
    comment: 'Unique Game Code',
  })
  gameId!: string;

  @Column({
    name: 'PRIMARY_PHYSICAL_TABLE_ID',
    type: 'varchar',
    length: 255,
    comment: 'Primary Table ID',
  })
  primaryTableId!: string;

  @Column({
    name: 'SECONDARY_PHYSICAL_TABLE_ID',
    type: 'varchar',
    length: 255,
    comment: 'Secondary Table ID',
  })
  secondaryTableId!: string;

  @Column({
    name: 'CURRENT_PHYSICAL_TABLE_ID',
    type: 'varchar',
    length: 255,
    comment: 'Current Table ID',
  })
  currentTableId!: string;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
    precision: 3,
    comment: 'When the row was created',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'timestamp',
    precision: 3,
    comment: 'When the row was updated',
  })
  updatedAt!: Date;
}
