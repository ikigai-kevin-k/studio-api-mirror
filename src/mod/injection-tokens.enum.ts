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

  STUDIO_GAME_REPOSITORY: 'studioGameRepository',
  STUDIO_GAME_SERVICE: 'studioGameService',
  STUDIO_GAME_CONTROLLER: 'studioGameController',

  STUDIO_ERROR_SIGNAL_LOG_REPOSITORY: 'studioErrorSignalLogRepository',
  STUDIO_ERROR_SIGNAL_LOG_SERVICE: 'studioErrorSignalLogService',
  STUDIO_ERROR_SIGNAL_LOG_CONTROLLER: 'studioErrorSignalLogController',

  STUDIO_ERROR_SIGNAL_SERVICE: 'studioErrorSignalService',
  STUDIO_ERROR_SIGNAL_OBSERVER: 'studioErrorSignalObserver',

  STUDIO_DEVICE_STATUS_OBSERVER: 'studioDeviceStatusObserver',

  STUDIO_STREAM_CONTROLLER: 'studioStreamController',
  STUDIO_CDN_CONTROLLER_V2: 'studioCdnControllerV2',

  GLOBAL_QUEUE_SERVICE: 'globalQueueService',
  GLOBAL_KAFKA_HUB: 'globalKafkaHub',
  KAFKA_LOS_SIGNAL_SERVICE: 'kafkaLosSignalService',

  WS_SERVICE: 'wsService',
  WS_CONTROLLER: 'wsController',

  TABLE_API_QUERY_SERVICE: 'tableApiQueryService',
  TABLE_API_FORWARD_SERVICE: 'tableApiForwardService',
  TABLE_API_SIGNAL_SERVICE: 'tableApiSignalService',

  SLACK_SERVICE: 'slackService',
} as const;
