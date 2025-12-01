import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CustomInput = ({ title, placeholder, onSubmit, onBack }) => {
  const [customValue, setCustomValue] = useState('');

  const handleSubmit = () => {
    if (customValue.trim()) {
      onSubmit(customValue.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-blue-200">Enter your custom course or topic</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="glass-effect p-6 rounded-xl">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={onBack}
              className="flex-1 py-3 px-6 bg-gray-500/20 text-white rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!customValue.trim()}
              className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomInput;