const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const words = require('./data/words');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API endpoint to get the daily word
app.get('/api/daily-word', (req, res) => {
  try {
    const mode = req.query.mode || 'daily';

    if (words.length === 0) {
      return res.status(500).json({ error: 'No words available' });
    }

    let index;
    if (mode === 'endless') {
      // Random word for endless mode
      index = Math.floor(Math.random() * words.length);
    } else {
      // Deterministic daily word based on date
      const today = new Date();
      const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
      index = seed % words.length;
    }

    const selectedWord = words[index];

    res.json({
      word: selectedWord.word,
      hints: {
        hint1: selectedWord.hint1,
        hint2: selectedWord.hint2,
        hint3: selectedWord.hint3
      }
    });
  } catch (error) {
    console.error('Error fetching daily word:', error);
    res.status(500).json({ error: 'Failed to fetch word' });
  }
});

// Analytics logging
const logAnalytics = async (event) => {
  if (process.env.NODE_ENV === 'test') return;

  const logPath = path.join(__dirname, 'analytics.log');
  const logEntry = `${new Date().toISOString()} - ${JSON.stringify(event)}\n`;

  try {
    await fs.appendFile(logPath, logEntry);
  } catch (error) {
    console.error('Error logging analytics:', error);
  }
};

// API endpoint to log analytics events
app.post('/api/log-event', async (req, res) => {
  try {
    const { event } = req.body;
    if (event) {
      await logAnalytics(event);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error in log-event:', error);
    res.sendStatus(500);
  }
});

const invalidWordsLogPath = path.join(__dirname, 'invalid_words.log');
const invalidWordsCache = new Set();

// Function to log invalid words
const logInvalidWord = async (word) => {
  if (process.env.NODE_ENV === 'test') return;

  const logEntry = `${new Date().toISOString()} - ${word}\n`;

  try {
    await fs.appendFile(invalidWordsLogPath, logEntry);
    invalidWordsCache.add(word);
  } catch (error) {
    console.error('Error logging invalid word:', error);
  }
};

// API endpoint to log invalid words
app.post('/api/log-invalid-word', async (req, res) => {
  try {
    const { word } = req.body;
    if (word && !invalidWordsCache.has(word)) {
      await logInvalidWord(word);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Error in log-invalid-word:', error);
    res.sendStatus(500);
  }
});

// API endpoint to get invalid words log
app.get('/api/invalid-words', async (req, res) => {
  try {
    if (invalidWordsCache.size === 0) {
      try {
        const data = await fs.readFile(invalidWordsLogPath, 'utf8');
        const words = data.split('\n').filter(Boolean).map(line => {
          const parts = line.split(' - ');
          return parts[1] || '';
        }).filter(Boolean);
        words.forEach(word => invalidWordsCache.add(word));
      } catch (readError) {
        // File might not exist yet
        if (readError.code !== 'ENOENT') {
          throw readError;
        }
      }
    }
    res.json(Array.from(invalidWordsCache));
  } catch (error) {
    console.error('Error reading invalid words log:', error);
    res.status(500).json({ error: 'Error retrieving invalid words' });
  }
});

// API endpoint to get word count (for stats)
app.get('/api/stats', (req, res) => {
  res.json({
    totalWords: words.length,
    version: '2.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Total words loaded: ${words.length}`);
  });
}

module.exports = app;
