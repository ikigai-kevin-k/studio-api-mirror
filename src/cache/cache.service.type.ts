type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'object';

export type Schema<T> = {
  [K in keyof T]: FieldType;
};

export const reverseParsers = {
  string: (v: string) => v,
  number: (v: string) => +v,
  boolean: (v: string) => v === 'true',
  date: (v: string) => new Date(Number(v)),
  object: (v: string) => JSON.parse(v),
} as const;
