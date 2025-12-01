import React, { createContext, useContext, useReducer, useEffect } from 'react';

const LearningContext = createContext();

const initialState = {
  currentRoadmap: null,
  progress: {
    completedDays: 0,
    completedTopics: 0,
    totalTopics: 0,
    quizScore: 0,
    streak: 0,
    xpPoints: 0,
    level: 1,
    badges: []
  },
  userProfile: {
    skillLevel: 'Intermediate',
    studyHours: 2,
    preferences: {
      learningStyle: 'visual',
      notifications: true
    }
  },
  quizzes: {},
  loading: false,
  error: null
};

const learningReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_ROADMAP':
      return { 
        ...state, 
        currentRoadmap: action.payload,
        progress: { ...state.progress, totalTopics: action.payload.progress.totalTopics },
        loading: false,
        error: null
      };
    
    case 'UPDATE_PROGRESS':
      return { ...state, progress: { ...state.progress, ...action.payload } };
    
    case 'COMPLETE_TOPIC':
      const { dayIndex, topicId } = action.payload;
      const updatedRoadmap = { ...state.currentRoadmap };
      updatedRoadmap.roadmap[dayIndex].topics = updatedRoadmap.roadmap[dayIndex].topics.map(topic =>
        topic.id === topicId ? { ...topic, completed: true } : topic
      );
      
      const newCompletedTopics = state.progress.completedTopics + 1;
      const xpGained = 10;
      
      return {
        ...state,
        currentRoadmap: updatedRoadmap,
        progress: {
          ...state.progress,
          completedTopics: newCompletedTopics,
          xpPoints: state.progress.xpPoints + xpGained
        }
      };
    
    case 'COMPLETE_DAY':
      const dayIdx = action.payload;
      const updatedRoadmapForDay = { ...state.currentRoadmap };
      updatedRoadmapForDay.roadmap[dayIdx].completed = true;
      
      return {
        ...state,
        currentRoadmap: updatedRoadmapForDay,
        progress: {
          ...state.progress,
          completedDays: state.progress.completedDays + 1,
          streak: state.progress.streak + 1,
          xpPoints: state.progress.xpPoints + 50
        }
      };
    
    case 'ADD_QUIZ':
      return {
        ...state,
        quizzes: { ...state.quizzes, [action.payload.topicId]: action.payload }
      };
    
    case 'UPDATE_QUIZ_SCORE':
      return {
        ...state,
        progress: {
          ...state.progress,
          quizScore: Math.max(state.progress.quizScore, action.payload)
        }
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload }
      };
    
    case 'UPDATE_DAY_VIDEOS':
      const { dayIndex: dayIdx2, day } = action.payload;
      const updatedRoadmapVideos = { ...state.currentRoadmap };
      updatedRoadmapVideos.roadmap[dayIdx2] = day;
      
      return {
        ...state,
        currentRoadmap: updatedRoadmapVideos
      };
    
    default:
      return state;
  }
};

export const LearningProvider = ({ children }) => {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('learningPlatformData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.currentRoadmap) {
        dispatch({ type: 'SET_ROADMAP', payload: parsedData.currentRoadmap });
      }
      if (parsedData.progress) {
        dispatch({ type: 'UPDATE_PROGRESS', payload: parsedData.progress });
      }
      if (parsedData.userProfile) {
        dispatch({ type: 'UPDATE_PROFILE', payload: parsedData.userProfile });
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      currentRoadmap: state.currentRoadmap,
      progress: state.progress,
      userProfile: state.userProfile
    };
    localStorage.setItem('learningPlatformData', JSON.stringify(dataToSave));
  }, [state.currentRoadmap, state.progress, state.userProfile]);

  const value = {
    ...state,
    dispatch
  };

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};