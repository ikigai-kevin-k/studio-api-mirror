import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { WsService } from './ws.service';

export const WsModule: ModuleProfile[] = [[InjectionTokensEnum.WS_SERVICE, WsService]] as const;
