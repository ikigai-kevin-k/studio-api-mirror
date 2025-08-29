/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModuleLifecycle } from '@ikigaians/mod';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { CacheService } from 'src/cache/cache.service';
import { AppConfigService } from 'src/config';
import { LoggerService } from 'src/log';
import { LosConnectFailureError } from 'src/los/errors/los-connect-failure';
import { LosNotFoundTokenError } from 'src/los/errors/los-not-found-token';
import { CdnGroup } from './los-cdn.service.type';

export class LosCdnService implements ModuleLifecycle {
  constructor(
    private readonly cacheService: CacheService,
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  private async getToken() {
    // This is a provisional measure that will be replaced with a formal implementation after the Access Manager finalizes the token mechanism.
    // return await this.cacheService.get(`studio-los-token-${this.appConfigService.amConfig.user}`);
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJMT1MtZTBhNmIxNWItMTNjOS00NzYwLWExNzItMGVjOTFjODA0MzUzIiwiaWF0IjoxNzU1ODQ3NjQzLCJleHAiOjE3NTg0Nzc0NDN9.XZMve2mVKHlr-GHsekLrUzi5x-RVeXVJAYQsy1Gf9eA';
  }

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

  private async sendCDN(tableId: string, token: string, data: CdnGroup) {
    const config = {
      headers: {
        accept: 'application/json',
        'x-access-token': token,
        'Content-Type': 'application/json',
      },
    };

    return await axios.patch(
      `${this.appConfigService.losConfig.url}/v1/internal/tables/${tableId}`,
      { streams: data },
      config,
    );
  }

  async updateCDN(tableId: string, data: CdnGroup) {
    const token = await this.getToken();
    if (!token) throw new LosNotFoundTokenError(`Token is Null !!`);
    const resp = await this.send(() => this.sendCDN(tableId, token, data), 3);
    if (!resp) throw new LosConnectFailureError(`send ${tableId} cdn failure !!`);

    this.logger.info(resp.data.data);
  }

  async onInit() {}

  async onDispose(): Promise<void> {}
}
