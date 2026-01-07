import React from 'react';
import { motion } from 'framer-motion';
import { Delete, CornerDownLeft } from 'lucide-react';
import { logError } from '../services/logService';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Backspace'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Clear', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Enter'],
];

const Keyboard = ({ usedLetters, onKeyPress, darkMode, onClear }) => {
  const getKeyClass = (key) => {
    const baseClass = "py-3 sm:py-4 rounded font-semibold text-sm sm:text-base md:text-lg flex items-center justify-center";
    if (key === 'Enter') return `${baseClass} px-3 sm:px-4 ${darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`;
    if (key === 'Backspace') return `${baseClass} px-2 sm:px-3 ${darkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`;
    if (key === 'Clear') return `${baseClass} px-2 sm:px-3 ${darkMode ? 'bg-gray-500 text-white' : 'bg-gray-400 text-white'}`;
    if (!usedLetters[key]) return `${baseClass} px-2 sm:px-3 ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`;
    if (usedLetters[key] === 'correct') return `${baseClass} px-2 sm:px-3 bg-green-500 text-white`;
    if (usedLetters[key] === 'present') return `${baseClass} px-2 sm:px-3 bg-yellow-500 text-white`;
    return `${baseClass} px-2 sm:px-3 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-500 text-white'}`;
  };

  const handleKeyPress = (key) => {
    try {
      if (key === 'Clear') {
        onClear && onClear();
      } else {
        onKeyPress(key);
      }
    } catch (error) {
      logError('Error handling key press', error);
    }
  };

  const renderKey = (key) => {
    if (key === 'Backspace') {
      return <Delete size={18} />;
    }
    if (key === 'Enter') {
      return <CornerDownLeft size={18} />;
    }
    if (key === 'Clear') {
      return 'CLR';
    }
    return key;
  };

  return (
    <div className="mb-4 w-full max-w-xl">
      {KEYBOARD_ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-1.5 my-1 sm:my-1.5">
          {row.map((key) => (
            <motion.button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={getKeyClass(key)}
              whileTap={{ scale: 0.95 }}
              title={key === 'Backspace' ? 'Delete letter' : key === 'Enter' ? 'Submit guess' : key === 'Clear' ? 'Clear all' : key}
            >
              {renderKey(key)}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
