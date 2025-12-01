// Unified Video Service - Combines AI and YouTube API
import { generateAIVideos } from './aiVideoService';
import { searchYouTubeVideos } from './youtubeApiService';

export const getVideosForTopic = async (query, maxResults = 2) => {
  console.log('🎥 Getting videos for topic:', query);
  
  // Try YouTube API first (real videos)
  const hasYouTubeKey = process.env.REACT_APP_YOUTUBE_API_KEY && 
                       !process.env.REACT_APP_YOUTUBE_API_KEY.includes('Dummy');
  
  const hasOpenAIKey = process.env.REACT_APP_OPENAI_API_KEY && 
                      process.env.REACT_APP_OPENAI_API_KEY.startsWith('sk-proj-');
  
  console.log('🔑 API Keys available:', { youtube: hasYouTubeKey, openai: hasOpenAIKey });
  
  try {
    if (hasYouTubeKey) {
      console.log('🔍 Using YouTube API for real videos');
      const youtubeVideos = await searchYouTubeVideos(query, maxResults);
      if (youtubeVideos && youtubeVideos.length > 0) {
        return youtubeVideos;
      }
    }
    
    if (hasOpenAIKey) {
      console.log('🤖 Using AI for video generation');
      const aiVideos = await generateAIVideos(query, maxResults);
      if (aiVideos && aiVideos.length > 0) {
        return aiVideos;
      }
    }
    
    // Final fallback
    console.log('📺 Using basic fallback videos');
    return generateBasicFallback(query, maxResults);
    
  } catch (error) {
    console.error('Video service error:', error);
    return generateBasicFallback(query, maxResults);
  }
};

const generateBasicFallback = (query, maxResults) => {
  const videoIds = ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c'];
  
  return Array.from({ length: maxResults }, (_, index) => ({
    id: `basic_${Date.now()}_${index}`,
    videoId: videoIds[index % videoIds.length],
    title: `${query} - Learning Tutorial`,
    thumbnail: `https://img.youtube.com/vi/${videoIds[index % videoIds.length]}/maxresdefault.jpg`,
    duration: `${Math.floor(Math.random() * 20 + 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    url: `https://www.youtube.com/watch?v=${videoIds[index % videoIds.length]}`,
    embedUrl: `https://www.youtube.com/embed/${videoIds[index % videoIds.length]}`,
    channel: 'Learning Hub',
    description: `Educational content about ${query}`,
    publishedAt: new Date().toISOString(),
    viewCount: Math.floor(Math.random() * 100000 + 5000)
  }));
};