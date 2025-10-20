import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { WsController } from './ws.controller';
import { WsService } from './ws.service';

export const WsModule: ModuleProfile[] = [
  [InjectionTokensEnum.WS_SERVICE, WsService],
  [InjectionTokensEnum.WS_CONTROLLER, WsController],
] as const;
