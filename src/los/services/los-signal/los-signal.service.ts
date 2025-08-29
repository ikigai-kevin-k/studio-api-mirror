import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { CacheService } from 'src/cache/cache.service';
import { AppConfigService } from 'src/config';
import { WsService } from 'src/ws/ws.service';
import { Unsubscribe } from 'src/ws/ws.service.type';
import { WebSocket } from 'ws';
import { SignalData } from './los-signal.service.type';

export class LosSignalService implements ModuleLifecycle {
  private unSubscribes: Unsubscribe[] = [];
  constructor(
    private readonly wsService: WsService,
    private readonly cacheService: CacheService,
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async getToken(deviceId: string) {
    // This is a provisional measure that will be replaced with a formal implementation after the Access Manager finalizes the token mechanism.
    // return await this.cacheService.get(`studio-los-token-${this.appConfigService.amConfig.user}`);
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJMT1MtZTBhNmIxNWItMTNjOS00NzYwLWExNzItMGVjOTFjODA0MzUzIiwiaWF0IjoxNzU1ODQ3NjQzLCJleHAiOjE3NTg0Nzc0NDN9.XZMve2mVKHlr-GHsekLrUzi5x-RVeXVJAYQsy1Gf9eA';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async send(process: () => Promise<AxiosResponse<any, any>>, maxRetry: number) {
    let attempt = 0;
    while (attempt < maxRetry) {
      try {
        return await process();
      } catch (error) {
        ++attempt;
        const reason = error as AxiosError;
        this.logger.error(reason.message);
      }
    }
  }

  private async sendSignal(tableId: string, token: string, data: SignalData) {
    const config = {
      headers: {
        accept: 'application/json',
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
    };

    return await axios.post(
      `${this.appConfigService.losConfig.url}/v1/internal/tables/${tableId}/broadcast`,
      data,
      config,
    );
  }

  async updateSignal(tableId: string, deviceId: string, data: SignalData) {
    const token = await this.getToken(deviceId);
    if (!token) throw new Error(`gameCode: ${tableId}, device: ${deviceId}, token is null !!`);
    const resp = await this.send(() => this.sendSignal(tableId, token, data), 3);
    if (!resp)
      throw new Error(
        `gameCode: ${tableId}, device: ${deviceId}, send los updateSignal failure !!`,
      );
    return resp.data.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async onServiceSignal(query: URLSearchParams, ws: WebSocket, data?: any) {
    try {
      const tableId = query.get('id');
      if (!tableId) throw new Error('Unknown tableId Exception Signal !!');
      const deviceId = query.get('device') ?? this.appConfigService.amConfig.user;
      const result = await this.updateSignal(tableId, deviceId, data.signal);
      this.logger.info(result);
    } catch (error) {
      const reason = (error as Error).toString();
      this.logger.error(reason);
    }
  }

  async onInit(): Promise<void> {
    this.unSubscribes = [this.wsService.subscribe('exception', this.onServiceSignal.bind(this))];
  }

  async onDispose(): Promise<void> {
    for (const unSubscribe of this.unSubscribes) {
      unSubscribe();
    }
  }
}
