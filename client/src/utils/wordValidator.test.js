import { validateWord, clearValidationCache, isValidGeographicalName } from './wordValidator';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe('wordValidator', () => {
  beforeEach(() => {
    clearValidationCache();
  });

  describe('isValidGeographicalName', () => {
    it('should return true for valid city names', () => {
      expect(isValidGeographicalName('PARIS')).toBe(true);
      expect(isValidGeographicalName('TOKYO')).toBe(true);
      expect(isValidGeographicalName('LONDON')).toBe(true);
      expect(isValidGeographicalName('BERLIN')).toBe(true);
    });

    it('should be case insensitive', () => {
      expect(isValidGeographicalName('paris')).toBe(true);
      expect(isValidGeographicalName('Paris')).toBe(true);
      expect(isValidGeographicalName('PARIS')).toBe(true);
    });

    it('should return false for invalid words', () => {
      expect(isValidGeographicalName('ZZZZZ')).toBe(false);
      expect(isValidGeographicalName('NOTACITY')).toBe(false);
    });

    it('should recognize newly added cities', () => {
      expect(isValidGeographicalName('DUBAI')).toBe(true);
      expect(isValidGeographicalName('SINGAPORE')).toBe(true);
      expect(isValidGeographicalName('MARRAKECH')).toBe(true);
      expect(isValidGeographicalName('SANTORINI')).toBe(true);
    });
  });

  describe('validateWord', () => {
    it('should return true for valid words', async () => {
      const result = await validateWord('PARIS');
      expect(result).toBe(true);
    });

    it('should return false for invalid words', async () => {
      const result = await validateWord('INVALIDWORD');
      expect(result).toBe(false);
    });

    it('should cache results', async () => {
      const result1 = await validateWord('LONDON');
      const result2 = await validateWord('LONDON');
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('should handle empty strings', async () => {
      const result = await validateWord('');
      expect(result).toBe(false);
    });
  });
});
