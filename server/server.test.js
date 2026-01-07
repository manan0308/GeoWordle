const request = require('supertest');
const app = require('./server');

describe('GeoWordle Server API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/daily-word', () => {
    it('should return a word with hints for daily mode', async () => {
      const res = await request(app).get('/api/daily-word');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('word');
      expect(res.body).toHaveProperty('hints');
      expect(res.body.hints).toHaveProperty('hint1');
      expect(res.body.hints).toHaveProperty('hint2');
      expect(res.body.hints).toHaveProperty('hint3');
      expect(typeof res.body.word).toBe('string');
      expect(res.body.word.length).toBeGreaterThan(0);
    });

    it('should return same word for daily mode on same day', async () => {
      const res1 = await request(app).get('/api/daily-word?mode=daily');
      const res2 = await request(app).get('/api/daily-word?mode=daily');
      expect(res1.body.word).toBe(res2.body.word);
    });

    it('should return a word for endless mode', async () => {
      const res = await request(app).get('/api/daily-word?mode=endless');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('word');
      expect(res.body).toHaveProperty('hints');
    });

    it('should return different words in endless mode (probabilistic)', async () => {
      const words = new Set();
      for (let i = 0; i < 10; i++) {
        const res = await request(app).get('/api/daily-word?mode=endless');
        words.add(res.body.word);
      }
      // With 160+ words, getting 10 different words should be very likely
      expect(words.size).toBeGreaterThan(1);
    });
  });

  describe('GET /api/stats', () => {
    it('should return stats with word count', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('totalWords');
      expect(res.body).toHaveProperty('version');
      expect(res.body.totalWords).toBeGreaterThan(100);
    });
  });

  describe('POST /api/log-event', () => {
    it('should accept event logging', async () => {
      const res = await request(app)
        .post('/api/log-event')
        .send({ event: { type: 'test_event', data: 'test' } });
      expect(res.statusCode).toBe(200);
    });

    it('should handle missing event gracefully', async () => {
      const res = await request(app)
        .post('/api/log-event')
        .send({});
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /api/log-invalid-word', () => {
    it('should accept invalid word logging', async () => {
      const res = await request(app)
        .post('/api/log-invalid-word')
        .send({ word: 'TESTWORD123' });
      expect(res.statusCode).toBe(200);
    });

    it('should handle missing word gracefully', async () => {
      const res = await request(app)
        .post('/api/log-invalid-word')
        .send({});
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/invalid-words', () => {
    it('should return array of invalid words', async () => {
      const res = await request(app).get('/api/invalid-words');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

describe('Words Data', () => {
  const words = require('./data/words');

  it('should have at least 100 words', () => {
    expect(words.length).toBeGreaterThanOrEqual(100);
  });

  it('should have valid structure for all words', () => {
    words.forEach((wordObj, index) => {
      expect(wordObj).toHaveProperty('word');
      expect(wordObj).toHaveProperty('hint1');
      expect(wordObj).toHaveProperty('hint2');
      expect(wordObj).toHaveProperty('hint3');
      expect(typeof wordObj.word).toBe('string');
      expect(wordObj.word.length).toBeGreaterThan(0);
    });
  });

  it('should have uppercase words', () => {
    words.forEach((wordObj) => {
      expect(wordObj.word).toBe(wordObj.word.toUpperCase());
    });
  });

  it('should not have duplicate words', () => {
    const wordSet = new Set(words.map(w => w.word));
    expect(wordSet.size).toBe(words.length);
  });

  it('should have non-empty hints', () => {
    words.forEach((wordObj) => {
      expect(wordObj.hint1.length).toBeGreaterThan(0);
      expect(wordObj.hint2.length).toBeGreaterThan(0);
      expect(wordObj.hint3.length).toBeGreaterThan(0);
    });
  });
});
