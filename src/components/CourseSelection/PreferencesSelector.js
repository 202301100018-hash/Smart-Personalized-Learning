import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';

const PreferencesSelector = ({ 
  days, 
  setDays, 
  skillLevel, 
  setSkillLevel, 
  studyHours, 
  setStudyHours,
  courseType 
}) => {
  const getDurationOptions = () => {
    switch (courseType) {
      case 'competitive':
        return [
          { value: 30, label: '1 Month' },
          { value: 60, label: '2 Months' },
          { value: 90, label: '3 Months' },
          { value: 180, label: '6 Months' },
          { value: 365, label: '1 Year' }
        ];
      case 'college':
        return [
          { value: 30, label: '1 Month' },
          { value: 60, label: '2 Months' },
          { value: 90, label: '3 Months' },
          { value: 120, label: '4 Months' }
        ];
      case 'certifications':
        return [
          { value: 14, label: '2 Weeks' },
          { value: 30, label: '1 Month' },
          { value: 60, label: '2 Months' },
          { value: 90, label: '3 Months' }
        ];
      default:
        return [
          { value: 7, label: '1 Week' },
          { value: 14, label: '2 Weeks' },
          { value: 21, label: '3 Weeks' },
          { value: 30, label: '1 Month' },
          { value: 60, label: '2 Months' }
        ];
    }
  };

  const getSkillLevelDescription = () => {
    switch (courseType) {
      case 'programming':
        return {
          Beginner: 'New to programming or this language',
          Intermediate: 'Some programming experience',
          Advanced: 'Experienced programmer'
        };
      case 'competitive':
        return {
          Beginner: 'Starting exam preparation',
          Intermediate: 'Some preparation done',
          Advanced: 'Advanced level preparation'
        };
      case 'languages':
        return {
          Beginner: 'No prior knowledge of the language',
          Intermediate: 'Basic conversational skills',
          Advanced: 'Fluent speaker looking to improve'
        };
      default:
        return {
          Beginner: 'New to this subject',
          Intermediate: 'Some knowledge and experience',
          Advanced: 'Experienced in this area'
        };
    }
  };

  const skillDescriptions = getSkillLevelDescription();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Learning Preferences</h2>
        <p className="text-blue-200">Customize your learning experience</p>
      </div>

      {/* Duration Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-blue-300 mr-2" />
          <h3 className="text-lg font-semibold text-white">Learning Duration</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {getDurationOptions().map((option) => (
            <button
              key={option.value}
              onClick={() => setDays(option.value)}
              className={`p-3 rounded-lg text-center transition-all ${
                days === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="font-semibold">{option.label}</div>
              <div className="text-xs opacity-75">{option.value} days</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Skill Level Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <User className="w-5 h-5 text-blue-300 mr-2" />
          <h3 className="text-lg font-semibold text-white">Skill Level</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(skillDescriptions).map(([level, description]) => (
            <button
              key={level}
              onClick={() => setSkillLevel(level)}
              className={`p-4 rounded-lg text-left transition-all ${
                skillLevel === level
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <div className="font-semibold mb-1">{level}</div>
              <div className="text-sm opacity-75">{description}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Study Hours Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex items-center mb-4">
          <Clock className="w-5 h-5 text-blue-300 mr-2" />
          <h3 className="text-lg font-semibold text-white">Daily Study Hours: {studyHours}h</h3>
        </div>
        <div className="space-y-4">
          <input
            type="range"
            min="1"
            max="8"
            value={studyHours}
            onChange={(e) => setStudyHours(parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-blue-200">
            <span>1h (Light)</span>
            <span>4h (Moderate)</span>
            <span>8h (Intensive)</span>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-200">
              {studyHours <= 2 && "Perfect for busy schedules"}
              {studyHours > 2 && studyHours <= 4 && "Balanced learning pace"}
              {studyHours > 4 && studyHours <= 6 && "Accelerated learning"}
              {studyHours > 6 && "Intensive bootcamp style"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PreferencesSelector;