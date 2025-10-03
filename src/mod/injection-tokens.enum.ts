import { CommonInjectionTokensEnum } from '@ikigaians/common';

export const InjectionTokensEnum = {
  ...CommonInjectionTokensEnum,
  DB_SERVICE: 'dbService',
  DB_LOGGER_SERVICE: 'dbLoggerService',

  STUDIO_REPOSITORY: 'studioRepository',
  STUDIO_SERVICE: 'studioService',
  STUDIO_CONTROLLER: 'studioController',

  STUDIO_CDN_REPOSITORY: 'studioCdnRepository',
  STUDIO_CDN_SERVICE: 'studioCdnService',
  STUDIO_CDN_CONTROLLER: 'studioCdnController',

  STUDIO_STATUS_REPOSITORY: 'studioStatusRepository',
  STUDIO_STATUS_SERVICE: 'studioStatusService',
  STUDIO_STATUS_CONTROLLER: 'studioStatusController',
  STUDIO_STATUS_OBSERVER: 'studioStatusObserver',

  STUDIO_DEVICE_DATA_REPOSITORY: 'studioDeviceDataRepository',
  STUDIO_DEVICE_DATA_SERVICE: 'studioDeviceDataService',
  STUDIO_DEVICE_DATA_CONTROLLER: 'studioDeviceDataController',

  WS_SERVICE: 'wsService',

  LOS_SIGNAL_SERVICE: 'losSignalService',
  LOS_SIGNAL_OBSERVER: 'losSignalObserver',

  TABLE_API_TABLE_SERVICE: 'tableApiTableService',
  TABLE_API_CDN_SERVICE: 'tableApiCdnService',
  TABLE_API_SIGNAL_SERVICE: 'tableApiSignalService',
  TABLE_API_SIGNAL_OBSERVER: 'tableApiSignalObserver',

  QA_SIGNAL_SIMULATOR_CONTROLLER: 'qaSignalSimulatorController',

  SLACK_SERVICE: 'slackService',
} as const;
