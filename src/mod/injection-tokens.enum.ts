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

  WS_SERVICE: 'wsService',

  LOS_AUTH_REPOSITORY: 'losAuthRepository',
  LOS_AUTH_SERVICE: 'losAuthService',
  LOS_CDN_SERVICE: 'losCdnService',
  LOS_SIGNAL_SERVICE: 'losSignalService',
  LOS_CONTROLLER: 'losController',

  SLACK_SERVICE: 'slackService',
} as const;
