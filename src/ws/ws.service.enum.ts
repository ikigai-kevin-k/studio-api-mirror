// reference https://github.com/Luka967/websocket-close-codes
export enum WsCloseCodeEnum {
  NormalClosure = 1000,
  GoingAway = 1001,
  ProtocolError = 1002,
  UnsupportedData = 1003,
  NoStatusRcvd = 1005,
  AbnormalClosure = 1006,
  InvalidFramePayloadData = 1007,
  PolicyViolation = 1008,
  MessageTooBig = 1009,
  MandatoryExt = 1010,
  InternalError = 1011,
  ServiceRestart = 1012,
  TryAgainLater = 1013,
  BadGateway = 1014,
  TLSHandshake = 1015,
  Unauthorized = 3000,
  Forbidden = 3003,
  Timeout = 3008,
}

export enum WsResponseType {
  Error = 'error',
  Ack = 'ack',
  Kick = 'kick',
  Device = 'deviceStatus',
  Signal = 'errorSignal',
}
