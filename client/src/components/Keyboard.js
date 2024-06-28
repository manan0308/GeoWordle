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
    const baseClass = "px-1 py-2 rounded font-semibold text-xs sm:text-sm md:text-base";
    if (key === 'Enter' || key === 'Backspace') return `${baseClass} px-2 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`;
    if (!usedLetters[key]) return `${baseClass} ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`;
    if (usedLetters[key] === 'correct') return `${baseClass} bg-green-500 text-white`;
    if (usedLetters[key] === 'present') return `${baseClass} bg-yellow-500 text-white`;
    return `${baseClass} ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-500 text-white'}`;
  };

  const handleKeyPress = (key) => {
    try {
      onKeyPress(key);
    } catch (error) {
      logError('Error handling key press', error);
    }
  };

  return (
    <div className="mb-4 w-full max-w-lg">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 my-1">
          {row.map((key) => (
            <motion.button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={getKeyClass(key)}
              whileTap={{ scale: 0.95 }}
            >
              {key === 'Backspace' ? '←' : key}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
