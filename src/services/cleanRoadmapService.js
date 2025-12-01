// Clean Roadmap Service - Single Source of Truth
export const generateRoadmap = async (courseName, days, skillLevel = 'Intermediate', studyHours = 2) => {
  console.log('🗺️ Generating universal roadmap for:', courseName);
  
  const topicsPerDay = Math.max(1, Math.ceil(studyHours / 2));
  const roadmap = [];
  
  // Get course-specific topics (now supports AI generation)
  const topics = await getTopicsForCourse(courseName);
  let topicIndex = 0;
  
  for (let day = 1; day <= days; day++) {
    const isRevisionDay = day % 5 === 0;
    const dayTopics = [];
    
    if (isRevisionDay) {
      dayTopics.push({
        id: `revision_${day}`,
        title: `${courseName} Review & Practice`,
        description: `Review and practice ${courseName} concepts from previous days`,
        duration: `${studyHours} hours`,
        difficulty: skillLevel,
        category: 'Assessment',
        videos: [],
        completed: false
      });
    } else {
      for (let i = 0; i < topicsPerDay; i++) {
        const topic = topics[topicIndex % topics.length];
        dayTopics.push({
          id: `${day}_${i + 1}`,
          title: topic,
          description: `Learn ${topic} with practical examples and exercises`,
          duration: `${Math.ceil(studyHours / topicsPerDay)} hours`,
          difficulty: getProgressiveDifficulty(day, days, skillLevel),
          category: i % 2 === 0 ? 'Theory' : 'Practical',
          videos: [],
          completed: false
        });
        topicIndex++;
      }
    }
    
    roadmap.push({
      day,
      topics: dayTopics,
      isRevisionDay,
      completed: false
    });
  }
  
  return {
    courseName,
    totalDays: days,
    skillLevel,
    studyHours,
    roadmap,
    createdAt: new Date().toISOString(),
    progress: {
      completedDays: 0,
      completedTopics: 0,
      totalTopics: roadmap.reduce((acc, day) => acc + day.topics.length, 0),
      quizScore: 0,
      streak: 0,
      xpPoints: 0
    }
  };
};

async function getTopicsForCourse(courseName) {
  console.log(`📚 Generating topics for course: "${courseName}"`);
  
  // Prefer AI-generated topics when API key is available; fallback to intelligent generation
  try {
    if (process.env.REACT_APP_OPENAI_API_KEY && process.env.REACT_APP_OPENAI_API_KEY !== 'your_openai_api_key_here') {
      console.log(`🧠 Using AI topic generation for: ${courseName}`);
      const aiTopics = await generateAITopics(courseName);
      if (Array.isArray(aiTopics) && aiTopics.length > 0) {
        return aiTopics;
      }
      console.log('⚠️ AI returned empty topics, falling back to intelligent generation');
    } else {
      console.log('⚠️ OpenAI key missing, using intelligent topic generation');
    }
  } catch (error) {
    console.error('OpenAI topic generation failed:', error);
    console.log('↪️ Falling back to intelligent topic generation');
  }
  return generateIntelligentTopics(courseName);
}

async function generateAITopics(courseName) {
  try {
    // Dynamic import to avoid build issues
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    const prompt = `Create 18 specific, actionable learning topics for a course called "${courseName}".

Requirements:
- Each topic should be specific and actionable (not generic like "basics" or "overview")
- Topics should progress from beginner to advanced
- Include practical, hands-on topics
- Make topics relevant to real-world applications
- Avoid repetitive or vague titles

Return ONLY a JSON array of topic titles:
["Specific Topic 1", "Specific Topic 2", ...]`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0].message.content.trim();
    const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
    
    const topics = JSON.parse(cleanContent);
    
    if (Array.isArray(topics) && topics.length > 0) {
      console.log(`✅ OpenAI generated ${topics.length} topics for ${courseName}`);
      return topics;
    }
    
    throw new Error('Invalid AI response format');
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

function generateIntelligentTopics(courseName) {
  const input = courseName.toLowerCase();
  const cleanInput = courseName.replace(/course|learning|training|study|class|program/gi, '').trim();
  
  // Analyze course type and generate appropriate topics
  const courseType = analyzeCourseType(input);
  
  switch (courseType) {
    case 'blockchain':
      return generateBlockchainTopics(cleanInput);
    case 'language':
      return generateLanguageTopics(cleanInput);
    case 'programming':
      return generateProgrammingTopics(cleanInput);
    case 'business':
      return generateBusinessTopics(cleanInput);
    case 'science':
      return generateScienceTopics(cleanInput);
    case 'arts':
      return generateArtsTopics(cleanInput);
    case 'health':
      return generateHealthTopics(cleanInput);
    case 'academic':
      return generateAcademicTopics(cleanInput);
    default:
      return generateUniversalTopics(cleanInput);
  }
}

function analyzeCourseType(input) {
  const course = input.toLowerCase().trim();
  
  // Exact matches first
  if (course === 'c' || course === 'c programming' || course === 'c language') {
    return 'programming';
  }
  // Blockchain/Web3
  if (course.match(/\b(blockchain|web3|solidity|smart contract|ethereum|bitcoin|hyperledger|defi|nft|crypto|cryptocurrency)\b/)) {
    return 'blockchain';
  }
  
  // Programming & Development (comprehensive)
  if (course.match(/\b(programming|coding|development|javascript|python|java|react|html|css|php|ruby|swift|kotlin|cpp|c\+\+|golang|rust|typescript|angular|vue|node|django|flask|spring|laravel|rails|dotnet|csharp|sql|database|web|mobile|app|software|algorithm|data structure)\b/)) {
    return 'programming';
  }
  
  // Language learning (comprehensive)
  if (course.match(/\b(english|spanish|french|german|chinese|japanese|korean|italian|portuguese|russian|arabic|hindi|bengali|tamil|telugu|marathi|gujarati|punjabi|urdu|language|grammar|vocabulary|speaking|listening|reading|writing|pronunciation|conversation|fluency|ielts|toefl|toeic)\b/)) {
    return 'language';
  }
  
  // Competitive Exams
  if (course.match(/\b(jee|neet|cat|gate|upsc|ssc|bank|railway|exam|competitive|entrance|ias|ips|pcs|cds|nda|afcat|clat|aiims|bitsat|wbjee|comedk|viteee|srmjeee|kiitee|manipal|amueee)\b/)) {
    return 'competitive';
  }
  
  // Professional Certifications
  if (course.match(/\b(aws|azure|google cloud|gcp|cisco|microsoft|oracle|ibm|salesforce|vmware|redhat|comptia|pmp|scrum|agile|itil|certification|certified|professional|associate|expert|specialist|architect)\b/)) {
    return 'certification';
  }
  
  // Business & Management (comprehensive)
  if (course.match(/\b(business|marketing|finance|accounting|management|economics|sales|entrepreneurship|commerce|trade|investment|banking|insurance|hr|human resources|operations|strategy|consulting|leadership|negotiation|communication|presentation)\b/)) {
    return 'business';
  }
  
  // Science & Research (comprehensive)
  if (course.match(/\b(science|physics|chemistry|biology|mathematics|math|calculus|algebra|geometry|statistics|data|research|analysis|laboratory|experiment|theory|quantum|molecular|organic|inorganic|genetics|ecology|astronomy|geology|meteorology|botany|zoology)\b/)) {
    return 'science';
  }
  
  // Arts & Creative (comprehensive)
  if (course.match(/\b(art|design|photography|music|drawing|painting|creative|graphics|video|animation|illustration|sculpture|pottery|crafts|fashion|interior|architecture|film|cinema|theater|dance|singing|instrument|guitar|piano|violin|drums)\b/)) {
    return 'arts';
  }
  
  // Health & Fitness (comprehensive)
  if (course.match(/\b(health|fitness|yoga|nutrition|medical|wellness|exercise|sports|therapy|physiotherapy|diet|weight|muscle|cardio|strength|meditation|mindfulness|mental health|psychology|counseling|nursing|pharmacy|medicine|doctor|healthcare)\b/)) {
    return 'health';
  }
  
  // Academic subjects (comprehensive)
  if (course.match(/\b(history|geography|literature|philosophy|sociology|political|law|education|teaching|pedagogy|curriculum|anthropology|archaeology|linguistics|journalism|media|communication|library|information|engineering|btech|mtech|bca|mca|bba|mba|bsc|msc|ba|ma|bcom|mcom|college|university|degree|semester|syllabus|academic|diploma|bachelor|master|phd|doctorate)\b/)) {
    return 'academic';
  }
  
  // Skills & Practical (comprehensive)
  if (course.match(/\b(skill|practical|hands-on|workshop|training|course|tutorial|guide|how to|diy|craft|repair|maintenance|cooking|baking|gardening|driving|typing|computer|excel|word|powerpoint|photoshop|editing)\b/)) {
    return 'skills';
  }
  
  return 'universal';
}

function generateBlockchainTopics(courseName) {
  const name = courseName.trim();
  return [
    `Blockchain Basics and Terminology`,
    `Distributed Ledgers and Consensus Mechanisms`,
    `Cryptography Essentials for Blockchain`,
    `Ethereum Architecture Overview`,
    `Solidity: Syntax and Smart Contract Basics`,
    `Smart Contract Development Workflow`,
    `Smart Contract Testing and Security`,
    `Web3.js / Ethers.js Integration`,
    `Deploying Contracts to Testnets`,
    `Gas, Transactions, and Events`,
    `Token Standards (ERC-20, ERC-721, ERC-1155)`,
    `Building a DApp Frontend`,
    `DeFi Concepts and Protocols`,
    `NFTs: Minting and Marketplaces`,
    `Layer 2 Solutions and Scalability`,
    `Hyperledger Fabric Basics`,
    `Blockchain Security Best Practices`,
    `Production Deployment and Monitoring`
  ];
}

function generateLanguageTopics(courseName) {
  const language = courseName.toLowerCase();
  
  if (language.includes('english')) {
    return [
      'Present Simple Tense', 'Past Simple Tense', 'Future Tense Forms',
      'Present Continuous', 'Past Continuous', 'Present Perfect',
      'Modal Verbs', 'Conditional Sentences', 'Passive Voice',
      'Reported Speech', 'Phrasal Verbs', 'Vocabulary Building',
      'Reading Comprehension', 'Listening Skills', 'Speaking Practice',
      'Writing Skills', 'Business English', 'Pronunciation'
    ];
  }
  
  // Universal language learning topics
  return [
    `${courseName} Alphabet and Pronunciation`, `Basic ${courseName} Greetings`,
    `${courseName} Numbers and Counting`, `Essential ${courseName} Vocabulary`,
    `${courseName} Grammar Basics`, `${courseName} Sentence Structure`,
    `${courseName} Present Tense`, `${courseName} Past Tense`,
    `${courseName} Question Formation`, `${courseName} Conversation Practice`,
    `${courseName} Reading Skills`, `${courseName} Writing Practice`,
    `${courseName} Listening Comprehension`, `${courseName} Cultural Context`,
    `Advanced ${courseName} Grammar`, `${courseName} Fluency Practice`
  ];
}

function generateProgrammingTopics(courseName) {
  const lang = courseName.toLowerCase();
  
  // C Programming Language - Specific topics
  if (lang === 'c' || lang.includes('c programming') || lang.includes('c language')) {
    return [
      'C Programming Setup and Environment', 'C Syntax and Structure', 
      'Variables and Data Types in C', 'Input and Output in C',
      'Operators and Expressions', 'Control Structures in C',
      'Loops in C Programming', 'Functions in C',
      'Arrays in C', 'Strings in C Programming',
      'Pointers in C', 'Structures and Unions',
      'File Handling in C', 'Dynamic Memory Allocation',
      'Preprocessor Directives', 'C Standard Library Functions',
      'Debugging C Programs', 'C Programming Best Practices'
    ];
  }
  
  if (lang.includes('javascript')) {
    return [
      'Variables and Data Types', 'Functions and Scope', 'Arrays and Objects',
      'DOM Manipulation', 'Event Handling', 'Conditional Statements',
      'Loops and Iteration', 'ES6+ Features', 'Async Programming',
      'Promises and Fetch API', 'Error Handling', 'Modules and Imports'
    ];
  }
  
  if (lang.includes('python')) {
    return [
      'Python Syntax and Variables', 'Data Types and Structures', 'Control Flow',
      'Functions and Parameters', 'Lists and Tuples', 'Dictionaries and Sets',
      'File Input/Output', 'Error Handling', 'Object-Oriented Programming',
      'Classes and Objects', 'Modules and Packages', 'Data Analysis'
    ];
  }
  
  // Universal programming topics
  return [
    `${courseName} Setup and Environment`, `${courseName} Syntax Basics`,
    `Variables and Data Types in ${courseName}`, `Control Structures`,
    `Functions and Methods`, `Data Structures`, `Object-Oriented Programming`,
    `Error Handling`, `File Operations`, `Libraries and Frameworks`,
    `Debugging Techniques`, `Best Practices`, `Project Development`,
    `Testing and Quality Assurance`, `Performance Optimization`, `Deployment`
  ];
}

function generateBusinessTopics(courseName) {
  return [
    `${courseName} Fundamentals`, `Market Research and Analysis`,
    `Business Strategy Development`, `Financial Planning and Management`,
    `Marketing and Promotion`, `Customer Relationship Management`,
    `Operations and Processes`, `Team Management and Leadership`,
    `Risk Assessment and Management`, `Performance Metrics and KPIs`,
    `Innovation and Growth Strategies`, `Competitive Analysis`,
    `Legal and Regulatory Compliance`, `Technology Integration`,
    `Sustainability and Ethics`, `Future Trends and Opportunities`
  ];
}

function generateScienceTopics(courseName) {
  return [
    `Introduction to ${courseName}`, `${courseName} Fundamentals`,
    `Research Methods in ${courseName}`, `Data Collection and Analysis`,
    `Theoretical Foundations`, `Practical Applications`,
    `Laboratory Techniques`, `Measurement and Instrumentation`,
    `Statistical Analysis`, `Hypothesis Testing`,
    `Case Studies and Examples`, `Current Research Trends`,
    `Ethical Considerations`, `Technology and Tools`,
    `Advanced Concepts`, `Real-world Applications`
  ];
}

function generateArtsTopics(courseName) {
  return [
    `${courseName} Basics and Fundamentals`, `Tools and Materials`,
    `Techniques and Methods`, `Color Theory and Composition`,
    `Style and Aesthetics`, `Creative Process and Inspiration`,
    `Historical Context and Influences`, `Digital vs Traditional Methods`,
    `Portfolio Development`, `Critique and Feedback`,
    `Professional Practices`, `Marketing and Presentation`,
    `Collaboration and Networking`, `Technology Integration`,
    `Advanced Techniques`, `Personal Style Development`
  ];
}

function generateHealthTopics(courseName) {
  return [
    `${courseName} Fundamentals`, `Anatomy and Physiology Basics`,
    `Safety and Precautions`, `Assessment and Evaluation`,
    `Planning and Goal Setting`, `Technique and Form`,
    `Progression and Adaptation`, `Nutrition and Lifestyle`,
    `Recovery and Rest`, `Injury Prevention`,
    `Monitoring and Tracking`, `Motivation and Psychology`,
    `Equipment and Tools`, `Professional Guidelines`,
    `Advanced Practices`, `Long-term Maintenance`
  ];
}

function generateAcademicTopics(courseName) {
  return [
    `Introduction to ${courseName}`, `Historical Overview`,
    `Key Concepts and Theories`, `Major Figures and Contributors`,
    `Research Methods`, `Critical Analysis Techniques`,
    `Contemporary Issues`, `Comparative Studies`,
    `Case Studies and Examples`, `Practical Applications`,
    `Ethical Considerations`, `Cultural Perspectives`,
    `Future Directions`, `Interdisciplinary Connections`,
    `Assessment and Evaluation`, `Advanced Topics`
  ];
}

function generateUniversalTopics(courseName) {
  // Enhanced universal topic generation with better structure
  const cleanName = courseName.replace(/course|learning|training|study|class|program/gi, '').trim();
  
  // Detect if it's a very specific topic that needs different approach
  const isSpecificTopic = cleanName.length < 15 && !cleanName.includes(' ');
  
  if (isSpecificTopic) {
    // For specific topics like "Excel", "Guitar", "Photography"
    return [
      `${cleanName} Basics and Setup`,
      `Getting Started with ${cleanName}`,
      `Essential ${cleanName} Skills`,
      `${cleanName} Fundamentals`,
      `Intermediate ${cleanName} Techniques`,
      `${cleanName} Best Practices`,
      `Advanced ${cleanName} Methods`,
      `${cleanName} Tips and Tricks`,
      `Common ${cleanName} Mistakes`,
      `${cleanName} Problem Solving`,
      `Professional ${cleanName} Usage`,
      `${cleanName} Projects and Examples`,
      `${cleanName} Workflow Optimization`,
      `${cleanName} Advanced Features`,
      `Mastering ${cleanName}`,
      `${cleanName} Expert Techniques`
    ];
  }
  
  // For broader topics, use progressive structure
  const beginnerTopics = [
    `Introduction to ${cleanName}`,
    `${cleanName} Fundamentals`,
    `Getting Started with ${cleanName}`,
    `Basic ${cleanName} Concepts`,
    `${cleanName} Overview and History`
  ];
  
  const intermediateTopics = [
    `Core ${cleanName} Principles`,
    `Practical ${cleanName} Applications`,
    `${cleanName} Techniques and Methods`,
    `Working with ${cleanName} Tools`,
    `${cleanName} Problem Solving`,
    `Common ${cleanName} Challenges`,
    `${cleanName} Case Studies`
  ];
  
  const advancedTopics = [
    `Advanced ${cleanName} Concepts`,
    `${cleanName} Best Practices`,
    `Professional ${cleanName} Standards`,
    `${cleanName} Innovation and Trends`,
    `Mastering ${cleanName}`,
    `${cleanName} Project Development`
  ];
  
  return [...beginnerTopics, ...intermediateTopics, ...advancedTopics];
}

function getProgressiveDifficulty(day, totalDays, skillLevel) {
  const progress = day / totalDays;
  
  if (skillLevel === 'Beginner') {
    if (progress < 0.4) return 'Beginner';
    if (progress < 0.8) return 'Intermediate';
    return 'Advanced';
  } else if (skillLevel === 'Intermediate') {
    if (progress < 0.3) return 'Beginner';
    if (progress < 0.7) return 'Intermediate';
    return 'Advanced';
  } else {
    if (progress < 0.2) return 'Intermediate';
    return 'Advanced';
  }
}