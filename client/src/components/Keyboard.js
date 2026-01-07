import React from 'react';
import { motion } from 'framer-motion';
import { logError } from '../services/logService';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
];

const Keyboard = ({ usedLetters, onKeyPress, darkMode }) => {
  const getKeyClass = (key) => {
    const isWide = key === 'Enter' || key === 'Backspace';
    const baseClass = `h-14 rounded font-bold text-xs sm:text-sm flex items-center justify-center select-none transition-colors ${isWide ? 'px-3 sm:px-4 min-w-[65px] sm:min-w-[65px]' : 'w-8 sm:w-10'}`;

    if (!usedLetters[key]) {
      return `${baseClass} ${darkMode ? 'bg-gray-500 hover:bg-gray-400 text-white' : 'bg-gray-300 hover:bg-gray-400 text-black'}`;
    }
    if (usedLetters[key] === 'correct') return `${baseClass} bg-green-600 text-white`;
    if (usedLetters[key] === 'present') return `${baseClass} bg-yellow-500 text-white`;
    return `${baseClass} ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-500 text-white'}`;
  };

  const getAriaLabel = (key) => {
    if (key === 'Backspace') return 'backspace';
    if (key === 'Enter') return 'enter';
    return `add ${key.toLowerCase()}`;
  };

  const handleKeyPress = (key) => {
    try {
      onKeyPress(key);
    } catch (error) {
      logError('Error handling key press', error);
    }
  };

  const renderKey = (key) => {
    if (key === 'Backspace') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
          <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"/>
        </svg>
      );
    }
    if (key === 'Enter') {
      return 'enter';
    }
    return key.toLowerCase();
  };

  return (
    <div className="w-full max-w-lg mx-auto px-2" role="group" aria-label="Keyboard">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 my-1.5">
          {/* Add half-width spacer for middle row to center it */}
          {i === 1 && <div className="w-4 sm:w-5 flex-shrink-0" />}
          {row.map((key) => (
            <motion.button
              key={key}
              type="button"
              data-key={key === 'Enter' ? '↵' : key === 'Backspace' ? '←' : key.toLowerCase()}
              onClick={() => handleKeyPress(key)}
              className={getKeyClass(key)}
              whileTap={{ scale: 0.95 }}
              aria-label={getAriaLabel(key)}
            >
              {renderKey(key)}
            </motion.button>
          ))}
          {/* Add half-width spacer for middle row to center it */}
          {i === 1 && <div className="w-4 sm:w-5 flex-shrink-0" />}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
