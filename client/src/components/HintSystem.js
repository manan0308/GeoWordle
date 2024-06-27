import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ChevronRight } from 'lucide-react';
import { logError } from '../services/logService';

const HintSystem = ({ show, onClose, hints, darkMode }) => {
  const [revealedHints, setRevealedHints] = useState(0);

  const revealNextHint = () => {
    if (revealedHints < 3) {
      setRevealedHints(revealedHints + 1);
      window.gtag('event', 'use_hint', {
        'event_category': 'Game',
        'event_label': `Hint ${revealedHints + 1} Revealed`
      });
    }
  };

  const hintVariants = {
    hidden: { opacity: 0, height: 0, marginBottom: 0 },
    visible: { opacity: 1, height: 'auto', marginBottom: 16 },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white rounded-lg max-w-md w-full overflow-hidden shadow-2xl ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold flex items-center">
                <MapPin className="mr-2" size={24} />
                Hints
              </h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((level) => (
                <motion.div
                  key={level}
                  variants={hintVariants}
                  initial="hidden"
                  animate={level <= revealedHints ? "visible" : "hidden"}
                  transition={{ duration: 0.5 }}
                  className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg ${
                    level <= revealedHints ? '' : 'hidden'
                  }`}
                >
                  <p className="font-semibold text-lg mb-2">Hint {level}:</p>
                  <p>{hints[`hint${level}`]}</p>
                </motion.div>
              ))}
              {revealedHints < 3 && (
                <motion.button
                  onClick={revealNextHint}
                  className={`w-full mt-4 px-4 py-3 rounded-lg flex items-center justify-center font-semibold ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reveal Next Hint
                  <ChevronRight className="ml-2" size={20} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HintSystem;
