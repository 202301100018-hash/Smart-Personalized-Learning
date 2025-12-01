import { generateCompleteRoadmap } from './mainService';

export const generateSmartRoadmap = async (courseName, days, skillLevel = 'Intermediate', studyHours = 2) => {
  try {
    console.log('🚀 Starting smart roadmap generation for:', courseName);
    return await generateCompleteRoadmap(courseName, days, skillLevel, studyHours);
  } catch (error) {
    console.error('❌ Smart roadmap generation failed:', error);
    throw error;
  }
};



export const calculateProgress = (roadmap) => {
  const totalTopics = roadmap.reduce((acc, day) => acc + day.topics.length, 0);
  const completedTopics = roadmap.reduce((acc, day) => 
    acc + day.topics.filter(topic => topic.completed).length, 0
  );
  const completedDays = roadmap.filter(day => day.completed).length;
  
  return {
    totalTopics,
    completedTopics,
    completedDays,
    completionPercentage: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
  };
};