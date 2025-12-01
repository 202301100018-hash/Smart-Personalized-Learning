import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';

const QuickRoadmap = () => {
  const [courseName, setCourseName] = useState('');
  const [days, setDays] = useState(21);
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [studyHours, setStudyHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (courseName.trim()) {
      setLoading(true);
      
      navigate('/dashboard', {
        state: {
          courseName: courseName.trim(),
          days: parseInt(days),
          skillLevel,
          studyHours: parseInt(studyHours)
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Quick Roadmap
          </h1>
          <p className="text-blue-200">
            Generate a learning roadmap in seconds
          </p>
        </div>

        {/* Form */}
        <div className="glass-effect rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                What do you want to learn?
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter ANY course or topic you want to learn (e.g., Quantum Physics, Cooking, Guitar, Machine Learning, etc.)"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                required
              />
              <p className="text-xs text-blue-300 mt-1">
                💡 You can enter absolutely anything - from academic subjects to hobbies, skills, or professional topics!
              </p>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Duration
              </label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value={7} className="bg-gray-800">1 Week</option>
                <option value={14} className="bg-gray-800">2 Weeks</option>
                <option value={21} className="bg-gray-800">3 Weeks</option>
                <option value={30} className="bg-gray-800">1 Month</option>
                <option value={60} className="bg-gray-800">2 Months</option>
                <option value={90} className="bg-gray-800">3 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Your Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="Beginner" className="bg-gray-800">Beginner</option>
                <option value="Intermediate" className="bg-gray-800">Intermediate</option>
                <option value="Advanced" className="bg-gray-800">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Daily Study Time: {studyHours}h
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-blue-200 mt-1">
                <span>1h</span>
                <span>4h</span>
                <span>8h</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading}
                className={`flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Generate Roadmap</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickRoadmap;