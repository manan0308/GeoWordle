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
            <h2 className="text-2xl font-bold">Welcome to GeoWordle!</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <p>Guess today's geographical location in 6 tries or less!</p>
            <ul className="list-disc list-inside">
              <li>Each guess must be a valid geographical name</li>
              <li>The color of the tiles will change to show how close your guess was</li>
              <li>Green: Correct letter in the correct spot</li>
              <li>Yellow: Correct letter in the wrong spot</li>
              <li>Gray: Letter not in the word</li>
            </ul>
            <p>Good luck and have fun exploring the world!</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeModal;
