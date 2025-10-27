import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioErrorSignalLog } from 'src/studio/entities/studio-error-signal-log.entity';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import {
  DbStudioErrorSignalLog,
  StudioErrorSignalLogEntity,
  StudioErrorSignalMetaData,
} from './studio-error-signal-log.repository.type';

type StudioErrorSignalLogSchema = {
  ID: number;
  DEVICE_ID: string;
  MESSAGE_ID: string;
  CONTENT: string;
  ERROR_SIGNAL: StudioErrorSignalMetaData;
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
        'studio."MESSAGE_ID" as "msgId"',
        'studio."CONTENT" as "content"',
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

  async insertErrorSignalLog(entity: StudioErrorSignalLogEntity): Promise<DbStudioErrorSignalLog> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioErrorSignalLog)
      .values(entity)
      .returning([
        'id',
        'deviceId',
        'msgId',
        'content',
        'errorSignal',
        'resolved',
        'createdAt',
        'updatedAt',
      ])
      .execute();

    const data = result.raw[0] as StudioErrorSignalLogSchema;
    return {
      id: data.ID,
      deviceId: data.DEVICE_ID,
      msgId: data.MESSAGE_ID,
      content: data.CONTENT,
      errorSignal: data.ERROR_SIGNAL,
      resolved: data.RESOLVED,
      createdAt: data.CREATED_AT,
      updatedAt: data.UPDATED_AT,
    };
  }

  async updateErrorSignalLog(deviceId: string): Promise<DbStudioErrorSignalLog[]> {
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioErrorSignalLog)
      .set({ resolved: true })
      .where('deviceId = :deviceId', { deviceId: deviceId })
      .andWhere('resolved = :resolved', { resolved: false })
      .returning([
        'id',
        'deviceId',
        'msgId',
        'content',
        'errorSignal',
        'resolved',
        'createdAt',
        'updatedAt',
      ])
      .execute();

    if (updateResult.affected === 0) {
      throw new StudioUpdateError(`[studio_error_signal_log] ${deviceId} does not modified`);
    }

    const rawData = updateResult.raw as StudioErrorSignalLogSchema[];

    return rawData.map((data: StudioErrorSignalLogSchema) => {
      return {
        id: data.ID,
        deviceId: data.DEVICE_ID,
        msgId: data.MESSAGE_ID,
        content: data.CONTENT,
        errorSignal: data.ERROR_SIGNAL,
        resolved: data.RESOLVED,
        createdAt: data.CREATED_AT,
        updatedAt: data.UPDATED_AT,
      };
    });
  }

  async onInit(): Promise<void> {}
}
