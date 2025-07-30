import { ModuleManager } from '@ikigaians/mod';
import { startApp } from 'src/app';
import { LoggerService } from 'src/log';
import { StudioMod } from 'src/mod';

startApp(new ModuleManager(LoggerService).registerProfile(...StudioMod));
