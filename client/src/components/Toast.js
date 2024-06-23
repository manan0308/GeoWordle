import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      } text-white`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <div className="flex items-center">
        <p className="mr-4">{message}</p>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;