export enum StudioTableStatusEnum {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  FAILURE = 'blocked',
  INITIAL = 'initial',
}

export enum StudioDeviceEnum {
  PRIMARY = 'Primary',
  SECONDARY = 'Secondary',
}

export enum StudioMachineEnum {
  ROULETTE = 'roulette',
  SCIBO = 'scibo',
}

export enum StudioMachineStatusEnum {
  DOWN = 'down',
  NORMAL = 'normal',
  FAILURE = 'failure',
}

export enum StudioServiceStatusEnum {
  UP = 'up',
  UP_RUNNING = 'up_running',
  UP_IDLE = 'up_idle',
  UP_RESUME = 'up_resume',
  DOWN = 'down',
  DOWN_PAUSE = 'down_pause',
  DOWN_CANCEL = 'down_cancel',
  STANDBY = 'standby',
  CALIBRATION = 'calibration',
  EXCEPTION = 'exception',
}

export enum StudioDeviceStatusEnum {
  UP = 'up',
  DOWN = 'down',
}
