export enum RoutesEnum {
  // service urls
  V1_STUDIO_TABLE = '/v1/service/table',
  V1_STUDIO_TABLE_CDN = '/v1/service/cdn',
  V1_STUDIO_TABLE_STATUS = '/v1/service/status',

  V1_LOS_DEVICE = '/v1/service/los/:deviceId',
  V1_LOS_DEVICE_LOGIN = '/v1/service/los/login/:deviceId',
  V1_LOS_TOKEN_REFRESH = '/v1/service/los/refresh/:deviceId',
}
