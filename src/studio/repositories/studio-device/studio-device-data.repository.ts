import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import { DbService } from 'src/db/db.service';
import { StudioDevice } from 'src/studio/entities/studio-device.entity';
import { StudioNotFoundError, StudioUpdateError } from 'src/studio/errors/studio.error';
import {
  DbStudioDeviceResult,
  UpdateStudioDeviceDataEntity,
} from './studio-device-data.repository.type';

type StudioDeviceSchema = {
  DEVICE_ID: string;
  TABLE_ID: string;
};

export class StudioDeviceDataRepository implements ModuleLifecycle {
  constructor(
    private readonly cacheService: CacheService,
    private readonly dbService: DbService,
  ) {}

  async getDeviceByDeviceID(deviceID: string): Promise<DbStudioDeviceResult> {
    const cache = await this.getCache(deviceID);
    if (cache) return cache;

    const builder = this.dbService
      .getConnection()
      .getRepository(StudioDevice)
      .createQueryBuilder('studio')
      .where('studio.DEVICE_ID = :deviceID', { deviceID: deviceID })
      .select(['studio."DEVICE_ID" as "deviceId"', 'studio."TABLE_ID" as "tableId"']);

    const output = await builder.getRawOne<DbStudioDeviceResult>();
    if (!output) {
      throw new StudioNotFoundError(`[studio_device] ${deviceID} not found`);
    }

    await this.refreshCache(output);

    return output;
  }

  async getDeviceByTableID(tableID: string): Promise<DbStudioDeviceResult> {
    const builder = this.dbService
      .getConnection()
      .getRepository(StudioDevice)
      .createQueryBuilder('studio')
      .where('studio.TABLE_ID = :tableID', { tableID: tableID })
      .select(['studio."DEVICE_ID" as "deviceId"']);

    const output = await builder.getRawOne<DbStudioDeviceResult>();
    if (!output) {
      throw new StudioNotFoundError(`[studio_device] ${tableID} not found`);
    }

    return output;
  }

  async insertDevice(deviceId: string): Promise<DbStudioDeviceResult> {
    const studio = new StudioDevice();
    studio.deviceId = deviceId;
    studio.tableId = '';

    await this.dbService
      .getConnection()
      .createQueryBuilder()
      .insert()
      .into(StudioDevice)
      .values(studio)
      .execute();

    const output = {
      deviceId: deviceId,
      tableId: '',
    };

    await this.refreshCache(output);
    return output;
  }

  async updateDevice(entity: UpdateStudioDeviceDataEntity): Promise<DbStudioDeviceResult> {
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

    if (updateResult.affected === 0) {
      throw new StudioUpdateError(`[studio_device] ${entity.tableId} hasn't been modified`);
    }

    const data = updateResult.raw[0] as StudioDeviceSchema;
    const output = {
      deviceId: data.DEVICE_ID,
      tableId: data.TABLE_ID,
    };

    await this.refreshCache(output);

    return output;
  }

  private getCacheKey() {
    return `studio-device`;
  }

  private async getCache(deviceId: string): Promise<DbStudioDeviceResult | undefined> {
    const tag = this.getCacheKey();
    const cache = await this.cacheService.hmGet(tag, [deviceId]);
    const result = cache[0];
    if (!result) return undefined;
    return {
      deviceId: deviceId,
      tableId: result,
    };
  }

  private async refreshCache(data: DbStudioDeviceResult) {
    const cacheKey = this.getCacheKey();
    await this.cacheService.hSet(cacheKey, new Map([[data.deviceId, data.tableId]]));
  }

  async onInit(): Promise<void> {}
}
