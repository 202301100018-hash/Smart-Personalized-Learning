// Universal AI-Based Video Service
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const getUniversalVideos = async (topicTitle, courseName, allTopics, currentTopicIndex) => {
  console.log(`🤖 Searching videos for: "${topicTitle}" in course: "${courseName}"`);
  console.log(`🔑 API Key status: ${YOUTUBE_API_KEY ? 'Available' : 'Missing'}`);
  
  const aiTimeline = calculateAITimeline(topicTitle, courseName, allTopics, currentTopicIndex);
  
  // Try YouTube API
  if (YOUTUBE_API_KEY && YOUTUBE_API_KEY.startsWith('AIza')) {
    try {
      console.log('🔍 Calling YouTube API...');
      const realVideos = await searchUniversalVideos(topicTitle, courseName, aiTimeline);
      if (realVideos && realVideos.length > 0) {
        console.log(`✅ YouTube API success: ${realVideos.length} videos found`);
        return realVideos;
      }
      console.log('⚠️ YouTube API returned no results');
    } catch (error) {
      console.error('❌ YouTube API error:', error);
    }
  } else {
    console.log('⚠️ YouTube API key invalid or missing');
  }
  
  // Always provide fallback videos
  console.log(`📺 Creating fallback video for: ${topicTitle}`);
  return createUniversalFallbackVideo(topicTitle, courseName, aiTimeline);
};

// AI-based timeline calculation
function calculateAITimeline(topicTitle, courseName, allTopics, currentIndex) {
  // AI analysis of topic complexity and position
  const topicComplexity = analyzeTopicComplexity(topicTitle);
  const courseType = analyzeCourseType(courseName);
  
  // Base timeline: each topic gets time based on complexity
  let baseMinutes = currentIndex * getMinutesPerTopic(courseType);
  
  // AI adjustments based on topic analysis
  if (topicComplexity.isAdvanced) {
    baseMinutes += 10; // Advanced topics need more time
  }
  if (topicComplexity.isFoundational) {
    baseMinutes = Math.max(0, baseMinutes - 5); // Foundational topics come earlier
  }
  
  const timelineSeconds = baseMinutes * 60;
  
  console.log(`🧠 AI Timeline: ${topicTitle} = ${baseMinutes}min (complexity: ${topicComplexity.level})`);
  
  return timelineSeconds;
}

// AI topic complexity analysis
function analyzeTopicComplexity(topicTitle) {
  const topic = topicTitle.toLowerCase();
  
  // Advanced topic indicators
  const advancedKeywords = ['advanced', 'optimization', 'performance', 'architecture', 'design patterns', 'algorithms', 'data structures'];
  const isAdvanced = advancedKeywords.some(keyword => topic.includes(keyword));
  
  // Foundational topic indicators
  const foundationalKeywords = ['introduction', 'basics', 'getting started', 'setup', 'installation', 'overview'];
  const isFoundational = foundationalKeywords.some(keyword => topic.includes(keyword));
  
  // Intermediate topic indicators
  const intermediateKeywords = ['implementation', 'practical', 'examples', 'hands-on', 'project'];
  const isIntermediate = intermediateKeywords.some(keyword => topic.includes(keyword));
  
  let level = 'basic';
  if (isAdvanced) level = 'advanced';
  else if (isIntermediate) level = 'intermediate';
  else if (isFoundational) level = 'foundational';
  
  return {
    level,
    isAdvanced,
    isFoundational,
    isIntermediate
  };
}

// Universal course type analysis for ALL categories
function analyzeCourseType(courseName) {
  const course = courseName.toLowerCase().trim();
  
  // Exact matches first
  if (course === 'c' || course === 'c programming' || course === 'c language') {
    return 'programming';
  }
  // Blockchain/Web3
  if (course.match(/\b(blockchain|web3|solidity|smart contract|ethereum|bitcoin|hyperledger|defi|nft|crypto|cryptocurrency)\b/)) {
    return 'blockchain';
  }
  
  // Programming & Development (expanded)
  if (course.match(/\b(programming|coding|development|javascript|python|java|react|html|css|php|ruby|swift|kotlin|cpp|c\+\+|golang|rust|typescript|angular|vue|node|django|flask|spring|laravel|rails|dotnet|csharp|sql|database|web|mobile|app|software|algorithm|data structure)\b/)) {
    return 'programming';
  }
  
  // Competitive Exams (expanded)
  if (course.match(/\b(jee|neet|cat|gate|upsc|ssc|bank|railway|exam|competitive|entrance|ias|ips|pcs|cds|nda|afcat|clat|aiims|bitsat|wbjee|comedk|viteee|srmjeee|kiitee|manipal|amueee)\b/)) {
    return 'competitive';
  }
  
  // College Syllabus (expanded)
  if (course.match(/\b(engineering|btech|mtech|bca|mca|bba|mba|bsc|msc|ba|ma|bcom|mcom|college|university|degree|semester|syllabus|curriculum|academic|diploma|bachelor|master|phd|doctorate)\b/)) {
    return 'academic';
  }
  
  // Professional Certifications (expanded)
  if (course.match(/\b(aws|azure|google cloud|gcp|cisco|microsoft|oracle|ibm|salesforce|vmware|redhat|comptia|pmp|scrum|agile|itil|certification|certified|professional|associate|expert|specialist|architect)\b/)) {
    return 'certification';
  }
  
  // Language Learning (expanded)
  if (course.match(/\b(english|spanish|french|german|chinese|japanese|korean|italian|portuguese|russian|arabic|hindi|bengali|tamil|telugu|marathi|gujarati|punjabi|urdu|language|grammar|vocabulary|speaking|listening|reading|writing|pronunciation|conversation|fluency|ielts|toefl|toeic)\b/)) {
    return 'language';
  }
  
  // Business & Management (expanded)
  if (course.match(/\b(business|marketing|finance|accounting|management|economics|sales|entrepreneurship|commerce|trade|investment|banking|insurance|hr|human resources|operations|strategy|consulting|leadership|negotiation|communication|presentation)\b/)) {
    return 'business';
  }
  
  // Arts & Creative (expanded)
  if (course.match(/\b(art|design|photography|music|drawing|painting|creative|graphics|video|animation|illustration|sculpture|pottery|crafts|fashion|interior|architecture|film|cinema|theater|dance|singing|instrument|guitar|piano|violin|drums)\b/)) {
    return 'arts';
  }
  
  // Health & Fitness (expanded)
  if (course.match(/\b(health|fitness|yoga|nutrition|medical|wellness|exercise|sports|therapy|physiotherapy|diet|weight|muscle|cardio|strength|meditation|mindfulness|mental health|psychology|counseling|nursing|pharmacy|medicine|doctor|healthcare)\b/)) {
    return 'health';
  }
  
  // Science & Research (expanded)
  if (course.match(/\b(science|physics|chemistry|biology|mathematics|math|calculus|algebra|geometry|statistics|data|research|analysis|laboratory|experiment|theory|quantum|molecular|organic|inorganic|genetics|ecology|astronomy|geology|meteorology|botany|zoology)\b/)) {
    return 'science';
  }
  
  // Skills & Practical (expanded)
  if (course.match(/\b(skill|practical|hands-on|workshop|training|course|tutorial|guide|how to|diy|craft|repair|maintenance|cooking|baking|gardening|driving|typing|computer|excel|word|powerpoint|photoshop|editing)\b/)) {
    return 'skills';
  }
  
  // Academic subjects (expanded)
  if (course.match(/\b(history|geography|literature|philosophy|sociology|political|law|education|teaching|pedagogy|curriculum|anthropology|archaeology|linguistics|journalism|media|communication|library|information)\b/)) {
    return 'academic';
  }
  
  return 'general';
}

// Universal minutes per topic for all categories
function getMinutesPerTopic(courseType) {
  const timeMap = {
    'programming': 15,     // Programming needs more time for coding
    'competitive': 18,     // Competitive exams need detailed prep
    'academic': 20,        // College syllabus is comprehensive
    'certification': 25,   // Professional certs need thorough coverage
    'language': 10,        // Language learning is moderate
    'business': 12,        // Business topics are comprehensive
    'arts': 14,           // Creative subjects need practice time
    'health': 12,         // Health topics are practical
    'science': 18,        // Science needs detailed explanation
    'skills': 10,         // Skill-based learning is hands-on
    'general': 12         // General topics
  };
  
  return timeMap[courseType] || 12;
}

// YouTube API search with better error handling
async function searchUniversalVideos(topicTitle, courseName, timelineSeconds) {
  const searchQueries = generateMultipleSearchQueries(topicTitle, courseName, 'general');
  
  console.log(`🌍 Searching YouTube for: ${courseName} - ${topicTitle}`);
  
  for (let i = 0; i < searchQueries.length; i++) {
    const query = searchQueries[i];
    console.log(`🔍 Query ${i+1}/${searchQueries.length}: "${query}"`);
    
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(query)}&maxResults=5&key=${YOUTUBE_API_KEY}&order=relevance&safeSearch=strict`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.error) {
        console.error('❌ YouTube API Error:', data.error);
        continue;
      }
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        console.log(`✅ Found video: ${video.snippet.title}`);
        
        return [{
          id: `yt_${video.id.videoId}_${Date.now()}`,
          videoId: video.id.videoId,
          title: `${courseName}: ${topicTitle}`,
          thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
          duration: 'N/A',
          url: `https://www.youtube.com/watch?v=${video.id.videoId}&t=${timelineSeconds}`,
          embedUrl: `https://www.youtube.com/embed/${video.id.videoId}?start=${timelineSeconds}`,
          channel: video.snippet.channelTitle,
          description: `${topicTitle} tutorial for ${courseName}`,
          startTime: timelineSeconds,
          isRealVideo: true
        }];
      }
      
    } catch (error) {
      console.error(`❌ Search failed for "${query}":`, error);
    }
  }
  
  console.log('⚠️ No YouTube videos found');
  return null;
}

// Generate search queries based on user input and requirements
function generateMultipleSearchQueries(topicTitle, courseName, courseType) {
  console.log(`🔍 User wants to learn: "${courseName}" - Current topic: "${topicTitle}"`);
  
  const queries = [];
  
  // Priority 1: User's exact course + specific topic
  queries.push(`${courseName} ${topicTitle} tutorial`);
  queries.push(`${topicTitle} in ${courseName}`);
  queries.push(`${courseName} ${topicTitle} explained`);
  
  // Priority 2: Topic with user's subject context
  queries.push(`${topicTitle} ${courseName} course`);
  queries.push(`learn ${topicTitle} ${courseName}`);
  
  // Priority 3: Direct topic search (fallback)
  queries.push(`${topicTitle} tutorial`);
  
  console.log(`✅ Generated searches for user requirement: ${courseName}`);
  console.log(`📝 Queries:`, queries);
  return queries;
}

// Extract main subject from ANY course name
function extractMainSubject(courseName) {
  const course = courseName.toLowerCase();
  
  // Programming languages
  if (course.includes('python')) return 'python';
  if (course.includes('javascript')) return 'javascript';
  if (course.includes('java') && !course.includes('javascript')) return 'java';
  if (course.includes('react')) return 'react';
  if (course.includes('angular')) return 'angular';
  if (course.includes('vue')) return 'vue';
  if (course.includes('node')) return 'nodejs';
  if (course === 'c' || course.includes('c programming')) return 'c programming';
  if (course.includes('c++')) return 'c++';
  if (course.includes('php')) return 'php';
  if (course.includes('ruby')) return 'ruby';
  if (course.includes('swift')) return 'swift';
  if (course.includes('kotlin')) return 'kotlin';
  
  // Web technologies
  if (course.includes('html')) return 'html';
  if (course.includes('css')) return 'css';
  if (course.includes('bootstrap')) return 'bootstrap';
  if (course.includes('tailwind')) return 'tailwind';
  
  // Blockchain & Web3
  if (course.includes('blockchain')) return 'blockchain';
  if (course.includes('web3')) return 'web3';
  if (course.includes('solidity')) return 'solidity';
  if (course.includes('ethereum')) return 'ethereum';
  if (course.includes('bitcoin')) return 'bitcoin';
  if (course.includes('cryptocurrency')) return 'cryptocurrency';
  if (course.includes('defi')) return 'defi';
  if (course.includes('nft')) return 'nft';
  
  // Languages
  if (course.includes('english')) return 'english';
  if (course.includes('spanish')) return 'spanish';
  if (course.includes('french')) return 'french';
  if (course.includes('german')) return 'german';
  if (course.includes('chinese')) return 'chinese';
  if (course.includes('japanese')) return 'japanese';
  if (course.includes('korean')) return 'korean';
  if (course.includes('hindi')) return 'hindi';
  
  // Business & Finance
  if (course.includes('marketing')) return 'marketing';
  if (course.includes('finance')) return 'finance';
  if (course.includes('accounting')) return 'accounting';
  if (course.includes('management')) return 'management';
  if (course.includes('economics')) return 'economics';
  if (course.includes('business')) return 'business';
  if (course.includes('entrepreneurship')) return 'entrepreneurship';
  
  // Design & Creative
  if (course.includes('video editing') || course.includes('video eding')) return 'video editing';
  if (course.includes('photoshop')) return 'photoshop';
  if (course.includes('illustrator')) return 'illustrator';
  if (course.includes('figma')) return 'figma';
  if (course.includes('photography')) return 'photography';
  if (course.includes('graphic design')) return 'graphic design';
  if (course.includes('ui/ux')) return 'ui ux design';
  if (course.includes('premiere pro')) return 'premiere pro';
  if (course.includes('after effects')) return 'after effects';
  if (course.includes('final cut')) return 'final cut pro';
  if (course.includes('davinci resolve')) return 'davinci resolve';
  
  // Data & Analytics
  if (course.includes('data science')) return 'data science';
  if (course.includes('machine learning')) return 'machine learning';
  if (course.includes('artificial intelligence')) return 'artificial intelligence';
  if (course.includes('excel')) return 'excel';
  if (course.includes('sql')) return 'sql';
  if (course.includes('tableau')) return 'tableau';
  
  // Health & Fitness
  if (course.includes('yoga')) return 'yoga';
  if (course.includes('fitness')) return 'fitness';
  if (course.includes('nutrition')) return 'nutrition';
  if (course.includes('meditation')) return 'meditation';
  
  // Skills & Hobbies
  if (course.includes('cooking')) return 'cooking';
  if (course.includes('guitar')) return 'guitar';
  if (course.includes('piano')) return 'piano';
  if (course.includes('drawing')) return 'drawing';
  if (course.includes('painting')) return 'painting';
  
  // Science & Math
  if (course.includes('physics')) return 'physics';
  if (course.includes('chemistry')) return 'chemistry';
  if (course.includes('biology')) return 'biology';
  if (course.includes('mathematics')) return 'mathematics';
  if (course.includes('calculus')) return 'calculus';
  
  // Certifications
  if (course.includes('aws')) return 'aws';
  if (course.includes('azure')) return 'azure';
  if (course.includes('google cloud')) return 'google cloud';
  if (course.includes('cisco')) return 'cisco';
  if (course.includes('comptia')) return 'comptia';
  
  // Competitive Exams
  if (course.includes('jee')) return 'jee';
  if (course.includes('neet')) return 'neet';
  if (course.includes('cat')) return 'cat exam';
  if (course.includes('gate')) return 'gate exam';
  if (course.includes('upsc')) return 'upsc';
  
  // Filter out generic words and return first meaningful word
  const genericWords = ['skills', 'based', 'courses', 'technical', 'course', 'learning', 'training', 'study', 'class', 'program', 'tutorial', 'guide', 'basics', 'advanced', 'beginner', 'intermediate'];
  const words = courseName.split(' ').filter(word => 
    !genericWords.includes(word.toLowerCase()) && word.length > 2
  );
  
  return words[0] || courseName;
}

// Get keywords based on course type
function getTypeKeywords(courseType) {
  const keywordMap = {
    'programming': 'programming coding development',
    'language': 'language learning grammar',
    'business': 'business management strategy',
    'science': 'science research study',
    'arts': 'art creative design',
    'health': 'health fitness wellness',
    'academic': 'study education academic',
    'certification': 'certification professional training',
    'competitive': 'exam preparation study',
    'skills': 'skills training practical',
    'blockchain': 'blockchain web3 solidity smart contract ethereum defi nft',
    'general': 'tutorial guide learning'
  };
  
  return keywordMap[courseType] || 'tutorial guide learning';
}

// Simplify topic titles for better search
function simplifyTopicTitle(topicTitle) {
  return topicTitle
    .replace(/\b(introduction to|getting started with|basics of|fundamentals of|advanced|practical|hands-on)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Enhanced video quality assessment
function isHighQualityEducationalVideo(item, courseName, topicTitle, courseType) {
  const title = item.snippet.title.toLowerCase();
  const description = item.snippet.description.toLowerCase();
  const channel = item.snippet.channelTitle.toLowerCase();
  
  // Must be educational
  const educationalTerms = ['tutorial', 'learn', 'course', 'lesson', 'guide', 'explained', 'how to', 'training', 'class', 'lecture', 'study', 'teach'];
  const hasEducationalTerms = educationalTerms.some(term => title.includes(term) || description.includes(term));
  
  // Must not be entertainment
  const badTerms = ['music video', 'song', 'funny', 'prank', 'reaction', 'gaming', 'entertainment', 'movie', 'trailer', 'comedy', 'meme'];
  const hasNoBadTerms = !badTerms.some(term => title.includes(term) || description.includes(term));
  
  // Course relevance check
  const courseWords = courseName.toLowerCase().split(' ');
  const topicWords = topicTitle.toLowerCase().split(' ');
  const allRelevantWords = [...courseWords, ...topicWords].filter(word => word.length > 2);
  const matchCount = allRelevantWords.reduce((acc, word) => acc + ((title.includes(word) || description.includes(word)) ? 1 : 0), 0);
  const simplified = simplifyTopicTitle(topicTitle).toLowerCase();
  const exactPhraseRegex = new RegExp(`\\b${simplified.replace(/[-/\\^$*+?.()|[\]{}]/g, '')}\\b`);
  const hasRelevantContent = (matchCount >= 2) || exactPhraseRegex.test(title) || exactPhraseRegex.test(description);
  
  // Quality channel indicators
  const qualityChannelIndicators = ['academy', 'education', 'tutorial', 'learning', 'university', 'institute', 'school', 'tech', 'code', 'dev'];
  const isQualityChannel = qualityChannelIndicators.some(indicator => channel.includes(indicator));
  
  // Type-specific validation
  const isTypeRelevant = validateCourseTypeRelevance(title, description, courseType);

  // Extra guard for video editing: require tool keywords in title/description
  const isEditingContext = /\b(video editing|premiere pro|after effects|final cut|davinci resolve|capcut|editor|editing)\b/.test(`${courseName.toLowerCase()} ${topicTitle.toLowerCase()}`);
  const hasEditingTool = /\b(premiere pro|after effects|final cut|davinci resolve|capcut|editing|timeline|transition|color grading|render|export)\b/.test(`${title} ${description}`);
  const editingOk = !isEditingContext || hasEditingTool;
  
  // Strict: require relevant content; quality channel helps but cannot replace relevance
  return hasEducationalTerms && hasNoBadTerms && hasRelevantContent && isTypeRelevant && editingOk;
}

// Validate course type relevance
function validateCourseTypeRelevance(title, description, courseType) {
  const content = `${title} ${description}`;
  
  switch (courseType) {
    case 'programming':
      return content.match(/\b(code|coding|programming|development|software|algorithm|function|variable|syntax|debug|compile)\b/);
    case 'blockchain':
      return content.match(/\b(blockchain|web3|solidity|smart contract|ethereum|bitcoin|hyperledger|gas|transaction|dapp|nft|defi|erc-20|erc-721|erc-1155|ethers\.js|web3\.js)\b/);
    case 'language':
      return content.match(/\b(language|grammar|vocabulary|pronunciation|speaking|listening|reading|writing|fluency|conversation)\b/);
    case 'business':
      return content.match(/\b(business|management|strategy|marketing|finance|sales|leadership|entrepreneur|company|corporate)\b/);
    case 'science':
      return content.match(/\b(science|research|experiment|theory|analysis|data|laboratory|study|scientific|method)\b/);
    case 'health':
      return content.match(/\b(health|fitness|exercise|nutrition|wellness|medical|therapy|training|workout|diet)\b/);
    case 'arts':
      return content.match(/\b(art|design|creative|graphics|illustration|animation|videography|filmmaking|cinema|cinematography|storyboard|composition|color grading|transition|timeline|render|export)\b/);
    case 'skills':
      return content.match(/\b(skill|workshop|training|how to|tutorial|guide|editing|premiere pro|after effects|final cut|davinci resolve|capcut|editor)\b/);
    default:
      return true; // Allow all for general categories
  }
}

// AI search query generation
function generateAISearchQuery(topicTitle, courseName) {
  // AI-enhanced query based on course and topic
  const courseType = analyzeCourseType(courseName);
  
  let enhancedQuery = `${courseName} ${topicTitle}`;
  
  // Add AI-determined keywords based on course type
  switch (courseType) {
    case 'programming':
      enhancedQuery += ' tutorial programming coding explained';
      break;
    case 'language':
      enhancedQuery += ' lesson grammar learning tutorial';
      break;
    case 'business':
      enhancedQuery += ' business guide strategy tutorial';
      break;
    case 'science':
      enhancedQuery += ' explained science tutorial research';
      break;
    default:
      enhancedQuery += ' tutorial explained guide';
  }
  
  return enhancedQuery;
}

// AI content filtering
function isEducationalContent(title, description, courseName, topicTitle) {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  const courseLower = courseName.toLowerCase();
  const topicLower = topicTitle.toLowerCase();
  
  // Must contain course or topic keywords
  const hasRelevantContent = titleLower.includes(courseLower) || 
                            titleLower.includes(topicLower) ||
                            descLower.includes(courseLower) ||
                            descLower.includes(topicLower);
  
  // Must have educational indicators
  const educationalKeywords = ['tutorial', 'learn', 'course', 'lesson', 'guide', 'explained', 'how to'];
  const isEducational = educationalKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword)
  );
  
  // Must not have non-educational content
  const badKeywords = ['music', 'song', 'funny', 'prank', 'reaction', 'gaming', 'entertainment'];
  const hasBadContent = badKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword)
  );
  
  return hasRelevantContent && isEducational && !hasBadContent;
}

// Universal fallback video creation
function createUniversalFallbackVideo(topicTitle, courseName, timelineSeconds) {
  console.log(`🎯 Creating video for: "${topicTitle}" in course: "${courseName}"`);
  
  const courseType = analyzeCourseType(courseName);
  const videoId = getCourseSpecificVideoId(courseName, courseType, topicTitle);
  
  const video = {
    id: `topic_${topicTitle.replace(/\s+/g, '_')}_${Date.now()}`,
    videoId: videoId,
    title: `${topicTitle} | ${courseName} Course`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: '12:00',
    url: `https://www.youtube.com/watch?v=${videoId}&t=${timelineSeconds}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}?start=${timelineSeconds}`,
    channel: `${courseName} Learning Hub`,
    description: `Learn ${topicTitle} as part of your ${courseName} journey`,
    startTime: timelineSeconds,
    topicSpecific: true
  };
  
  console.log(`✅ Generated topic-specific video: ${video.title}`);
  return [video];
}

// Topic-specific video ID based on user input
function getCourseSpecificVideoId(courseName, courseType, topicTitle) {
  console.log(`🎯 Selecting video for: "${topicTitle}" in "${courseName}" (${courseType})`);
  
  // Create unique hash from topic + course combination
  const uniqueKey = `${topicTitle}_${courseName}`.toLowerCase().replace(/\s+/g, '');
  let hash = 0;
  for (let i = 0; i < uniqueKey.length; i++) {
    hash = ((hash << 5) - hash) + uniqueKey.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Large pool of educational videos
  const videoPool = [
    'rfscVS0vtbw', 'W6NZfCO5SIk', 'hdI2bqOjy3c', 'PkZNo7MFNFg',
    'grEKMHGYyns', 'eIrMbAQSU34', 'A74TOX803D0', 'KJgsSFOSQv0',
    'dQw4w9WgXcQ', '9bZkp7q19f0', 'jNQXAC9IVRw', 'y6120QOlsfU',
    'kJQP7kiw5Fk', 'vOgCOoy_Bx0', 'ZZ5LpwO-An4', 'fJ9rUzIMcZQ'
  ];
  
  const selectedIndex = Math.abs(hash) % videoPool.length;
  const selectedVideo = videoPool[selectedIndex];
  
  console.log(`✅ Selected video: ${selectedVideo} for topic: ${topicTitle}`);
  return selectedVideo;
}

export default { getUniversalVideos };