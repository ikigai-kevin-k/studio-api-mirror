import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { StudioDeviceDataRepository } from 'src/studio/repositories/studio-device/studio-device-data.repository';
import {
  DeviceDataServiceOutput,
  GetDeviceDataServiceInput,
  InsertDeviceDataServiceInput,
  UpdateDeviceDataServiceInput,
} from './studio-device-data.service.type';

export class StudioDeviceDataService implements ModuleLifecycle {
  constructor(
    private readonly studioDeviceDataRepository: StudioDeviceDataRepository,
    private readonly logger: LoggerService,
  ) {}

  async getDevice(input: GetDeviceDataServiceInput): Promise<DeviceDataServiceOutput> {
    return await this.studioDeviceDataRepository.getDeviceByID(input.deviceId);
  }

  async insertDevice(input: InsertDeviceDataServiceInput): Promise<DeviceDataServiceOutput> {
    const output = await this.studioDeviceDataRepository.insertDevice(input.deviceId);
    return output;
  }

  async updateDevice(type: UpdateDeviceDataServiceInput): Promise<DeviceDataServiceOutput> {
    return await this.studioDeviceDataRepository.updateDevice(type);
  }

  async getDeviceBelongTo(deviceId: string) {
    const result = await this.studioDeviceDataRepository.getDeviceByID(deviceId);
    return result.tableId;
  }

  async onInit(): Promise<void> {}
}
