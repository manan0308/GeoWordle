import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { logError } from '../services/logService';

const StatsModal = ({ show, onClose, stats, darkMode }) => {
  if (!show) return null;

  const { played, won, streak, maxStreak, guesses } = stats;
  const winPercentage = played > 0 ? Math.round((won / played) * 100) : 0;

  const handleClose = () => {
    try {
      onClose();
    } catch (error) {
      logError('Error closing stats modal', error);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={`p-6 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Statistics</h2>
          <button onClick={handleClose} className="p-1">
            <X size={24} className={darkMode ? 'text-white' : 'text-black'} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{played}</div>
            <div className="text-xs">Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{winPercentage}</div>
            <div className="text-xs">Win %</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{streak}</div>
            <div className="text-xs">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{maxStreak}</div>
            <div className="text-xs">Max Streak</div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Guess Distribution</h3>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="flex items-center">
              <div className="w-4 mr-2">{num}</div>
              <div className={`flex-grow ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}>
                <div
                  className="bg-green-500 text-xs font-medium text-white text-center p-0.5 rounded"
                  style={{ width: `${(guesses[num] || 0) / played * 100}%` }}
                >
                  {guesses[num] || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsModal;
