import { initGA, trackEvent } from './analytics';

describe('analytics', () => {
  beforeEach(() => {
    delete window.gtag;
    delete window.dataLayer;
  });

  describe('initGA', () => {
    it('should not throw in test environment', () => {
      expect(() => initGA()).not.toThrow();
    });
  });

  describe('trackEvent', () => {
    it('should not throw when gtag is not initialized', () => {
      expect(() => trackEvent('test_event', { category: 'test' })).not.toThrow();
    });

    it('should handle missing window gracefully', () => {
      expect(() => trackEvent('test_event', {})).not.toThrow();
    });
  });
});
