import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { CacheService } from 'src/cache/cache.service';
import { UNKNOWN_TABLE_CODE } from 'src/studio/const/studio.const';
import {
  GetDeviceRequestType,
  InsertDeviceRequestType,
  UpdateDeviceRequestType,
} from 'src/studio/controller/v1/studio-device/studio-device.type';
import { StudioDevice } from 'src/studio/entities/studio-device.entity';
import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import { StudioDeviceDataRepository } from 'src/studio/repositories/studio-device/studio-device-data.repository';
import { DeviceDataServiceOutput } from './studio-device-data.service.type';

export class StudioDeviceDataService implements ModuleLifecycle {
  constructor(
    private readonly studioDeviceDataRepository: StudioDeviceDataRepository,
    private readonly cacheService: CacheService,
    private readonly logger: LoggerService,
  ) {}

  async getDevice(type: GetDeviceRequestType): Promise<DeviceDataServiceOutput> {
    const output = await this.getCache(type.deviceId);
    if (!output) {
      throw new StudioNotFoundError(`device ${type.deviceId} not found`);
    }
    return {
      deviceId: type.deviceId,
      tableId: output,
    };
  }

  async insertDevice(type: InsertDeviceRequestType): Promise<DeviceDataServiceOutput> {
    const studio: StudioDevice = new StudioDevice();
    studio.deviceId = type.deviceId;
    studio.tableId = type.tableId ?? UNKNOWN_TABLE_CODE;

    const output = await this.studioDeviceDataRepository.insertDevice(studio);
    await this.refreshCache(output);
    return output;
  }

  async updateDevice(type: UpdateDeviceRequestType): Promise<DeviceDataServiceOutput> {
    const result = await this.studioDeviceDataRepository.updateDevice(type);
    if (result === undefined)
      throw new StudioNotFoundError(`deviceId ${type.deviceId} can't be found`);

    await this.refreshCache(result);
    return result;
  }

  async getDeviceBelongTo(deviceId: string) {
    return await this.getCache(deviceId);
  }

  private getCacheKey() {
    return `studio-device`;
  }

  private async getCache(deviceId: string): Promise<string | undefined> {
    const tag = this.getCacheKey();
    const cache = await this.cacheService.hmGet(tag, [deviceId]);
    const result = cache[0];
    if (!result) {
      const output = await this.studioDeviceDataRepository.getDeviceByID(deviceId);
      if (output) await this.cacheService.hSet(tag, new Map([[output.deviceId, output.tableId]]));
      return output?.tableId;
    }
    return result;
  }

  private async refreshCache(data: DeviceDataServiceOutput) {
    const cacheKey = this.getCacheKey();
    await this.cacheService.hSet(cacheKey, new Map([[data.deviceId, data.tableId]]));
  }

  async onInit(): Promise<void> {}
}
