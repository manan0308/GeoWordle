const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const words = require('./data/words');

const app = express();
const PORT = process.env.PORT || 5001;

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
    }
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