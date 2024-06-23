import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const RulesModal = ({ show, onClose, darkMode }) => {
  if (!show) return null;

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
          <button onClick={onClose} className="p-1">
            <X size={24} />
          </button>
        </div>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Guess the GeoWordle in 6 tries.</li>
          <li>Each guess must be a valid 5-letter geographical name (city, country, etc.).</li>
          <li>The color of the tiles will change to show how close your guess was to the word.</li>
        </ul>
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center font-bold mr-2">W</div>
            <span>The letter W is in the word and in the correct spot.</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-500 text-white flex items-center justify-center font-bold mr-2">I</div>
            <span>The letter I is in the word but in the wrong spot.</span>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-500 text-white flex items-center justify-center font-bold mr-2">U</div>
            <span>The letter U is not in the word in any spot.</span>
          </div>
        </div>
        <p>A new GeoWordle will be available each day!</p>
      </div>
    </motion.div>
  );
};

export default RulesModal;