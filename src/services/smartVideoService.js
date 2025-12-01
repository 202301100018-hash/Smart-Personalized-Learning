// Smart Video Service - Dynamic timeline based on user roadmap
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const getSmartVideos = async (topicTitle, courseName, allTopics, currentTopicIndex) => {
  console.log(`🎯 Smart video search for: "${topicTitle}" in "${courseName}"`);
  
  // Calculate dynamic timeline based on user's roadmap progression
  const timelinePosition = calculateDynamicTimeline(topicTitle, allTopics, currentTopicIndex);
  
  // Try YouTube API first for relevant videos
  if (YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes('Dummy')) {
    try {
      const videos = await searchRelevantVideos(topicTitle, courseName, timelinePosition);
      if (videos && videos.length > 0) {
        console.log(`✅ Found ${videos.length} relevant videos`);
        return videos;
      }
    } catch (error) {
      console.error('YouTube API failed:', error);
    }
  }
  
  // Fallback to smart curated videos
  return getSmartCuratedVideo(topicTitle, courseName, timelinePosition);
};

// Calculate timeline based on user's actual roadmap
function calculateDynamicTimeline(currentTopic, allTopics, currentIndex) {
  // Simple: 10 minutes per topic
  const timelineMinutes = currentIndex * 10;
  const timelineSeconds = timelineMinutes * 60;
  
  console.log(`🕰️ Timeline calc:`, {
    topic: currentTopic,
    index: currentIndex,
    minutes: timelineMinutes,
    seconds: timelineSeconds
  });
  
  return timelineSeconds;
}

// Determine topic complexity for timeline adjustment
function getTopicComplexity(topic) {
  const topicLower = topic.toLowerCase();
  
  // Beginner topics (start earlier)
  if (topicLower.includes('setup') || topicLower.includes('introduction') || 
      topicLower.includes('getting started') || topicLower.includes('basics')) {
    return -5; // Start 5 minutes earlier
  }
  
  // Advanced topics (start later)
  if (topicLower.includes('advanced') || topicLower.includes('pointer') || 
      topicLower.includes('memory') || topicLower.includes('optimization')) {
    return 10; // Start 10 minutes later
  }
  
  return 0; // Standard timing
}

// Search for relevant videos using YouTube API
async function searchRelevantVideos(topicTitle, courseName, timelinePosition) {
  const searchQuery = `${courseName} ${topicTitle} tutorial programming`;
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&type=video&q=${encodeURIComponent(searchQuery)}&` +
      `maxResults=5&key=${YOUTUBE_API_KEY}&` +
      `videoDuration=medium&order=relevance&safeSearch=strict`
    );
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }
    
    // Filter for educational content only
    const relevantVideos = data.items.filter(item => {
      const title = item.snippet.title.toLowerCase();
      const description = item.snippet.description.toLowerCase();
      
      // Must contain course-related keywords
      const hasRelevantKeywords = title.includes(courseName.toLowerCase()) || 
                                 title.includes(topicTitle.toLowerCase()) ||
                                 title.includes('tutorial') || title.includes('programming');
      
      // Must not contain irrelevant content
      const hasIrrelevantContent = title.includes('music') || title.includes('song') || 
                                  title.includes('funny') || title.includes('reaction');
      
      return hasRelevantKeywords && !hasIrrelevantContent;
    });
    
    if (relevantVideos.length === 0) {
      return null;
    }
    
    // Return the most relevant video with calculated timeline
    const bestVideo = relevantVideos[0];
    const minutes = Math.floor(timelinePosition / 60);
    const seconds = timelinePosition % 60;
    const timeParam = timelinePosition > 0 ? `&t=${minutes}m${seconds}s` : '';
    
    return [{
      id: `smart_${bestVideo.id.videoId}_${Date.now()}`,
      videoId: bestVideo.id.videoId,
      title: `${topicTitle} - ${bestVideo.snippet.title}`,
      thumbnail: bestVideo.snippet.thumbnails.medium?.url || bestVideo.snippet.thumbnails.default?.url,
      duration: 'N/A',
      url: `https://www.youtube.com/watch?v=${bestVideo.id.videoId}${timeParam}`,
      embedUrl: `https://www.youtube.com/embed/${bestVideo.id.videoId}?start=${timelinePosition}`,
      channel: bestVideo.snippet.channelTitle,
      description: `${topicTitle} tutorial. Video starts at ${Math.floor(timelinePosition/60)}:${(timelinePosition%60).toString().padStart(2,'0')}`,
      startTime: timelinePosition,
      isRelevant: true
    }];
    
  } catch (error) {
    console.error('YouTube search failed:', error);
    return null;
  }
}

// Smart curated video with calculated timeline
function getSmartCuratedVideo(topicTitle, courseName, timelinePosition) {
  const course = courseName.toLowerCase();
  
  // Use most reliable educational video IDs
  let videoId = 'KJgsSFOSQv0'; // Default programming tutorial
  let channel = 'Programming Tutorial';
  
  if (course.includes('javascript')) {
    videoId = 'W6NZfCO5SIk';
    channel = 'JavaScript Tutorial';
  } else if (course.includes('python')) {
    videoId = 'rfscVS0vtbw';
    channel = 'Python Tutorial';
  }
  
  const minutes = Math.floor(timelinePosition / 60);
  const seconds = timelinePosition % 60;
  const timeParam = timelinePosition > 0 ? `&t=${minutes}m${seconds}s` : '';
  
  return [{
    id: `curated_${videoId}_${Date.now()}`,
    videoId: videoId,
    title: `${topicTitle} Tutorial`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: '25:30',
    url: `https://www.youtube.com/watch?v=${videoId}${timeParam}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}?start=${timelinePosition}`,
    channel: channel,
    description: `Learn ${topicTitle}. Video starts at ${Math.floor(timelinePosition/60)}:${(timelinePosition%60).toString().padStart(2,'0')}`,
    startTime: timelinePosition,
    isRelevant: true
  }];
}

export default { getSmartVideos };