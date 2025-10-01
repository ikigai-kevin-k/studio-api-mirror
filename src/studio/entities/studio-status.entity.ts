import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudioDeviceStatusEnum, StudioServiceStatusEnum } from '../enums/studio.enums';

@Entity('studio_status', {
  comment: 'The machine status of studio game table.',
})
@Index('idx_studio_status_table_id', ['tableId'], { unique: true })
export class StudioStatus {
  @PrimaryGeneratedColumn({
    name: 'ID',
    primaryKeyConstraintName: 'pk_studio_status_id',
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
    name: 'UPTIME',
    type: 'int',
    default: 0,
    comment: 'Execution time (in seconds since startup)',
  })
  uptime!: number;

  @Column({
    name: 'MAINTENANCE',
    type: 'boolean',
    default: true,
    comment: 'Under maintenance',
  })
  maintenance!: boolean;

  @Column({
    name: 'SDP',
    type: 'varchar',
    length: 255,
    default: StudioServiceStatusEnum.STANDBY,
    comment: 'SDP service status',
  })
  sdp!: string;

  @Column({
    name: 'IDP',
    type: 'varchar',
    length: 255,
    default: StudioServiceStatusEnum.STANDBY,
    comment: 'IDP service status',
  })
  idp!: string;

  @Column({
    name: 'BROKER',
    type: 'varchar',
    length: 255,
    default: StudioDeviceStatusEnum.DOWN,
    comment: 'Broker device status',
  })
  broker!: string;

  @Column({
    name: 'Z_CAM',
    type: 'varchar',
    length: 255,
    default: StudioDeviceStatusEnum.DOWN,
    comment: 'ZCam device status',
  })
  zCam!: string;

  @Column({
    name: 'ROULETTE',
    type: 'varchar',
    length: 255,
    default: StudioDeviceStatusEnum.DOWN,
    comment: 'Roulette device status',
  })
  roulette!: string;

  @Column({
    name: 'SHAKER',
    type: 'varchar',
    length: 255,
    default: StudioDeviceStatusEnum.DOWN,
    comment: 'Shaker device status',
  })
  shaker!: string;

  @Column({
    name: 'BARCODE_SCANNER',
    type: 'varchar',
    length: 255,
    default: StudioDeviceStatusEnum.DOWN,
    comment: 'Barcode scanner device status',
  })
  barcodeScanner!: string;

  @Column({
    name: 'NFC_SCANNER',
    type: 'varchar',
    length: 255,
    default: StudioDeviceStatusEnum.DOWN,
    comment: 'NFC scanner device status',
  })
  nfcScanner!: string;

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
