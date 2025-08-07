/* eslint-disable unicorn/no-null */
// cache.utility.spec.ts
import { isFieldsEqual } from './cache.utility';

describe('isFieldsEqual', () => {
  it('should return true when all fields in object a are equal to fields in object b', () => {
    const a = { id: 1, name: 'test' };
    const b = { id: 1, name: 'test', extra: 'field' };
    expect(isFieldsEqual(a, b)).toBe(true);
  });

  it('should return false when a field in object a is not present in object b', () => {
    const a = { id: 1, name: 'test' };
    const b = { id: 1 };
    expect(isFieldsEqual(a, b)).toBe(false);
  });

  it('should return false when a field value in object a is not equal to object b', () => {
    const a = { id: 1, name: 'test' };
    const b = { id: 1, name: 'different' };
    expect(isFieldsEqual(a, b)).toBe(false);
  });

  it('should return true for empty objects', () => {
    const a = {};
    const b = { extra: 'field' };
    // Object.keys(a) returns an empty array, so .every() returns true by default
    expect(isFieldsEqual(a, b)).toBe(true);
  });

  it('should handle different data types correctly', () => {
    const a = { id: 1, isActive: true, value: null };
    const b = { id: 1, isActive: true, value: null, extra: 'field' };
    expect(isFieldsEqual(a, b)).toBe(true);

    const c = { id: 1, isActive: true, value: null };
    const d = { id: 1, isActive: false, value: null };
    expect(isFieldsEqual(c, d)).toBe(false);

    const e = { id: 1, value: undefined };
    const f = { id: 1, value: null };
    expect(isFieldsEqual(e, f)).toBe(false);
  });

  it('should return false when a field in object a is present in b but with a different type', () => {
    const a = { id: 1, value: '1' };
    const b = { id: 1, value: 1 };
    expect(isFieldsEqual(a, b)).toBe(false);
  });

  it('should return true when nested object', () => {
    const a = { id: 1, value: { deep: 1 } };
    const b = { id: 1, value: { deep: 1 } };
    expect(isFieldsEqual(a, b)).toBe(true);
  });
});
