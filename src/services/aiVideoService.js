// AI-Powered Video Generation Service
let openai = null;

// Initialize OpenAI for video generation
if (process.env.REACT_APP_OPENAI_API_KEY && process.env.REACT_APP_OPENAI_API_KEY.startsWith('sk-proj-')) {
  try {
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
    console.log('✅ AI Video Service initialized');
  } catch (error) {
    console.log('❌ AI Video Service initialization failed:', error);
  }
}

export const generateAIVideos = async (query, maxResults = 2) => {
  console.log('🤖 AI generating videos for:', query);
  
  if (!openai) {
    console.log('⚠️ OpenAI not available for video generation');
    return generateFallbackVideos(query, maxResults);
  }

  try {
    const prompt = `Generate ${maxResults} specific, educational video recommendations for: "${query}"

Create realistic video data that would help someone learn this exact topic.

Return ONLY valid JSON array:
[
  {
    "title": "Specific educational title about ${query}",
    "channel": "Realistic educational channel name",
    "duration": "MM:SS format",
    "description": "What this video teaches about ${query}",
    "viewCount": realistic_number
  }
]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content;
    const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
    const aiVideos = JSON.parse(cleanContent);
    
    console.log('✅ AI generated videos:', aiVideos.length);
    
    return aiVideos.map((video, index) => {
      const videoId = getVideoId(query, index);
      return {
        id: `ai_${Date.now()}_${index}`,
        videoId: videoId,
        title: video.title,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        duration: video.duration,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        channel: video.channel,
        description: video.description,
        publishedAt: new Date().toISOString(),
        viewCount: video.viewCount || Math.floor(Math.random() * 500000 + 10000)
      };
    });
  } catch (error) {
    console.error('AI video generation failed:', error);
    return generateFallbackVideos(query, maxResults);
  }
};

const getVideoId = (query, index) => {
  const videoIds = {
    'english': ['sTtnNmgbVuE', 'M7lc1UVf-VE', 'YQHsXMglC9A'],
    'javascript': ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c'],
    'python': ['rfscVS0vtbw', 'kqtD5dpn9C8', '_uQrJ0TkZlc'],
    'marketing': ['naIkpQ_cIt0', 'bPKhM7Qg_qY', 'YQHsXMglC9A'],
    'default': ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c']
  };
  
  const queryLower = query.toLowerCase();
  let selectedIds = videoIds.default;
  
  for (const [key, ids] of Object.entries(videoIds)) {
    if (queryLower.includes(key)) {
      selectedIds = ids;
      break;
    }
  }
  
  return selectedIds[index % selectedIds.length];
};

const generateFallbackVideos = (query, maxResults) => {
  console.log('📺 Generating fallback videos for:', query);
  
  const videoIds = ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c'];
  
  return Array.from({ length: maxResults }, (_, index) => ({
    id: `fallback_${Date.now()}_${index}`,
    videoId: videoIds[index % videoIds.length],
    title: `${query} - Complete Tutorial`,
    thumbnail: `https://img.youtube.com/vi/${videoIds[index % videoIds.length]}/maxresdefault.jpg`,
    duration: `${Math.floor(Math.random() * 30 + 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    url: `https://www.youtube.com/watch?v=${videoIds[index % videoIds.length]}`,
    embedUrl: `https://www.youtube.com/embed/${videoIds[index % videoIds.length]}`,
    channel: 'Educational Hub',
    description: `Learn ${query} with this comprehensive tutorial`,
    publishedAt: new Date().toISOString(),
    viewCount: Math.floor(Math.random() * 100000 + 5000)
  }));
};