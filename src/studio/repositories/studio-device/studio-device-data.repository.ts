import { ModuleLifecycle } from '@ikigaians/mod';
import { DbService } from 'src/db/db.service';
import { StudioDevice } from 'src/studio/entities/studio-device.entity';
import {
  StudioDeviceDataResult,
  UpdateStudioDeviceDataEntity,
} from './studio-device-data.repository.type';
import { StudioDeviceSchema } from './studio-device.repository.type';

export class StudioDeviceDataRepository implements ModuleLifecycle {
  constructor(private readonly dbService: DbService) {}

  async getDeviceByID(deviceID: string): Promise<StudioDeviceDataResult | undefined> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioDevice)
      .createQueryBuilder('studio')
      .where('studio.DEVICE_ID = :deviceID', { deviceID: deviceID })
      .select(['studio."DEVICE_ID" as "deviceId"', 'studio."TABLE_ID" as "tableId"']);

    return await builder.getRawOne<StudioDeviceDataResult>();
  }

  async insertDevice(studio: StudioDevice): Promise<StudioDeviceDataResult> {
    const result = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioDevice)
      .values(studio)
      .returning('*')
      .execute();

    const data = result.raw[0] as StudioDeviceSchema;
    return {
      deviceId: data.DEVICE_ID,
      tableId: data.TABLE_ID,
    };
  }

  async updateDevice(
    entity: UpdateStudioDeviceDataEntity,
  ): Promise<StudioDeviceDataResult | undefined> {
    const updateResult = await this.dbService
      .getConnection()
      .createQueryBuilder()
      .update(StudioDevice)
      .set({
        tableId: entity.tableId,
      })
      .where({
        deviceId: entity.deviceId,
      })
      .returning('*')
      .execute();

    if (updateResult.affected === 0) return undefined;

    const data = updateResult.raw[0] as StudioDeviceSchema;
    return {
      deviceId: data.DEVICE_ID,
      tableId: data.TABLE_ID,
    };
  }

  async onInit(): Promise<void> {}
}
