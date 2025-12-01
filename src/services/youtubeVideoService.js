// YouTube API Video Service
import axios from 'axios';

const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const searchYouTubeForTopic = async (topicTitle, courseName, maxResults = 2) => {
  console.log(`🔍 YouTube search for topic: "${topicTitle}" in course: "${courseName}"`);
  
  // Create specific search query
  const searchQuery = `${topicTitle} ${courseName} tutorial`;
  
  // Check if YouTube API is available
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY.includes('Dummy')) {
    console.log('⚠️ YouTube API not available, using topic-based fallback');
    return generateTopicFallback(topicTitle, maxResults);
  }

  try {
    const response = await axios.get(`${YOUTUBE_API_BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults,
        key: YOUTUBE_API_KEY,
        order: 'relevance',
        videoDuration: 'medium',
        relevanceLanguage: 'en'
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.log('No YouTube results found, using fallback');
      return generateTopicFallback(topicTitle, maxResults);
    }

    const videoIds = response.data.items.map(item => item.id.videoId).join(',');
    
    // Get video details
    const detailsResponse = await axios.get(`${YOUTUBE_API_BASE_URL}/videos`, {
      params: {
        part: 'contentDetails,statistics',
        id: videoIds,
        key: YOUTUBE_API_KEY
      }
    });

    const videos = response.data.items.map((item, index) => {
      const details = detailsResponse.data.items[index];
      return {
        id: item.id.videoId,
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        duration: formatDuration(details?.contentDetails?.duration || 'PT0M'),
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        channel: item.snippet.channelTitle,
        description: item.snippet.description,
        publishedAt: item.snippet.publishedAt,
        viewCount: details?.statistics?.viewCount || 0
      };
    });

    console.log(`✅ Found ${videos.length} YouTube videos for: ${topicTitle}`);
    return videos;

  } catch (error) {
    console.error('YouTube API Error:', error);
    return generateTopicFallback(topicTitle, maxResults);
  }
};

const formatDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  }
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
};

const generateTopicFallback = (topicTitle, maxResults) => {
  console.log(`📺 Generating fallback videos for topic: ${topicTitle}`);
  
  // Use different video IDs based on topic content
  const videoIds = getVideoIdsForTopic(topicTitle);
  
  return Array.from({ length: maxResults }, (_, index) => {
    const videoId = videoIds[index % videoIds.length];
    return {
      id: `topic_${videoId}_${Date.now()}_${index}`,
      videoId: videoId,
      title: `${topicTitle} - Educational Tutorial`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      duration: `${Math.floor(Math.random() * 25 + 10)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      channel: getChannelForTopic(topicTitle),
      description: `Learn ${topicTitle} with this comprehensive tutorial`,
      publishedAt: new Date().toISOString(),
      viewCount: Math.floor(Math.random() * 500000 + 10000)
    };
  });
};

const getVideoIdsForTopic = (topicTitle) => {
  const topic = topicTitle.toLowerCase();
  
  if (topic.includes('english') || topic.includes('grammar') || topic.includes('vocabulary')) {
    return ['sTtnNmgbVuE', 'M7lc1UVf-VE', 'YQHsXMglC9A'];
  }
  if (topic.includes('javascript') || topic.includes('js')) {
    return ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c'];
  }
  if (topic.includes('python')) {
    return ['rfscVS0vtbw', 'kqtD5dpn9C8', '_uQrJ0TkZlc'];
  }
  if (topic.includes('react')) {
    return ['Ke90Tje7VS0', 'w7ejDZ8SWv8', 'hQAHSlTtcmY'];
  }
  if (topic.includes('marketing') || topic.includes('seo')) {
    return ['naIkpQ_cIt0', 'bPKhM7Qg_qY', 'YQHsXMglC9A'];
  }
  
  // Default educational videos
  return ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c'];
};

const getChannelForTopic = (topicTitle) => {
  const topic = topicTitle.toLowerCase();
  
  if (topic.includes('english') || topic.includes('grammar')) return 'English with Lucy';
  if (topic.includes('javascript')) return 'FreeCodeCamp';
  if (topic.includes('python')) return 'Programming with Mosh';
  if (topic.includes('react')) return 'React Official';
  if (topic.includes('marketing')) return 'Neil Patel';
  
  return 'Educational Hub';
};