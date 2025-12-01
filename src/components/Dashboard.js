import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Clock, Play, BookOpen, Download, Award } from 'lucide-react';
import { generateCompleteRoadmap } from '../services/mainService';
import { generateCategoryRoadmap } from '../services/categoryService';
import { generateQuiz } from '../services/quizGenerator';
import { exportRoadmapToPDF, exportProgressReport } from '../utils/exportUtils';

import { useLearning } from '../contexts/LearningContext';
import VideoCard from './VideoCard';
import QuizModal from './QuizModal';
import ProgressChart from './ProgressChart';
import SimpleRoadmapView from './SimpleRoadmapView';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentRoadmap, progress, dispatch, loading, error } = useLearning();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [viewMode, setViewMode] = useState('detailed');
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Auto-fallback timer
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
      
      // Auto-fallback after 8 seconds
      const autoFallback = setTimeout(async () => {
        if (loading && location.state) {
          console.log('Auto-fallback triggered after 8 seconds');
          const state = location.state;
          const candidates = [state.courseName, state.customCourse, state.subcategory, state.courseType];
          const fallbackName = (candidates.find(v => typeof v === 'string' && v.trim().length > 0) || 'Learning Course').trim();
          const { days, skillLevel, studyHours } = state;
          try {
            // Import the fallback generator
            const { generateCompleteRoadmap } = await import('../services/mainService');
            const fallbackRoadmap = await generateCompleteRoadmap(
              fallbackName,
              days || 7,
              skillLevel || 'Intermediate',
              studyHours || 2
            );
            dispatch({ type: 'SET_ROADMAP', payload: fallbackRoadmap });
          } catch (error) {
            console.error('Auto-fallback failed:', error);
            // Last resort fallback
            const basicFallback = {
              courseName: fallbackName,
              totalDays: days || 7,
              skillLevel: skillLevel || 'Intermediate',
              studyHours: studyHours || 2,
              roadmap: [{
                day: 1,
                topics: [{
                  id: '1_1',
                  title: `Getting Started with ${fallbackName}`,
                  description: 'Begin your learning journey',
                  duration: '2 hours',
                  difficulty: 'Beginner',
                  category: 'Theory',
                  videos: [],
                  completed: false
                }],
                isRevisionDay: false,
                completed: false
              }],
              createdAt: new Date().toISOString(),
              progress: {
                completedDays: 0,
                completedTopics: 0,
                totalTopics: 1,
                quizScore: 0,
                streak: 0,
                xpPoints: 0
              }
            };
            dispatch({ type: 'SET_ROADMAP', payload: basicFallback });
          }
        }
      }, 8000);
      
      return () => {
        clearInterval(timer);
        clearTimeout(autoFallback);
      };
    } else {
      setLoadingTime(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, location.state, dispatch]);

  useEffect(() => {
    const generateRoadmap = async () => {
      console.log('Dashboard useEffect triggered');
      console.log('Location state:', location.state);
      console.log('Current roadmap:', currentRoadmap);
      
      if (location.state && !currentRoadmap) {
        const selectionData = location.state;
        console.log('Starting roadmap generation with selection data:', selectionData);
        const resolveCourseName = (state) => {
          const candidates = [state.courseName, state.customCourse, state.subcategory, state.courseType];
          if (Array.isArray(state.selectedTopics) && state.selectedTopics.length > 0) {
            const topicsStr = state.selectedTopics.filter(t => t && t !== 'complete').join(' ');
            if (topicsStr) candidates.push(topicsStr);
          }
          const picked = candidates.find(v => typeof v === 'string' && v.trim().length > 0);
          return (picked || 'Learning Course').trim();
        };
        const safeCourseName = resolveCourseName(selectionData);
        
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          console.log('Loading state set to true');
          
          // Add timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Roadmap generation timed out')), 15000)
          );
          
          let roadmapPromise;
          
          // Use universal system for all courses
          console.log('Using universal AI roadmap + video generation');
          const { days, skillLevel, studyHours } = selectionData;
          roadmapPromise = generateCompleteRoadmap(
            safeCourseName,
            days,
            skillLevel || 'Intermediate',
            studyHours || 2
          );
          
          const generatedRoadmap = await Promise.race([roadmapPromise, timeoutPromise]);
          console.log('Roadmap generated successfully:', generatedRoadmap);
          dispatch({ type: 'SET_ROADMAP', payload: generatedRoadmap });
          
        } catch (error) {
          console.error('Dashboard roadmap generation error:', error);
          dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to generate roadmap' });
        }
      } else if (!location.state && !currentRoadmap) {
        console.log('No location state, navigating to home');
        navigate('/');
      } else {
        console.log('Roadmap already exists or no location state');
      }
    };

    generateRoadmap();
  }, [location.state, navigate, currentRoadmap, dispatch]);

  const handleDaySelect = async (dayIndex) => {
    setSelectedDay(dayIndex);
    const day = currentRoadmap.roadmap[dayIndex];
    
    // Real-time video loading based on user input and topics
    if (day.topics.some(topic => !topic.videos || topic.videos.length === 0)) {
      setLoadingVideos(true);
      console.log(`🎥 Loading real-time videos for Day ${day.day} based on user course: ${currentRoadmap.courseName}`);
      
      try {
        // Use universal AI video service
        const { getUniversalVideos } = await import('../services/universalVideoService');
        
        // Get all topics for AI analysis
        const allTopics = currentRoadmap.roadmap.flatMap(d => d.topics?.map(t => t.title) || []);
        
        // Calculate global topic index for this day
        let globalTopicIndex = 0;
        for (let i = 0; i < currentRoadmap.roadmap.length; i++) {
          if (currentRoadmap.roadmap[i].day < day.day) {
            globalTopicIndex += currentRoadmap.roadmap[i].topics?.length || 0;
          } else if (currentRoadmap.roadmap[i].day === day.day) {
            break;
          }
        }
        
        const topicsWithVideos = await Promise.all(
          day.topics.map(async (topic, topicIndex) => {
            const currentGlobalIndex = globalTopicIndex + topicIndex;
            const videos = await getUniversalVideos(
              topic.title, 
              currentRoadmap.courseName, 
              allTopics,
              currentGlobalIndex
            );
            return { ...topic, videos };
          })
        );
        
        const dayWithVideos = {
          ...day,
          topics: topicsWithVideos,
          videos: topicsWithVideos.flatMap(t => t.videos || [])
        };
        
        dispatch({ 
          type: 'UPDATE_DAY_VIDEOS', 
          payload: { dayIndex, day: dayWithVideos } 
        });
        
        console.log(`✅ AI Universal videos loaded for Day ${day.day}`);
      } catch (error) {
        console.error('Failed to load AI videos:', error);
      } finally {
        setLoadingVideos(false);
      }
    }
  };

  const handleTopicComplete = (dayIndex, topicId) => {
    dispatch({ type: 'COMPLETE_TOPIC', payload: { dayIndex, topicId } });
  };

  const handleDayComplete = (dayIndex) => {
    dispatch({ type: 'COMPLETE_DAY', payload: dayIndex });
  };

  const openQuiz = async (topic) => {
    setSelectedTopic(topic);
    setGeneratingQuiz(true);
    
    try {
      const quiz = await generateQuiz(topic, topic.difficulty);
      dispatch({ type: 'ADD_QUIZ', payload: quiz });
      setShowQuiz(true);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      // Show fallback quiz or error message
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setSelectedTopic(null);
  };

  const handleExportRoadmap = () => {
    if (currentRoadmap) {
      exportRoadmapToPDF(currentRoadmap);
    }
  };

  const handleExportProgress = () => {
    if (currentRoadmap && progress) {
      exportProgressReport(progress, currentRoadmap);
    }
  };

  if (loading) {
    const timeLeft = Math.max(0, 8 - loadingTime);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-white text-xl">Generating your personalized roadmap...</div>
          <div className="text-blue-200 text-sm mt-2">
            {timeLeft > 0 ? `Auto-loading in ${timeLeft}s` : 'Loading...'}
          </div>
          
          <button
            onClick={async () => {
              console.log('Manual fallback triggered');
              const { courseName, days, skillLevel, studyHours } = location.state || {};
              try {
                dispatch({ type: 'SET_LOADING', payload: true });
                const { generateCompleteRoadmap } = await import('../services/mainService');
                const fallbackRoadmap = await generateCompleteRoadmap(
                  courseName || 'Learning Course',
                  days || 7,
                  skillLevel || 'Intermediate',
                  studyHours || 2
                );
                dispatch({ type: 'SET_ROADMAP', payload: fallbackRoadmap });
              } catch (error) {
                console.error('Manual fallback failed:', error);
                dispatch({ type: 'SET_ERROR', payload: 'Failed to generate roadmap' });
              }
            }}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue with Sample Data
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error: {error}</div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!currentRoadmap) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">No roadmap found. Please generate a new one.</div>
      </div>
    );
  }

  const currentDay = currentRoadmap.roadmap[selectedDay];
  const dayVideos = currentDay.topics.reduce((acc, topic) => {
    if (topic.videos) {
      return [...acc, ...topic.videos];
    }
    return acc;
  }, []);
  const sortedDayVideos = [...dayVideos].sort((a, b) => {
    const aTime = (a && typeof a.startTime === 'number') ? a.startTime : 0;
    const bTime = (b && typeof b.startTime === 'number') ? b.startTime : 0;
    return aTime - bTime;
  });

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'detailed' ? 'simple' : 'detailed')}
              className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>{viewMode === 'detailed' ? 'Simple View' : 'Detailed View'}</span>
            </button>
            <button
              onClick={handleExportRoadmap}
              className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Roadmap</span>
            </button>
            <button
              onClick={handleExportProgress}
              className="flex items-center space-x-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Progress Report</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">{currentRoadmap.courseName}</h1>
          <p className="text-blue-200">
            {currentRoadmap.totalDays} Day Learning Journey • {progress.completedDays} Days Completed
          </p>
          <div className="flex justify-center space-x-4 mt-2 text-sm text-blue-300">
            <span>Skill Level: {currentRoadmap.skillLevel}</span>
            <span>•</span>
            <span>Study Hours: {currentRoadmap.studyHours}h/day</span>
            <span>•</span>
            <span>XP: {progress.xpPoints}</span>
          </div>
        </div>
      </motion.div>

      {viewMode === 'simple' ? (
        <SimpleRoadmapView 
          roadmap={currentRoadmap} 
          onTopicComplete={handleTopicComplete}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <ProgressChart progress={progress} />
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
          {/* Day Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Select Day
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {currentRoadmap.roadmap.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDaySelect(index)}
                  className={`p-3 rounded-lg text-center transition-all ${
                    selectedDay === index
                      ? 'bg-blue-500 text-white'
                      : day.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="font-semibold">Day {day.day}</div>
                  {day.isRevisionDay && (
                    <div className="text-xs opacity-75">Revision</div>
                  )}
                  {day.completed && <CheckCircle className="w-4 h-4 mx-auto mt-1" />}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Current Day Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Day {currentDay.day} Topics
              {currentDay.isRevisionDay && (
                <span className="ml-2 px-2 py-1 bg-yellow-500 text-black text-xs rounded-full">
                  Revision Day
                </span>
              )}
            </h2>
            
            <div className="space-y-4">
              {currentDay.topics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all ${
                    topic.completed
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{topic.title}</h3>
                      <p className="text-blue-200 text-sm mt-1">{topic.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-blue-300">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {topic.duration}
                        </span>
                        <span className="px-2 py-1 bg-blue-500/30 rounded-full">
                          {topic.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openQuiz(topic)}
                        disabled={generatingQuiz}
                        className={`px-3 py-1 bg-purple-500 text-white text-xs rounded-lg hover:bg-purple-600 transition-colors ${generatingQuiz ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {generatingQuiz ? 'Generating...' : 'Quiz'}
                      </button>
                      {!topic.completed && (
                        <button
                          onClick={() => handleTopicComplete(selectedDay, topic.id)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {!currentDay.completed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDayComplete(selectedDay)}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
              >
                Complete Day {currentDay.day}
              </motion.button>
            )}
          </motion.div>

          {/* Real-time Video Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-effect rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Real-time Video Suggestions for {currentRoadmap.courseName}
              {loadingVideos && (
                <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
            </h2>
            
            {loadingVideos ? (
              <div className="text-center py-8">
                <div className="text-blue-200">Finding best videos for your topics...</div>
              </div>
            ) : sortedDayVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedDayVideos.map((video, index) => (
                  <VideoCard key={video.id} video={video} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-blue-200 mb-4">No videos loaded yet for Day {currentDay.day}</div>
                <button
                  onClick={() => handleDaySelect(selectedDay)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Load Videos for {currentRoadmap.courseName}
                </button>
              </div>
            )}
          </motion.div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && selectedTopic && (
        <QuizModal
          topic={selectedTopic}
          onClose={closeQuiz}
          onComplete={(score) => {
            dispatch({ 
              type: 'UPDATE_QUIZ_SCORE', 
              payload: score 
            });
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
