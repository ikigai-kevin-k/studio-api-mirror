import { ErrorSignalInput } from 'src/global/types/error-signal.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('studio_error_signal_log', {
  comment: 'The error signal logs.',
})
@Index('idx_studio_error_signal_log_device_id', ['deviceId'])
@Index('idx_studio_error_signal_log_resolved', ['resolved'])
export class StudioErrorSignalLog {
  @PrimaryGeneratedColumn({
    name: 'ID',
    primaryKeyConstraintName: 'pk_studio_error_signal_log_id',
    comment: 'Auto increase number',
  })
  id!: number;

  @Column({
    name: 'DEVICE_ID',
    type: 'varchar',
    length: 255,
    comment: 'Error Signal SourceDevice where the error occurred.',
  })
  deviceId!: string;

  @Column({
    name: 'ERROR_SIGNAL',
    type: 'jsonb',
    nullable: false,
    default: () => "'{}'",
    comment: 'Error Signal',
  })
  errorSignal!: ErrorSignalInput;

  @Column({
    name: 'RESOLVED',
    type: 'boolean',
    default: false,
    comment: 'Is Error resolved.',
  })
  resolved!: boolean;

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
