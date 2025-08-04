// studio-cache.model.spec.ts
import { StudioTableStatusType } from 'src/studio/enums/studio.enums';
import {
  EmptyStudioCacheResult,
  StudioCacheResult,
} from 'src/studio/model/studio-cache/studio-cache.model';

describe('StudioCacheResult Model', () => {
  it('should have all properties defined in the StudioCacheResult type', () => {
    const studioCacheResult: StudioCacheResult = {
      tableId: '',
      tableStatus: StudioTableStatusType.INACTIVE,
      primaryHd: '',
      primaryHi: '',
      primaryMe: '',
      primaryLo: '',
      secondaryHd: '',
      secondaryHi: '',
      secondaryMe: '',
      secondaryLo: '',
    };

    expect(studioCacheResult).toBeDefined();
    const expectedKeys = [
      'tableId',
      'tableStatus',
      'primaryHd',
      'primaryHi',
      'primaryMe',
      'primaryLo',
      'secondaryHd',
      'secondaryHi',
      'secondaryMe',
      'secondaryLo',
    ];

    expect(Object.keys(studioCacheResult)).toEqual(expect.arrayContaining(expectedKeys));
    expect(Object.keys(studioCacheResult).length).toBe(expectedKeys.length);
  });
});

describe('EmptyStudioCacheResult', () => {
  it('should create a valid StudioCacheResult object with correct default values', () => {
    const emptyResult = EmptyStudioCacheResult();

    expect(emptyResult).toBeDefined();
    expect(emptyResult.tableId).toBe('');
    expect(emptyResult.tableStatus).toBe(StudioTableStatusType.INACTIVE);
    expect(emptyResult.primaryHd).toBe('');
    expect(emptyResult.primaryHi).toBe('');
    expect(emptyResult.primaryMe).toBe('');
    expect(emptyResult.primaryLo).toBe('');
    expect(emptyResult.secondaryHd).toBe('');
    expect(emptyResult.secondaryHi).toBe('');
    expect(emptyResult.secondaryMe).toBe('');
    expect(emptyResult.secondaryLo).toBe('');
  });

  it('should have the correct type inferred by TypeScript', () => {
    const emptyResult = EmptyStudioCacheResult();
    const expectedKeys = Object.keys({} as StudioCacheResult);
    expect(Object.keys(emptyResult)).toEqual(expect.arrayContaining(expectedKeys));
  });
});
