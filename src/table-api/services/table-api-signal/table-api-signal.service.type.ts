import { ErrorSignalInput } from 'src/global/types/error-signal.type';
import { TableApiSchema } from 'src/table-api/schema/table-api.schema';

export type TableApiSignalServiceInput = ErrorSignalInput;

export type TableApiSignalServiceOutput = TableApiSchema;
