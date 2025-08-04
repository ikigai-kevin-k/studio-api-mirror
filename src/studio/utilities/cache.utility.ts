/* eslint-disable @typescript-eslint/no-explicit-any */
export function isFieldsEqual<A extends object, B extends object>(a: A, b: B): boolean {
  return (Object.keys(a) as (keyof A)[]).every((key) => {
    return key in b && a[key] === (b as any)[key];
  });
}
