// Main Service - Universal Roadmap and Video Generation for ALL Categories
import { generateRoadmap } from './cleanRoadmapService';
import { getUniversalVideos } from './universalVideoService';

// Test function to verify universal system works for any course
export const testUniversalSystem = async (courseName) => {
  console.log(`🧪 Testing universal system for: "${courseName}"`);
  
  try {
    // Test roadmap generation
    const roadmap = await generateRoadmap(courseName, 7, 'Intermediate', 2);
    console.log(`✅ Roadmap test passed for "${courseName}" - ${roadmap.roadmap.length} days generated`);
    
    // Test video generation for first topic
    if (roadmap.roadmap[0]?.topics[0]) {
      const firstTopic = roadmap.roadmap[0].topics[0];
      const videos = await getUniversalVideos(firstTopic.title, courseName, [], 0);
      console.log(`✅ Video test passed for "${firstTopic.title}" - ${videos?.length || 0} videos found`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Universal system test failed for "${courseName}":`, error);
    return false;
  }
};

export const generateCompleteRoadmap = async (courseName, days, skillLevel = 'Intermediate', studyHours = 2) => {
  try {
    console.log('🚀 Starting universal roadmap + video generation for:', courseName);
    
    // Step 1: Generate roadmap
    const roadmapData = await generateRoadmap(courseName, days, skillLevel, studyHours);
    console.log('✅ Universal roadmap generated successfully');
    
    // Step 2: Add universal videos to first day only (for performance)
    if (roadmapData.roadmap.length > 0) {
      const firstDay = roadmapData.roadmap[0];
      console.log(`🎥 Adding universal videos to day 1 for "${courseName}"`);
      
      const allTopicTitles = roadmapData.roadmap.flatMap(d => d.topics?.map(t => t.title) || []);
      
      const topicsWithVideos = await Promise.all(
        firstDay.topics.map(async (topic, topicIndex) => {
          console.log(`🎥 Generating universal videos for: ${topic.title}`);
          try {
            const videos = await getUniversalVideos(topic.title, courseName, allTopicTitles, topicIndex);
            return { ...topic, videos: videos || [] };
          } catch (error) {
            console.error(`❌ Video generation failed for ${topic.title}:`, error);
            return { ...topic, videos: [] };
          }
        })
      );
      
      roadmapData.roadmap[0].topics = topicsWithVideos;
      console.log('✅ First day universal videos added successfully');
    }
    
    return roadmapData;
    
  } catch (error) {
    console.error('❌ Universal roadmap generation failed:', error);
    throw error;
  }
};

export const loadVideosForDay = async (day, courseName) => {
  console.log(`🚀 Loading universal videos for "${courseName}" - Day ${day.day}`);
  
  try {
    const topics = day.topics || [];
    if (topics.length === 0) {
      console.log('⚠️ No topics found for this day');
      return { ...day, videos: [] };
    }
    
    console.log(`🎥 Fetching universal videos for ${topics.length} topics in "${courseName}"`);
    
    // Calculate global topic index for proper AI timeline
    let globalTopicIndex = (day.day - 1) * topics.length;
    
    const topicsWithVideos = await Promise.all(
      topics.map(async (topic, topicIndex) => {
        console.log(`🤖 Universal AI search for Day ${day.day} Topic ${topicIndex + 1}: "${topic.title}" in "${courseName}"`);
        const currentGlobalIndex = globalTopicIndex + topicIndex;
        
        try {
          const videos = await getUniversalVideos(topic.title, courseName, [], currentGlobalIndex);
          console.log(`✅ Found ${videos?.length || 0} universal videos for: ${topic.title}`);
          return { ...topic, videos: videos || [] };
        } catch (error) {
          console.error(`❌ Video search failed for ${topic.title}:`, error);
          return { ...topic, videos: [] };
        }
      })
    );
    
    // Collect all videos for the day
    const dayVideos = topicsWithVideos.flatMap(topic => topic.videos || []);
    
    console.log(`✅ Universal video loading complete: ${dayVideos.length} videos for "${courseName}" Day ${day.day}`);
    
    return {
      ...day,
      topics: topicsWithVideos,
      videos: dayVideos
    };
  } catch (error) {
    console.error('❌ Universal video loading failed:', error);
    return { ...day, videos: [] };
  }
};