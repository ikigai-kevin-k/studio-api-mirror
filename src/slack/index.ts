import { ModuleProfile } from '@ikigaians/mod';
import { InjectionTokensEnum } from 'src/mod/injection-tokens.enum';
import { SlackService } from './slack.service';

export const SlackModule: ModuleProfile[] = [
  [InjectionTokensEnum.SLACK_SERVICE, SlackService],
] as const;
