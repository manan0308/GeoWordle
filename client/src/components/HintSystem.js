import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';

const HintSystem = ({ show, onClose, hints, darkMode }) => {
  const [revealedHints, setRevealedHints] = useState(0);

  const revealNextHint = () => {
    if (revealedHints < 3) {
      setRevealedHints(revealedHints + 1);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white p-6 rounded-lg max-w-md w-full ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Hints</h2>
              <button onClick={onClose} className="p-1">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((level) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: level <= revealedHints ? 1 : 0, height: level <= revealedHints ? 'auto' : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="font-semibold">Hint {level}:</p>
                  <p>{hints[`hint${level}`]}</p>
                </motion.div>
              ))}
            </div>
            {revealedHints < 3 && (
              <button
                onClick={revealNextHint}
                className={`mt-4 px-4 py-2 rounded ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
              >
                Reveal Next Hint
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HintSystem;