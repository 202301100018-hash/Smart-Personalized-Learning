import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Sparkles } from 'lucide-react';

const UniversalLearningForm = () => {
  const [courseName, setCourseName] = useState('');
  const [days, setDays] = useState(30);
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
          studyHours: parseInt(studyHours),
          isUniversal: true
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
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            🤖
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Learning Platform
          </h1>
          <p className="text-blue-200">
            Learn anything with AI-powered personalized roadmaps
          </p>
        </div>

        {/* Form */}
        <div className="glass-effect rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                <Sparkles className="w-4 h-4 inline mr-2" />
                What do you want to learn?
              </label>
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter anything: Python, Cooking, Guitar, Quantum Physics, Digital Marketing, etc."
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                required
              />
              <p className="text-xs text-blue-300 mt-2">
                ✨ AI will create a complete learning roadmap for any topic you enter
              </p>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                How long do you want to learn?
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
                <option value={180} className="bg-gray-800">6 Months</option>
                <option value={365} className="bg-gray-800">1 Year</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Your current level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="Complete Beginner" className="bg-gray-800">Complete Beginner</option>
                <option value="Beginner" className="bg-gray-800">Beginner</option>
                <option value="Intermediate" className="bg-gray-800">Intermediate</option>
                <option value="Advanced" className="bg-gray-800">Advanced</option>
                <option value="Expert" className="bg-gray-800">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Daily study time: {studyHours}h
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={studyHours}
                onChange={(e) => setStudyHours(e.target.value)}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-blue-200 mt-1">
                <span>1h</span>
                <span>6h</span>
                <span>12h</span>
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
                className={`flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>AI is creating your roadmap...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate AI Roadmap</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200">
            <div>🎯 Personalized Learning Path</div>
            <div>📹 AI-Curated Videos</div>
            <div>📊 Progress Tracking</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UniversalLearningForm;