import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Target, Zap } from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';
import ProgressStepper from './CourseSelection/ProgressStepper';
import CourseTypeSelector from './CourseSelection/CourseTypeSelector';
import SubcategorySelector from './CourseSelection/SubcategorySelector';
import TopicSelector from './CourseSelection/TopicSelector';
import PreferencesSelector from './CourseSelection/PreferencesSelector';
import CustomInput from './CourseSelection/CustomInput';

const LandingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseType, setCourseType] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [days, setDays] = useState(90);
  const [skillLevel, setSkillLevel] = useState('Intermediate');
  const [studyHours, setStudyHours] = useState(2);
  const [customCourse, setCustomCourse] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useLearning();

  const steps = [
    'Course Type',
    'Subcategory', 
    'Topics',
    'Preferences'
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCourseTypeSelect = (type) => {
    if (type === 'custom') {
      setShowCustomInput(true);
      return;
    }
    setCourseType(type);
    setSubcategory('');
    setSelectedTopics([]);
    setShowCustomInput(false);
  };

  const handleCustomCourseSubmit = (course) => {
    setCustomCourse(course);
    setCourseType('custom');
    setSubcategory('custom');
    setSelectedTopics(['custom']);
    setShowCustomInput(false);
    setCurrentStep(4); // Skip to preferences
  };

  const handleSubcategorySelect = (sub) => {
    setSubcategory(sub);
    setSelectedTopics([]);
  };

  const handleTopicToggle = (topicId) => {
    if (topicId === 'complete') {
      setSelectedTopics(['complete']);
    } else {
      setSelectedTopics(prev => {
        const filtered = prev.filter(id => id !== 'complete');
        if (filtered.includes(topicId)) {
          return filtered.filter(id => id !== topicId);
        } else {
          return [...filtered, topicId];
        }
      });
    }
  };

  const handleSelectAll = () => {
    // Implementation for select all topics
    setSelectedTopics(['complete']);
  };

  const handleGenerate = async () => {
    setLoading(true);
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Update user profile
    dispatch({ 
      type: 'UPDATE_PROFILE', 
      payload: { skillLevel, studyHours } 
    });
    
    navigate('/dashboard', { 
      state: { 
        courseType,
        subcategory,
        selectedTopics,
        days: parseInt(days),
        skillLevel,
        studyHours: parseInt(studyHours),
        customCourse: courseType === 'custom' ? customCourse : ''
      } 
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return courseType !== '' || showCustomInput;
      case 2: return subcategory !== '';
      case 3: return selectedTopics.length > 0;
      case 4: return days > 0 && skillLevel !== '' && studyHours > 0;
      default: return false;
    }
  };

  const renderCurrentStep = () => {
    if (showCustomInput) {
      return (
        <CustomInput
          title="Custom Course"
          placeholder="Enter any course or topic (e.g., Machine Learning, Digital Photography, etc.)"
          onSubmit={handleCustomCourseSubmit}
          onBack={() => setShowCustomInput(false)}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <CourseTypeSelector
            selectedType={courseType}
            onSelect={handleCourseTypeSelect}
          />
        );
      case 2:
        return (
          <SubcategorySelector
            courseType={courseType}
            selectedSubcategory={subcategory}
            onSelect={handleSubcategorySelect}
          />
        );
      case 3:
        return (
          <TopicSelector
            courseType={courseType}
            subcategory={subcategory}
            selectedTopics={selectedTopics}
            onToggleTopic={handleTopicToggle}
            onSelectAll={handleSelectAll}
          />
        );
      case 4:
        return (
          <PreferencesSelector
            days={days}
            setDays={setDays}
            skillLevel={skillLevel}
            setSkillLevel={setSkillLevel}
            studyHours={studyHours}
            setStudyHours={setStudyHours}
            courseType={courseType}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            AI Learning
            <span className="gradient-text block">Roadmap</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto mb-6"
          >
            Create personalized learning paths with AI-powered recommendations
          </motion.p>
          
          {/* Quick Options */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => navigate('/quick')}
              className="glass-effect px-6 py-3 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              🚀 Quick Roadmap (Just Enter Course Name)
            </button>
            <button
              onClick={() => navigate('/universal')}
              className="glass-effect px-6 py-3 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              🤖 AI Universal Learning (Any Topic)
            </button>
          </div>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
        />

        {/* Main Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderCurrentStep()}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
              currentStep === 1
                ? 'opacity-50 cursor-not-allowed text-white/50'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                canProceed()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-500 text-white/50 cursor-not-allowed'
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              onClick={handleGenerate}
              disabled={loading || !canProceed()}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg transition-all ${
                loading || !canProceed()
                  ? 'bg-gray-500 text-white/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
              }`}
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
          )}
        </div>

        {/* Features */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="glass-effect rounded-xl p-6 text-center">
              <BookOpen className="w-12 h-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Structured Learning</h3>
              <p className="text-blue-100">Category-based learning paths</p>
            </div>
            <div className="glass-effect rounded-xl p-6 text-center">
              <Target className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Content</h3>
              <p className="text-blue-100">Tailored to your skill level and goals</p>
            </div>
            <div className="glass-effect rounded-xl p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
              <p className="text-blue-100">Smart recommendations and quizzes</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LandingPage;
