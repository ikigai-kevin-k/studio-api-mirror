import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioErrorSignalLog } from 'src/studio/entities/studio-error-signal-log.entity';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import {
  DbStudioErrorSignalLog,
  StudioErrorSignal,
  UpdateStudioErrorSignalLogEntity,
} from './studio-error-signal-log.repository.type';

type StudioErrorSignalLogSchema = {
  ID: number;
  DEVICE_ID: string;
  ERROR_SIGNAL: StudioErrorSignal;
  RESOLVED: boolean;
  CREATED_AT: Date;
  UPDATED_AT: Date;
};

export class StudioErrorSignalLogRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getErrorSignalLogById(id: number): Promise<DbStudioErrorSignalLog> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioErrorSignalLog)
      .createQueryBuilder('studio')
      .where('studio.ID = :Id', { Id: id })
      .select([
        'studio."ID" as "id"',
        'studio."DEVICE_ID" as "deviceId"',
        'studio."ERROR_SIGNAL" as "errorSignal"',
        'studio."RESOLVED" as "resolved"',
        'studio."CREATED_AT" as "createdAt"',
        'studio."UPDATED_AT" as "updatedAt"',
      ]);

    const output = await builder.getRawOne<DbStudioErrorSignalLog>();
    if (!output) {
      throw new StudioNotFoundError(`[studio_error_signal_log] sn: ${id} does not found`);
    }

    return output;
  }

  async getUnResolvedErrorSignalLogByDeviceId(deviceID: string): Promise<DbStudioErrorSignalLog> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioErrorSignalLog)
      .createQueryBuilder('studio')
      .where('studio.DEVICE_ID = :deviceID', { deviceID: deviceID })
      .andWhere('studio.RESOLVED = :resolved', { resolved: false })
      .orderBy('studio.CREATED_AT', 'DESC')
      .limit(1)
      .select([
        'studio."ID" as "id"',
        'studio."DEVICE_ID" as "deviceId"',
        'studio."ERROR_SIGNAL" as "errorSignal"',
        'studio."RESOLVED" as "resolved"',
        'studio."CREATED_AT" as "createdAt"',
        'studio."UPDATED_AT" as "updatedAt"',
      ]);

    const output = await builder.getRawOne<DbStudioErrorSignalLog>();
    if (!output) {
      throw new StudioNotFoundError(
        `[studio_error_signal_log] Unresolved error signal of ${deviceID} does not found`,
      );
    }

    return output;
  }

  async getErrorSignalLogByCreationDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<DbStudioErrorSignalLog[]> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioErrorSignalLog)
      .createQueryBuilder('studio')
      .where('studio.CREATED_AT BETWEEN :start_date AND :end_date', {
        start_date: startDate,
        end_date: endDate,
      })
      .select([
        'studio."ID" as "id"',
        'studio."DEVICE_ID" as "deviceId"',
        'studio."ERROR_SIGNAL" as "errorSignal"',
        'studio."RESOLVED" as "resolved"',
        'studio."CREATED_AT" as "createdAt"',
        'studio."UPDATED_AT" as "updatedAt"',
      ]);

    return await builder.getRawMany<DbStudioErrorSignalLog>();
  }

  async insertErrorSignalLog(
    deviceId: string,
    log: StudioErrorSignal,
  ): Promise<DbStudioErrorSignalLog> {
    const studio = new StudioErrorSignalLog();
    studio.deviceId = deviceId;
    studio.errorSignal = log;

    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioErrorSignalLog)
      .values(studio)
      .returning('*')
      .execute();

    const data = result.raw[0] as StudioErrorSignalLogSchema;
    return {
      id: data.ID,
      deviceId: data.DEVICE_ID,
      errorSignal: data.ERROR_SIGNAL,
      resolved: data.RESOLVED,
      createdAt: data.CREATED_AT,
      updatedAt: data.UPDATED_AT,
    };
  }

  async updateErrorSignalLog(
    entity: UpdateStudioErrorSignalLogEntity,
  ): Promise<DbStudioErrorSignalLog> {
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioErrorSignalLog)
      .set({ resolved: true })
      .where('deviceId = :deviceId', { deviceId: entity.deviceId })
      .andWhere('resolved = :resolved', { resolved: false })
      .returning('*')
      .execute();

    if (updateResult.affected === 0) {
      throw new StudioUpdateError(`[studio_error_signal_log] ${entity.deviceId} does not modified`);
    }

    const data = updateResult.raw[0] as StudioErrorSignalLogSchema;
    return {
      id: data.ID,
      deviceId: data.DEVICE_ID,
      errorSignal: data.ERROR_SIGNAL,
      resolved: data.RESOLVED,
      createdAt: data.CREATED_AT,
      updatedAt: data.UPDATED_AT,
    };
  }

  async IsUnResolved(deviceId: string): Promise<boolean> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioErrorSignalLog)
      .createQueryBuilder('studio')
      .where('studio.DEVICE_ID = :deviceID', { deviceID: deviceId })
      .andWhere('studio.RESOLVED = :resolved', { resolved: false })
      .limit(1);

    const output = await builder.getRawOne<DbStudioErrorSignalLog>();
    return !!output;
  }

  async onInit(): Promise<void> {}
}
