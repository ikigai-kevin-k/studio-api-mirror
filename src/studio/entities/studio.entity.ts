import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudioTableStatusEnum } from '../enums/studio.enums';

@Entity('studio', {
  comment: 'This table contains studio game table.',
})
@Index('idx_table_id', ['tableId'], { unique: true })
export class Studio {
  @PrimaryGeneratedColumn({
    name: 'ID',
    primaryKeyConstraintName: 'pk_table_id',
    comment: 'Auto increase number',
  })
  id!: number;

  @Column({
    name: 'TABLE_ID',
    type: 'varchar',
    length: 255,
    comment: 'Unique Table Name',
  })
  tableId!: string;

  @Column({
    name: 'TABLE_STATUS',
    type: 'varchar',
    length: 255,
    default: StudioTableStatusEnum.INACTIVE,
    comment: 'The status of game table: inactive, active, and failure Default value is inactive.',
  })
  tableStatus!: string;

  @Column({
    name: 'GAME_ID',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Game Code ID',
  })
  gameId!: string;

  @CreateDateColumn({
    name: 'CREATED_AT',
    type: 'timestamp',
    comment: 'When the player session was created',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'UPDATED_AT',
    type: 'timestamp',
    comment: 'When the player session was updated',
  })
  updatedAt!: Date;
}
