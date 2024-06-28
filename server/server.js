const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const words = require('./data/words');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// API endpoint to get the daily word
app.get('/api/daily-word', (req, res) => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % words.length;
  res.json({ 
    word: words[index].word,
    hints: {
      hint1: words[index].hint1,
      hint2: words[index].hint2,
      hint3: words[index].hint3
    },
    validWords: words.map(word => word.word)
  });
});

// Analytics logging function
const logAnalytics = async (event) => {
  const logPath = path.join(__dirname, 'analytics.log');
  const logEntry = `${new Date().toISOString()} - ${JSON.stringify(event)}\n`;
  try {
    await fs.appendFile(logPath, logEntry);
  } catch (error) {
    console.error('Error logging analytics:', error);
  }
};

// API endpoint to log analytics events
app.post('/api/log-event', (req, res) => {
  const { event } = req.body;
  logAnalytics(event);
  res.sendStatus(200);
});

// New API endpoint to validate words using Oxford API
app.get('/api/validate-word', async (req, res) => {
  const { word } = req.query;
  const API_URL = process.env.REACT_APP_OXFORD_API_URL;
  const APP_ID = process.env.REACT_APP_OXFORD_APP_ID;
  const APP_KEY = process.env.REACT_APP_OXFORD_APP_KEY;

  if (!API_URL || !APP_ID || !APP_KEY) {
    console.error('Oxford API credentials are not set');
    return res.status(500).json({ error: 'Oxford API credentials are not set' });
  }

  try {
    const response = await axios.get(`${API_URL}/search/en-gb`, {
      params: {
        q: word,
        limit: 1,
        offset: 0,
        prefix: 'false'
      },
      headers: {
        'Accept': 'application/json',
        'app_id': APP_ID,
        'app_key': APP_KEY,
      }
    });
    res.json({ isValid: response.data.results && response.data.results.length > 0 });
  } catch (error) {
    console.error('Error validating word:', error);
    res.status(500).json({ error: 'Error validating word' });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
