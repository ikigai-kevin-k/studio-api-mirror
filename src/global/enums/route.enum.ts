export enum RoutesEnum {
  // studio
  V1_STUDIO_TABLE = '/v1/service/table',
  V1_STUDIO_TABLE_CDN = '/v1/service/cdn',
  V1_STUDIO_TABLE_STATUS = '/v1/service/status',
  V1_STUDIO_DEVICE = '/v1/service/device',
  V1_STUDIO_GAME = '/v1/service/game',

  // qa
  V1_QA_SIMULATE_TABLE_API_ERROR_SIGNAL = '/v1/service/qa/table-api/:gameCode/signal',
}
