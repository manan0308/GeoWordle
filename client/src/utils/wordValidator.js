import { geographicalNames } from './geographicalNames';
import axios from 'axios';

// Use a Set for O(1) lookup time
const geographicalNamesSet = new Set(geographicalNames.map(name => name.toUpperCase()));

const invalidWordsLog = new Set();
const validationCache = new Map();

export const validateWord = async (word) => {
  const upperCaseWord = word.toUpperCase();

  // Check cache first
  if (validationCache.has(upperCaseWord)) {
    return validationCache.get(upperCaseWord);
  }

  // Check if the word is in the geographical names set
  if (geographicalNamesSet.has(upperCaseWord)) {
    validationCache.set(upperCaseWord, true);
    return true;
  }

  // Log invalid word
  invalidWordsLog.add(upperCaseWord);

  // Log invalid words to the server
  try {
    await axios.post('/api/log-invalid-word', { word: upperCaseWord });
  } catch (error) {
    console.error('Error logging invalid word:', error);
  }

  validationCache.set(upperCaseWord, false);
  return false;
};

export const getInvalidWordsLog = () => Array.from(invalidWordsLog);

// Periodically clear the cache to prevent it from growing too large
setInterval(() => {
  validationCache.clear();
}, 1000 * 60 * 60); // Clear cache every hour
