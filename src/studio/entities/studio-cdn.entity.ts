/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('studio-cdn', {
  comment: 'The cdn path of game table.',
})
@Index('idx_cdn_table_id', ['tableId'], { unique: true })
export class StudioCdn {
  @PrimaryGeneratedColumn({
    name: 'ID',
    primaryKeyConstraintName: 'pk_cdn_table_id',
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
  cdnDst!: Record<string, any>;
}
