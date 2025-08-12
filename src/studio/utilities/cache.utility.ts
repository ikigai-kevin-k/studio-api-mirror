/* eslint-disable @typescript-eslint/no-explicit-any */
export function isFieldsEqual(source: Record<string, any>, target: Record<string, any>): boolean {
  return Object.entries(source).every(([key, value]) => {
    const targetValue = target[key];

    if (typeof value === 'object' && value !== null) {
      return isFieldsEqual(value, targetValue);
    }

    return value === targetValue;
  });
}
