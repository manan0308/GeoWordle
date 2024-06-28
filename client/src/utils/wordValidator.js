import axios from 'axios';

const cache = new Map();
const MAX_CACHE_SIZE = 1000;
let callCount = 0;
const MAX_CALLS_PER_MINUTE = 60;
let lastResetTime = Date.now();

const resetCallCount = () => {
  const now = Date.now();
  if (now - lastResetTime >= 60000) {
    callCount = 0;
    lastResetTime = now;
  }
};

export const validateWord = async (word) => {
  console.log('Validating word:', word);
  if (cache.has(word)) {
    return cache.get(word);
  }
  resetCallCount();
  if (callCount >= MAX_CALLS_PER_MINUTE) {
    console.warn('API rate limit reached. Try again later.');
    return true; // Assume valid to avoid blocking the game
  }
  try {
    const response = await axios.get(`/api/validate-word?word=${word}`);
    console.log('API response:', response.data);
    callCount++;
    const isValid = response.data.isValid;
    
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    cache.set(word, isValid);
    return isValid;
  } catch (error) {
    console.error('Error validating word:', error);
    return true; // Assume valid to avoid blocking the game
  }
};
