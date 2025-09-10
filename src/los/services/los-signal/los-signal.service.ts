import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { AppConfigService } from 'src/config';
import { fetch } from 'undici';
import { LosSignalServiceInput, LosSignalServiceOutput } from './los-signal.service.type';

export class LosSignalService implements ModuleLifecycle {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly logger: LoggerService,
  ) {}

  private async getToken(deviceId: string) {
    this.logger.info(`get device = ${deviceId}`);
    // This is a provisional measure that will be replaced with a formal implementation after the Access Manager finalizes the token mechanism.
    return this.appConfigService.losConfig.token;
  }

  private async send(
    process: () => Promise<LosSignalServiceOutput>,
    maxRetry: number,
  ): Promise<LosSignalServiceOutput | undefined> {
    let attempt = 0;
    while (attempt < maxRetry) {
      try {
        return await process();
      } catch (error) {
        ++attempt;
        const reason = error as string;
        this.logger.error(reason);
      }
    }
  }

  private async sendSignal(
    tableId: string,
    token: string,
    data: LosSignalServiceInput,
  ): Promise<LosSignalServiceOutput> {
    const resp = await fetch(
      `${this.appConfigService.losConfig.url}/v1/internal/tables/${tableId}/broadcast`,
      {
        method: 'PATCH',
        headers: {
          accept: 'application/json',
          'x-access-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
    return (await resp.json()) as LosSignalServiceOutput;
  }

  async updateSignal(
    tableId: string,
    deviceId: string,
    data: LosSignalServiceInput,
  ): Promise<LosSignalServiceOutput> {
    const token = await this.getToken(deviceId);
    if (!token) throw new Error(`gameCode: ${tableId}, device: ${deviceId}, token is null !!`);
    const resp = await this.send(
      () => this.sendSignal(tableId, token, data),
      this.appConfigService.losConfig.retry,
    );
    if (!resp)
      throw new Error(
        `gameCode: ${tableId}, device: ${deviceId}, send los updateSignal failure !!`,
      );
    return resp;
  }

  async onInit(): Promise<void> {}
}
