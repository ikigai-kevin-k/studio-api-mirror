import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('los-studio-device', {
  comment: 'This table contains token of each device in studio',
})
@Index('idx_table_device_id', ['deviceId'], { unique: true })
export class LosDeviceAccount {
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
    comment: 'Unique Device Name for los',
  })
  deviceId!: string;

  @Column({
    name: 'DEVICE_PW',
    type: 'varchar',
    length: 255,
    comment: 'Password for los',
  })
  password!: string;

  @Column({
    name: 'ACCESS_TOKEN',
    type: 'varchar',
    length: 255,
    comment: 'Access token for LOS',
    default: '',
  })
  accessToken!: string;

  @Column({
    name: 'CREATE_AT',
    type: 'timestamp',
    comment: 'Access token for LOS',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    name: 'UPDATE_AT',
    type: 'timestamp',
    comment: 'Access token for LOS',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
