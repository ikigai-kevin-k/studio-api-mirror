import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('studio-device', {
  comment: 'The device of game table.',
})
@Index('idx_device_id', ['deviceId'], { unique: true })
export class StudioDevice {
  @PrimaryGeneratedColumn({
    name: 'ID',
    primaryKeyConstraintName: 'pk_device_id',
    comment: 'Auto increase number',
  })
  id!: number;

  @Column({
    name: 'DEVICE_ID',
    type: 'varchar',
    length: 255,
    comment: 'Unique device Name',
  })
  deviceId!: string;

  @Column({
    name: 'TABLE_ID',
    type: 'varchar',
    length: 255,
    comment: 'Table Id',
  })
  tableId!: string;
}
