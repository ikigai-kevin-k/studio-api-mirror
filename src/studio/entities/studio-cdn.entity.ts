import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('studio-cdn', {
  comment: 'The cdn path of game table.',
})
@Unique(['tableId'])
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
    name: 'PRIMARY_HD',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'Primary hd stream path',
  })
  primaryHd!: string;

  @Column({
    name: 'PRIMARY_HI',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'Primary hi stream path',
  })
  primaryHi!: string;

  @Column({
    name: 'PRIMARY_ME',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'Primary me stream path',
  })
  primaryMe!: string;

  @Column({
    name: 'PRIMARY_LO',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'Primary lo stream path',
  })
  primaryLo!: string;

  @Column({
    name: 'SECONDARY_HD',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'Secondary hd stream path',
  })
  secondaryHd!: string;

  @Column({
    name: 'SECONDARY_HI',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'Secondary hi stream path',
  })
  secondaryHi!: string;

  @Column({
    name: 'SECONDARY_ME',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'Secondary me stream path',
  })
  secondaryMe!: string;

  @Column({
    name: 'SECONDARY_LO',
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'Secondary lo stream path',
  })
  secondaryLo!: string;
}
