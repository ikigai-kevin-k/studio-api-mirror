import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { StudioCdnController } from './controller/v1/studio-cdn/studio-cdn.controller';
import { StudioDeviceDataController } from './controller/v1/studio-device/studio-device.controller';
import { StudioErrorSignalLogController } from './controller/v1/studio-log/studio-error-signal-log.controller';
import { StudioStatusController } from './controller/v1/studio-status/studio-status.controller';
import { StudioController } from './controller/v1/studio/studio.controller';
import { StudioDeviceStatusObserver } from './observers/studio-device-status/studio-device-status.observer';
import { StudioErrorSignalObserver } from './observers/studio-error-signal/studio-error-signal.observer';
import { StudioCdnRepository } from './repositories/studio-cdn/studio-cdn.repository';
import { StudioDeviceDataRepository } from './repositories/studio-device/studio-device-data.repository';
import { StudioErrorSignalLogRepository } from './repositories/studio-log/studio-error-signal-log.repository';
import { StudioStatusRepository } from './repositories/studio-status/studio-status.repository';
import { StudioRepository } from './repositories/studio/studio.repository';
import { StudioCdnService } from './services/studio-cdn/studio-cdn.service';
import { StudioDeviceDataService } from './services/studio-device/studio-device-data.service';
import { StudioErrorSignalService } from './services/studio-error-signal/studio-error-signal.service';
import { StudioErrorSignalLogService } from './services/studio-log/studio-error-signal-log.service';
import { StudioStatusService } from './services/studio-status/studio-status.service';
import { StudioService } from './services/studio/studio.service';
export const StudioModule: ModuleProfile[] = [
  [InjectionTokensEnum.STUDIO_REPOSITORY, StudioRepository],
  [InjectionTokensEnum.STUDIO_SERVICE, StudioService],
  [InjectionTokensEnum.STUDIO_CONTROLLER, StudioController],

  [InjectionTokensEnum.STUDIO_CDN_REPOSITORY, StudioCdnRepository],
  [InjectionTokensEnum.STUDIO_CDN_SERVICE, StudioCdnService],
  [InjectionTokensEnum.STUDIO_CDN_CONTROLLER, StudioCdnController],

  [InjectionTokensEnum.STUDIO_STATUS_REPOSITORY, StudioStatusRepository],
  [InjectionTokensEnum.STUDIO_STATUS_SERVICE, StudioStatusService],
  [InjectionTokensEnum.STUDIO_STATUS_CONTROLLER, StudioStatusController],

  [InjectionTokensEnum.STUDIO_DEVICE_DATA_REPOSITORY, StudioDeviceDataRepository],
  [InjectionTokensEnum.STUDIO_DEVICE_DATA_SERVICE, StudioDeviceDataService],
  [InjectionTokensEnum.STUDIO_DEVICE_DATA_CONTROLLER, StudioDeviceDataController],

  [InjectionTokensEnum.STUDIO_ERROR_SIGNAL_LOG_REPOSITORY, StudioErrorSignalLogRepository],
  [InjectionTokensEnum.STUDIO_ERROR_SIGNAL_LOG_SERVICE, StudioErrorSignalLogService],
  [InjectionTokensEnum.STUDIO_ERROR_SIGNAL_LOG_CONTROLLER, StudioErrorSignalLogController],

  [InjectionTokensEnum.STUDIO_ERROR_SIGNAL_SERVICE, StudioErrorSignalService],
  [InjectionTokensEnum.STUDIO_ERROR_SIGNAL_OBSERVER, StudioErrorSignalObserver],

  [InjectionTokensEnum.STUDIO_DEVICE_STATUS_OBSERVER, StudioDeviceStatusObserver],
] as const;
