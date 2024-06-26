import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { logError } from '../services/logService';

const RulesModal = ({ show, onClose, darkMode, wordLength }) => {
  if (!show) return null;

  const handleClose = () => {
    try {
      onClose();
    } catch (error) {
      logError('Error closing rules modal', error);
    }
  };

  const exampleWord = "PARIS";
  const exampleGuess = "PORTAL";

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={`bg-white p-6 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">How to Play</h2>
          <button onClick={handleClose} className="p-1">
            <X size={24} />
          </button>
        </div>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Guess the GeoWordle in 6 tries.</li>
          <li>Each guess must be a valid {wordLength}-letter word. Your objective is to guess the city name.</li>
          <li>You can use any English word or geographical name to help you get closer to the final city.</li>
          <li>The color of the tiles will change to show how close your guess was to the word.</li>
        </ul>
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center font-bold mr-2">P</div>
            <span>The letter P is in the word and in the correct spot.</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-500 text-white flex items-center justify-center font-bold mr-2">A</div>
            <span>The letter A is in the word but in the wrong spot.</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-500 text-white flex items-center justify-center font-bold mr-2">T</div>
            <span>The letter T is not in the word in any spot.</span>
          </div>
        </div>
        <div className="mb-4">
          <p className="font-bold">Example:</p>
          <p>If the word is {exampleWord} and you guess {exampleGuess}, the result would be:</p>
          <div className="flex mt-2">
            {exampleGuess.split('').map((letter, index) => (
              <div 
                key={index}
                className={`w-10 h-10 border-2 flex items-center justify-center font-bold text-2xl mr-1
                  ${exampleWord[index] === letter ? 'bg-green-500 border-green-500 text-white' :
                    exampleWord.includes(letter) ? 'bg-yellow-500 border-yellow-500 text-white' :
                    'bg-gray-500 border-gray-500 text-white'}`}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
        <p>A new GeoWordle will be available each day!</p>
      </div>
    </motion.div>
  );
};

export default RulesModal;
