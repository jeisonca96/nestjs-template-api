import { getSecondsFromDuration } from './auth.helper';

describe('getSecondsFromDuration', () => {
  it('should return the correct number of seconds for seconds input', () => {
    expect(getSecondsFromDuration('10s')).toBe(10);
  });

  it('should return the correct number of seconds for minutes input', () => {
    expect(getSecondsFromDuration('10m')).toBe(600);
  });

  it('should return the correct number of seconds for hours input', () => {
    expect(getSecondsFromDuration('10h')).toBe(36000);
  });

  it('should return the correct number of seconds for days input', () => {
    expect(getSecondsFromDuration('10d')).toBe(864000);
  });

  it('should throw an error for invalid duration format', () => {
    expect(() => getSecondsFromDuration('10x')).toThrow(
      'Invalid duration format',
    );
  });

  it('should throw an error for missing unit', () => {
    expect(() => getSecondsFromDuration('10')).toThrow(
      'Invalid duration format',
    );
  });

  it('should throw an error for non-numeric value', () => {
    expect(() => getSecondsFromDuration('xs')).toThrow(
      'Invalid duration format',
    );
  });
});
