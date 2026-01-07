import { geographicalNames } from './geographicalNames';
import axios from 'axios';

// Use a Set for O(1) lookup time
const geographicalNamesSet = new Set(geographicalNames.map(name => name.toUpperCase()));

const validationCache = new Map();
const MAX_CACHE_SIZE = 1000;

// Debounce invalid word logging to avoid excessive API calls
let pendingInvalidWords = new Set();
let logTimeout = null;

const logInvalidWords = async () => {
  if (pendingInvalidWords.size === 0) return;

  const wordsToLog = Array.from(pendingInvalidWords);
  pendingInvalidWords.clear();

  try {
    // Log all pending invalid words
    await Promise.all(
      wordsToLog.map(word =>
        axios.post('/api/log-invalid-word', { word }).catch(() => {})
      )
    );
  } catch (error) {
    // Silently fail - not critical
  }
};

const scheduleLogInvalidWord = (word) => {
  pendingInvalidWords.add(word);

  if (logTimeout) {
    clearTimeout(logTimeout);
  }

  logTimeout = setTimeout(logInvalidWords, 2000);
};

// Check if word is valid English using free dictionary API
const checkEnglishWord = async (word) => {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`,
      { timeout: 3000 }
    );
    return response.status === 200;
  } catch (error) {
    // If API fails or word not found, return false
    return false;
  }
};

export const validateWord = async (word) => {
  const upperCaseWord = word.toUpperCase();

  // Check cache first
  if (validationCache.has(upperCaseWord)) {
    return validationCache.get(upperCaseWord);
  }

  // First check if the word is in the geographical names set (fast, local check)
  if (geographicalNamesSet.has(upperCaseWord)) {
    validationCache.set(upperCaseWord, true);
    return true;
  }

  // If not a geographical name, check if it's a valid English word
  const isEnglishWord = await checkEnglishWord(upperCaseWord);

  // Manage cache size
  if (validationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = validationCache.keys().next().value;
    validationCache.delete(firstKey);
  }

  validationCache.set(upperCaseWord, isEnglishWord);

  // Log invalid words asynchronously (debounced) - only if neither geo nor English
  if (!isEnglishWord) {
    scheduleLogInvalidWord(upperCaseWord);
  }

  return isEnglishWord;
};

// For testing purposes
export const clearValidationCache = () => {
  validationCache.clear();
};

export const isValidGeographicalName = (word) => {
  return geographicalNamesSet.has(word.toUpperCase());
};
