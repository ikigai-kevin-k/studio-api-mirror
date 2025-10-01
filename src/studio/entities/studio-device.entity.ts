import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('studio_device', {
  comment: 'The device of game table.',
})
@Index('idx_studio_device_id', ['deviceId'], { unique: true })
export class StudioDevice {
  @PrimaryGeneratedColumn({
    name: 'ID',
    primaryKeyConstraintName: 'pk_studio_device_id',
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
