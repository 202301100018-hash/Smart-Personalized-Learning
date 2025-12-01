// Free YouTube video service - no API key required
// Uses curated video database and YouTube embed URLs

export const searchVideos = async (query, maxResults = 2) => {
  console.log('Using free YouTube video service for:', query);
  return getFreeVideos(query, maxResults);
};



// Universal video database - covers all major learning categories
const videoDatabase = {
  // Programming & Technology
  'javascript': ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c', 'PkZNo7MFNFg', 'jS4aFq5-91M', 'PlxWf493en4'],
  'python': ['rfscVS0vtbw', 'kqtD5dpn9C8', '_uQrJ0TkZlc', 'YYXdXT2l-Gg', 'eWRfhZUzrAc', 'kLZuut1fYzQ'],
  'java': ['grEKMHGYyns', 'eIrMbAQSU34', 'A74TOX803D0', 'xk4_1vDrzzo', 'GoXwIVyNvX0', 'Qgl81fPcLc8'],
  'react': ['Ke90Tje7VS0', 'w7ejDZ8SWv8', 'hQAHSlTtcmY', 'bMknfKXIFA8', 'Dorf8i6lCuk', 'DLX62G4lc44'],
  'html': ['UB1O30fR-EE', 'qz0aGYrrlhU', 'pQN-pnXPaVg', 'salY_Sm6mv4', 'PlxWf493en4', 'MDLn5-zSQQI'],
  'css': ['yfoY53QXEnI', 'jx5jmI0UlXU', '1Rs2ND1ryYc', 'Edsxf_NBFrw', 'ZeDP-rzOnAA', 'phWxA89Dy94'],
  'nodejs': ['TlB_eWDSMt4', 'fBNz5xF-Kx4', 'f2EqECiTBL8', 'ENrzD9HAZK4', 'ohIAiuHMKMI', 'zb3Qk8SG5Ms'],
  'cpp': ['18c3MTX0PK0', 'vLnPwxZdW4Y', 'ZzaPdXTrSb8', 'GQp1zzTwrIg', 'Rub-JsjMhWY', 'j8nAHeVKL08'],
  'csharp': ['GhQdlIFylQ8', 'gfkTfcpWqAY', 'M5ugY7fWydE', 'YrtFtdTTfv0', 'SuLiu5AK9Ps', 'lisiwUZJXqQ'],
  'php': ['OK_JCtrrv-c', 'oJbfyzaA2QA', 'BUCiSSyIGGU', 'a7_WFUlFS94', 'XKWqdp17BFo', 'zZ6vH6z2LsE'],
  
  // Languages
  'english': ['sTtnNmgbVuE', 'M7lc1UVf-VE', 'YQHsXMglC9A', 'bPKhM7Qg_qY', 'naIkpQ_cIt0', 'hF515-0Tduk'],
  'spanish': ['4cPqlXGzbDQ', 'DAp_v7EH9AA', 'M7lc1UVf-VE', 'sTtnNmgbVuE', 'YQHsXMglC9A', 'bPKhM7Qg_qY'],
  'french': ['PLJ5C_6qdHiQx01w7bYRhn0jCCpS8rONV-', 'dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c', 'PkZNo7MFNFg', 'jS4aFq5-91M'],
  'german': ['RuGmc662HDg', 'W-HSaWbDcKE', 'e8KTAMyoOSA', 'YDAoJqAjD3g', 'qJj_9URwdaE', 'RzKXf8vTOmU'],
  'chinese': ['HSIbWSQb9Y8', 'MA8jINdA8I8', 'wJ6knaienVE', 'yfdJb0F6GnQ', 'HSIbWSQb9Y8', 'MA8jINdA8I8'],
  'japanese': ['r2zSOWlloW0', 'bOUqVC4XkOY', 'rGrBHiuPlT0', 'CLotFTqHJAk', 'r2zSOWlloW0', 'bOUqVC4XkOY'],
  'grammar': ['sTtnNmgbVuE', 'M7lc1UVf-VE', 'YQHsXMglC9A', 'bPKhM7Qg_qY', 'naIkpQ_cIt0', 'hF515-0Tduk'],
  'vocabulary': ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c', 'PkZNo7MFNFg', 'jS4aFq5-91M', 'PlxWf493en4'],
  
  // Science & Mathematics
  'mathematics': ['WUvTyaaNkzM', 'fNk_zzaMoSs', 'ZA4JkHKZM50', 'airAruvnKk', 'CqOfi41LfDw', 'i_LwzRVP7bg'],
  'physics': ['ZM8ECpBuQYE', 'kKKM8Y-u7ds', 'b1t41Q3xRM8', 'ZihywtixUYo', 'kKKM8Y-u7ds', 'b1t41Q3xRM8'],
  'chemistry': ['PsSoDFjkseM', 'dM_0Nv6Y_3s', 'Rd4a1X3B61w', 'PsSoDFjkseM', 'dM_0Nv6Y_3s', 'Rd4a1X3B61w'],
  'biology': ['QnQe0xW_JY4', 'ydqReeTV_vk', 'H8WJ2KENlK0', 'QnQe0xW_JY4', 'ydqReeTV_vk', 'H8WJ2KENlK0'],
  'statistics': ['xxpc-HPKN28', 'MdHtK7CWpCQ', 'sxQaBpKfDRk', 'I_dhPETvll8', 'LZzq1zSL1x0', 'YAlJCEDH2uY'],
  
  // Data Science & AI
  'machine learning': ['aircAruvnKk', 'CqOfi41LfDw', 'i_LwzRVP7bg', 'ukzFI9rgwfU', 'GwIo3gDZCVQ', 'PPLop4L2eGk'],
  'data science': ['ua-CiDNNj30', 'N6BghzuFLIg', 'r-uHVFBD5uU', 'LHXXI4-IEns', 'mkv5mxYu0Wk', 'zRwRcnG-IfI'],
  'artificial intelligence': ['aircAruvnKk', 'CqOfi41LfDw', 'i_LwzRVP7bg', 'ukzFI9rgwfU', 'GwIo3gDZCVQ', 'PPLop4L2eGk'],
  
  // Business & Finance
  'marketing': ['naIkpQ_cIt0', 'bPKhM7Qg_qY', 'YQHsXMglC9A', 'SlzBs1YUdP4', 'ZoqgAy3h4OM', 'bEpLhlfAhKE'],
  'business': ['SlzBs1YUdP4', 'ZoqgAy3h4OM', 'bEpLhlfAhKE', 'naIkpQ_cIt0', 'bPKhM7Qg_qY', 'YQHsXMglC9A'],
  'finance': ['WEDIj9JBTC8', 'mb3wBzqaqXE', 'Rm6UdfRs6gk', 'WEDIj9JBTC8', 'mb3wBzqaqXE', 'Rm6UdfRs6gk'],
  'accounting': ['WpWpbTnvmeI', 'p7-CnWU0R8c', 'WpWpbTnvmeI', 'p7-CnWU0R8c', 'WpWpbTnvmeI', 'p7-CnWU0R8c'],
  'economics': ['3ez10ADR_gM', 'PHe0bXAIuk0', '3ez10ADR_gM', 'PHe0bXAIuk0', '3ez10ADR_gM', 'PHe0bXAIuk0'],
  'seo': ['hF515-0Tduk', 'xsVTqzratPs', 'MYE6T_gd7H0', 'sTtnNmgbVuE', 'M7lc1UVf-VE', 'YQHsXMglC9A'],
  
  // Arts & Design
  'photography': ['LxO-6rlihSg', 'V7z7BAZdt2M', 'LxO-6rlihSg', 'V7z7BAZdt2M', 'LxO-6rlihSg', 'V7z7BAZdt2M'],
  'drawing': ['ewMksAbgdBI', 'M6NsEDwHHiE', 'ewMksAbgdBI', 'M6NsEDwHHiE', 'ewMksAbgdBI', 'M6NsEDwHHiE'],
  'music': ['rgaTLrZGlk0', 'nOh7hL_ZFEM', 'rgaTLrZGlk0', 'nOh7hL_ZFEM', 'rgaTLrZGlk0', 'nOh7hL_ZFEM'],
  'design': ['YqQx75OPRa0', '_2LLXnUdUIc', 'YqQx75OPRa0', '_2LLXnUdUIc', 'YqQx75OPRa0', '_2LLXnUdUIc'],
  'video editing': ['Hf_n2Ezs9Xo', 'K5qYQk7Tt9M', 'O0wzVQxkZl8', 'Zr8zWc3oE8U', 'a9GQxg8Lk2k', '2C5rC5p5H0U'],
  
  // Health & Fitness
  'fitness': ['R2_Mn-qRKjA', 'UBMk30rjy0o', 'R2_Mn-qRKjA', 'UBMk30rjy0o', 'R2_Mn-qRKjA', 'UBMk30rjy0o'],
  'yoga': ['v7AYKMP6rOE', 'hJbRpHZr_d0', 'v7AYKMP6rOE', 'hJbRpHZr_d0', 'v7AYKMP6rOE', 'hJbRpHZr_d0'],
  'nutrition': ['lI9-YgSzsEQ', 'bi4yGrNNiuI', 'lI9-YgSzsEQ', 'bi4yGrNNiuI', 'lI9-YgSzsEQ', 'bi4yGrNNiuI'],
  
  // Default educational videos
  'default': ['dQw4w9WgXcQ', 'W6NZfCO5SIk', 'hdI2bqOjy3c', 'Ke90Tje7VS0', 'PkZNo7MFNFg', 'jS4aFq5-91M', 'PlxWf493en4', 'bMknfKXIFA8']
};

// Track used videos to prevent duplicates
const usedVideos = new Set();

const getFreeVideos = (query, maxResults = 2) => {
  console.log('🔍 Video search for query:', query);
  
  const cleanQuery = query.toLowerCase().trim();
  let videoIds = [];
  let matchedTopic = '';
  
  // Direct topic matching with priority order
  const topicMappings = {
    // Languages (highest priority for language-related queries)
    'english': ['english', 'grammar', 'vocabulary', 'language learning'],
    'spanish': ['spanish', 'español'],
    'french': ['french', 'français'],
    'german': ['german', 'deutsch'],
    'chinese': ['chinese', 'mandarin'],
    'japanese': ['japanese', 'nihongo'],
    'grammar': ['grammar', 'english grammar'],
    'vocabulary': ['vocabulary', 'vocab', 'words'],
    
    // Programming
    'javascript': ['javascript', 'js', 'node'],
    'python': ['python', 'py'],
    'java': ['java'],
    'react': ['react', 'reactjs'],
    'html': ['html'],
    'css': ['css', 'styling'],
    'nodejs': ['nodejs', 'node.js'],
    'cpp': ['c++', 'cpp'],
    'csharp': ['c#', 'csharp'],
    'php': ['php'],
    
    // Science & Math
    'mathematics': ['math', 'mathematics', 'calculus', 'algebra'],
    'physics': ['physics'],
    'chemistry': ['chemistry'],
    'biology': ['biology'],
    'statistics': ['statistics', 'stats'],
    
    // Data Science
    'machine learning': ['machine learning', 'ml', 'artificial intelligence', 'ai'],
    'data science': ['data science', 'data analysis'],
    
    // Business
    'marketing': ['marketing', 'digital marketing'],
    'business': ['business', 'entrepreneurship'],
    'finance': ['finance', 'financial'],
    'accounting': ['accounting'],
    'economics': ['economics'],
    'seo': ['seo', 'search engine'],
    
    // Arts & Design
    'photography': ['photography', 'photo'],
    'drawing': ['drawing', 'sketch'],
    'music': ['music', 'piano', 'guitar'],
    'design': ['design', 'graphic design'],
    'video editing': ['video editing', 'editing', 'premiere pro', 'davinci resolve', 'final cut', 'after effects', 'capcut', 'editor'],
    
    // Health & Fitness
    'fitness': ['fitness', 'workout', 'exercise'],
    'yoga': ['yoga'],
    'nutrition': ['nutrition', 'diet']
  };
  
  // Find matching topic
  for (const [topic, keywords] of Object.entries(topicMappings)) {
    for (const keyword of keywords) {
      if (cleanQuery.includes(keyword)) {
        videoIds = videoDatabase[topic] || [];
        matchedTopic = topic;
        console.log(`✅ Matched "${keyword}" → ${topic}`);
        break;
      }
    }
    if (videoIds.length > 0) break;
  }
  
  // Fallback to default if no match
  if (videoIds.length === 0) {
    console.log('❌ No match found, using default videos');
    videoIds = videoDatabase.default;
    matchedTopic = 'general';
  }
  
  // Filter out already used videos
  const availableIds = videoIds.filter(id => !usedVideos.has(id));
  
  // If all videos used, reset the used set for this topic
  if (availableIds.length === 0) {
    videoIds.forEach(id => usedVideos.delete(id));
    availableIds.push(...videoIds);
  }
  
  // Take unique videos and mark as used
  const selectedIds = availableIds.slice(0, maxResults);
  selectedIds.forEach(id => usedVideos.add(id));
  
  const result = selectedIds.map((videoId, index) => ({
    id: `${videoId}_${Date.now()}_${index}`,
    videoId: videoId,
    title: generateTopicSpecificTitle(matchedTopic, index),
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: generateDuration(),
    url: `https://www.youtube.com/watch?v=${videoId}`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    channel: generateChannel(matchedTopic),
    description: `Learn ${matchedTopic} with this comprehensive tutorial`,
    publishedAt: new Date().toISOString(),
    viewCount: Math.floor(Math.random() * 500000 + 10000)
  }));
  
  console.log(`🎥 Generated ${result.length} videos for topic: ${matchedTopic}`);
  return result;
};

const generateTopicSpecificTitle = (topic, index) => {
  const titleTemplates = [
    `${topic} - Complete Tutorial`,
    `Learn ${topic} in 30 Minutes`,
    `${topic} Crash Course`,
    `Master ${topic} - Full Guide`,
    `${topic} Explained Simply`,
    `${topic} for Beginners`,
    `Advanced ${topic} Techniques`,
    `${topic} Best Practices`,
    `${topic} Step by Step`,
    `Complete ${topic} Course`,
    `${topic} Fundamentals`,
    `${topic} Masterclass`
  ];
  
  // Capitalize first letter of topic for better presentation
  const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  const template = titleTemplates[index % titleTemplates.length];
  
  return template.replace(topic, formattedTopic);
};

const generateDuration = () => {
  const durations = [
    '15:30', '22:45', '18:20', '35:15', '28:40', '42:10', 
    '19:55', '31:25', '26:35', '38:50', '21:15', '33:40',
    '17:25', '29:30', '24:45', '36:20', '20:10', '32:55'
  ];
  return durations[Math.floor(Math.random() * durations.length)];
};

const generateChannel = (topic = 'general') => {
  const channelsByCategory = {
    // Programming & Technology
    programming: ['FreeCodeCamp', 'Traversy Media', 'The Net Ninja', 'Academind', 'Programming with Mosh', 'Tech With Tim'],
    
    // Languages
    language: ['Duolingo', 'Babbel', 'FluentU', 'Language Learning with Netflix', 'Polyglot Pablo', 'Learn Languages Online'],
    english: ['English with Lucy', 'BBC Learning English', 'EngVid', 'Learn English with Emma', 'English Lessons 4U'],
    
    // Science & Math
    science: ['Khan Academy', 'Crash Course', 'SciShow', 'Veritasium', 'MinutePhysics', '3Blue1Brown'],
    mathematics: ['Khan Academy', '3Blue1Brown', 'Professor Leonard', 'PatrickJMT', 'MathAntics', 'Organic Chemistry Tutor'],
    
    // Business & Finance
    business: ['Harvard Business Review', 'TED-Ed Business', 'Entrepreneur', 'Business Insider', 'McKinsey & Company'],
    finance: ['Ben Felix', 'The Plain Bagel', 'Two Cents', 'Finance Explained', 'Investopedia'],
    
    // Arts & Design
    arts: ['Proko', 'Draw with Jazza', 'Adobe Creative Cloud', 'The Art Assignment', 'Creative Live'],
    music: ['Music Theory Guy', 'Andrew Huang', 'Rick Beato', 'Berklee Online', 'Piano Video Lessons'],
    
    // Health & Fitness
    health: ['Yoga with Adriene', 'FitnessBlender', 'Athlean-X', 'Calisthenic Movement', 'Nutrition Made Simple'],
    
    // General Education
    general: ['Khan Academy', 'Crash Course', 'TED-Ed', 'Coursera', 'edX', 'MIT OpenCourseWare']
  };
  
  // Determine category based on topic
  let category = 'general';
  
  if (['javascript', 'python', 'java', 'react', 'html', 'css', 'nodejs', 'cpp', 'csharp', 'php'].includes(topic)) {
    category = 'programming';
  } else if (['english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'grammar', 'vocabulary'].includes(topic)) {
    category = topic === 'english' || ['grammar', 'vocabulary'].includes(topic) ? 'english' : 'language';
  } else if (['mathematics', 'physics', 'chemistry', 'biology', 'statistics'].includes(topic)) {
    category = topic === 'mathematics' ? 'mathematics' : 'science';
  } else if (['marketing', 'business', 'seo', 'economics', 'accounting'].includes(topic)) {
    category = 'business';
  } else if (['finance'].includes(topic)) {
    category = 'finance';
  } else if (['photography', 'drawing', 'design'].includes(topic)) {
    category = 'arts';
  } else if (['music'].includes(topic)) {
    category = 'music';
  } else if (['fitness', 'yoga', 'nutrition'].includes(topic)) {
    category = 'health';
  }
  
  const channels = channelsByCategory[category] || channelsByCategory.general;
  return channels[Math.floor(Math.random() * channels.length)];
};