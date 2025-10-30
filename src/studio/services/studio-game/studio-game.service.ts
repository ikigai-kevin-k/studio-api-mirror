import { LoggerService } from '@ikigaians/logger';
import { ModuleLifecycle } from '@ikigaians/mod';
import { StudioNotFoundError } from 'src/studio/errors/studio.error';
import { StudioGameRepository } from 'src/studio/repositories/studio-game/studio-game.repository';
import {
  GetStudioGameServiceInput,
  InsertStudioGameServiceInput,
  StudioGameServiceOutput,
  UpdateStudioGameServiceInput,
} from './studio-game.service.type';

export class StudioGameService implements ModuleLifecycle {
  constructor(
    private readonly studioGameRepository: StudioGameRepository,
    private readonly logger: LoggerService,
  ) {}

  async getGame(input: GetStudioGameServiceInput): Promise<StudioGameServiceOutput> {
    return await this.studioGameRepository.getGameByID(input.gameId);
  }

  async insertGame(input: InsertStudioGameServiceInput): Promise<StudioGameServiceOutput> {
    return await this.studioGameRepository.insertGame(input);
  }

  async updateGame(input: UpdateStudioGameServiceInput): Promise<StudioGameServiceOutput> {
    return await this.studioGameRepository.updateGame(input);
  }

  async switchCurrentTable(gameCode: string) {
    const game = await this.studioGameRepository.getGameByID(gameCode);
    if (!game) {
      throw new StudioNotFoundError(`[studio_game] gameCode ${gameCode} doesn't exist`);
    }

    const entity = {
      gameId: gameCode,
      currentTableId:
        game.currentTableId === game.primaryTableId ? game.secondaryTableId : game.primaryTableId,
    };

    const result = await this.studioGameRepository.updateGame(entity);
    return result.currentTableId;
  }

  async onInit(): Promise<void> {}
}
