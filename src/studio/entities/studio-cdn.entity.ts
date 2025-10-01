import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('studio_cdn', {
  comment: 'The cdn path of game table.',
})
@Index('idx_studio_cdn_table_id', ['tableId'], { unique: true })
export class StudioCdn {
  @PrimaryGeneratedColumn({
    name: 'ID',
    primaryKeyConstraintName: 'pk_studio_cdn_id',
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
    name: 'CDN',
    type: 'jsonb',
    comment: 'CDN Destination',
  })
  cdnDst!: Record<string, object>;

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
