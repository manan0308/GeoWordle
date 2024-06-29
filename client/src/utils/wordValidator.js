import axios from 'axios';
import { geographicalNames } from './geographicalNames'; // Import geographical names from the same directory

// Cache to store validated words
const cache = new Map();
const MAX_CACHE_SIZE = 1000;
let callCount = 0;
const MAX_CALLS_PER_MINUTE = 60;
let lastResetTime = Date.now();

// Function to reset the API call count
const resetCallCount = () => {
  const now = Date.now();
  if (now - lastResetTime >= 60000) {
    callCount = 0;
    lastResetTime = now;
  }
};

export const validateWord = async (word) => {
  console.log('Validating word:', word);
  const upperCaseWord = word.toUpperCase();

  // Check if the word is in the geographical names list
  if (geographicalNames.includes(upperCaseWord)) {
    return true;
  }

  // Check if the word is in the cache
  if (cache.has(upperCaseWord)) {
    return cache.get(upperCaseWord);
  }

  resetCallCount();
  if (callCount >= MAX_CALLS_PER_MINUTE) {
    console.warn('API rate limit reached. Try again later.');
    return true; // Assume valid to avoid blocking the game
  }

  try {
    // Make API call to validate the word
    const response = await axios.get(`/api/validate-word?word=${upperCaseWord}`);
    console.log('API response:', response.data);
    callCount++;
    const isValid = response.data.isValid;
    
    // Manage cache size
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    cache.set(upperCaseWord, isValid);
    return isValid;
  } catch (error) {
    console.error('Error validating word:', error);
    return true; // Assume valid to avoid blocking the game
  }
};
