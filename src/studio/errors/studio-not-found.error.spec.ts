// studio-not-found.error.spec.ts
import { IkiError } from '@ikigaians/common';
import { StudioErrorsEnum } from 'src/studio/enums/studio-errors.enum';
import { StudioNotFoundError } from './studio-not-found.error';

describe('StudioNotFoundError', () => {
  it('should be an instance of StudioNotFoundError and IkiError', () => {
    const error = new StudioNotFoundError('Test message');
    expect(error).toBeInstanceOf(StudioNotFoundError);
    expect(error).toBeInstanceOf(IkiError);
  });

  it('should have the correct name property', () => {
    const error = new StudioNotFoundError('Test message');
    expect(error.name).toBe('StudioNotFoundError');
  });

  it('should have the correct code property', () => {
    const error = new StudioNotFoundError('Test message');
    expect(error.code).toBe(StudioErrorsEnum.STUDIO_TABLE_NOT_FOUND);
    expect(error.code).toBe(17_000);
  });

  it('should pass the message to the parent class', () => {
    const errorMessage = 'Studio not found for the specified tableId';
    const error = new StudioNotFoundError(errorMessage);
    expect(error.message).toBe(errorMessage);
  });

  it('should capture the stack trace and exclude the constructor call', () => {
    const error = new StudioNotFoundError('Test message');

    expect(error.stack).toBeDefined();

    const stackLines = error.stack?.split('\n');
    expect(stackLines?.[0]).toBe('StudioNotFoundError: Test message');
    expect(stackLines?.[1]).toContain('studio-not-found.error.spec.ts');
  });
});
