// Quick test for roadmap generation
import { generateSmartRoadmap } from './services/roadmapGenerator.js';

const testRoadmapGeneration = async () => {
  console.log('Testing roadmap generation...');
  
  try {
    const startTime = Date.now();
    const roadmap = await generateSmartRoadmap('React Development', 7, 'Intermediate', 2);
    const endTime = Date.now();
    
    console.log('✅ Roadmap generated successfully!');
    console.log(`⏱️ Time taken: ${endTime - startTime}ms`);
    console.log('📊 Roadmap structure:', {
      courseName: roadmap.courseName,
      totalDays: roadmap.totalDays,
      totalTopics: roadmap.progress.totalTopics,
      firstDayTopics: roadmap.roadmap[0]?.topics?.length || 0
    });
    
    return true;
  } catch (error) {
    console.error('❌ Roadmap generation failed:', error);
    return false;
  }
};

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testRoadmapGeneration();
}

export { testRoadmapGeneration };