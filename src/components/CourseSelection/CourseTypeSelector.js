import React from 'react';
import { motion } from 'framer-motion';
import { courseCategories, customCourseCategory } from '../../data/courseCategories';

const CourseTypeSelector = ({ selectedType, onSelect }) => {
  const categories = Object.entries(courseCategories);
  const allCategories = [...categories, ['custom', customCourseCategory]];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Learning Path</h2>
        <p className="text-blue-200">Select the type of course you want to learn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allCategories.map(([key, category]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: allCategories.indexOf([key, category]) * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(key)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedType === key
                ? 'bg-blue-500 border-2 border-blue-400'
                : 'glass-effect hover:bg-white/20 border-2 border-transparent'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
              <p className="text-sm text-blue-200">{category.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseTypeSelector;