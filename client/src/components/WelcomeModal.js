import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WelcomeModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Welcome to GeoWordle! 🌍</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <p>Welcome to GeoWordle, a geographical spin-off of Wordle! 🗺️</p>
            <div className="space-y-2">
              <p>🏙️ Guess today's geographical location in 6 tries or less!</p>
              <p>🌆 Each guess must be a valid city or country name</p>
              <p>🧩 Play it like normal Wordle, but with a geographical twist</p>
              <p>💡 Use the hints icon on the top left to get clues about the location</p>
              <p>🎨 The color of the tiles will change to show how close your guess was:</p>
              <div className="pl-6 space-y-1">
                <p>🟩 Green: Correct letter in the correct spot</p>
                <p>🟨 Yellow: Correct letter in the wrong spot</p>
                <p>⬜ Gray: Letter not in the word</p>
              </div>
            </div>
            <p>Good luck and have fun exploring the world! 🌎</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeModal;
