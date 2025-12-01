// Working Roadmap Service - Input-Based Topic Generation
export const generateRoadmapFromInput = async (courseName, days, skillLevel = 'Intermediate', studyHours = 2) => {
  console.log('🗺️ Generating roadmap for input:', courseName);
  
  const topicsPerDay = Math.max(1, Math.ceil(studyHours / 2));
  const roadmap = [];
  
  // Get topics based on actual input
  const topics = getTopicsFromInput(courseName);
  let topicIndex = 0;
  
  for (let day = 1; day <= days; day++) {
    const isRevisionDay = day % 5 === 0;
    const dayTopics = [];
    
    if (isRevisionDay) {
      dayTopics.push({
        id: `revision_${day}`,
        title: `${courseName} Review & Practice`,
        description: `Review and practice ${courseName} concepts`,
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
          description: `Learn ${topic} with practical examples`,
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

function getTopicsFromInput(courseName) {
  const input = courseName.toLowerCase();
  console.log('📚 Analyzing input for topics:', input);
  
  // English Language Learning
  if (input.includes('english') || input.includes('language')) {
    return [
      'Present Simple Tense', 'Past Simple Tense', 'Future Tense Forms',
      'Present Continuous', 'Past Continuous', 'Present Perfect',
      'Modal Verbs', 'Conditional Sentences', 'Passive Voice',
      'Reported Speech', 'Phrasal Verbs', 'Vocabulary Building',
      'Reading Comprehension', 'Listening Skills', 'Speaking Practice',
      'Writing Skills', 'Business English', 'Academic English'
    ];
  }
  
  // Spanish Language
  if (input.includes('spanish') || input.includes('español')) {
    return [
      'Spanish Alphabet', 'Basic Greetings', 'Numbers and Counting',
      'Present Tense Verbs', 'Ser vs Estar', 'Gender and Articles',
      'Plural Forms', 'Question Words', 'Family Vocabulary',
      'Colors and Adjectives', 'Food Vocabulary', 'Time and Dates',
      'Past Tense', 'Future Tense', 'Subjunctive Mood',
      'Conversation Practice', 'Spanish Culture', 'Advanced Grammar'
    ];
  }
  
  // French Language
  if (input.includes('french') || input.includes('français')) {
    return [
      'French Alphabet', 'Basic Pronunciation', 'Greetings and Politeness',
      'Present Tense', 'Être and Avoir', 'Gender and Articles',
      'Numbers 1-100', 'Days and Months', 'Family Members',
      'Colors and Descriptions', 'Food and Drinks', 'Shopping Vocabulary',
      'Past Tense (Passé Composé)', 'Future Tense', 'Subjunctive',
      'French Culture', 'Conversation Skills', 'Advanced Grammar'
    ];
  }
  
  // Programming Languages
  if (input.includes('javascript') || input.includes('js')) {
    return [
      'Variables and Data Types', 'Functions and Scope', 'Arrays and Objects',
      'DOM Manipulation', 'Event Handling', 'Conditional Statements',
      'Loops and Iteration', 'ES6+ Features', 'Async Programming',
      'Promises and Fetch', 'Error Handling', 'Modules and Imports',
      'Local Storage', 'Form Validation', 'Regular Expressions',
      'Debugging Techniques', 'Performance Optimization', 'Testing Basics'
    ];
  }
  
  if (input.includes('python')) {
    return [
      'Python Syntax Basics', 'Variables and Data Types', 'Control Structures',
      'Functions and Parameters', 'Lists and Tuples', 'Dictionaries and Sets',
      'File Input/Output', 'Error Handling', 'Object-Oriented Programming',
      'Classes and Objects', 'Inheritance', 'Modules and Packages',
      'Web Scraping', 'Data Analysis with Pandas', 'NumPy Arrays',
      'Database Connections', 'API Development', 'Testing with pytest'
    ];
  }
  
  if (input.includes('react')) {
    return [
      'React Setup and JSX', 'Components and Props', 'State Management',
      'Event Handling', 'Conditional Rendering', 'Lists and Keys',
      'Forms and Controlled Components', 'Component Lifecycle', 'Hooks Introduction',
      'useState Hook', 'useEffect Hook', 'useContext Hook',
      'Custom Hooks', 'React Router', 'State Management with Redux',
      'Performance Optimization', 'Testing React Components', 'Deployment Strategies'
    ];
  }
  
  // Business and Marketing
  if (input.includes('marketing') || input.includes('digital')) {
    return [
      'Marketing Fundamentals', 'Market Research Methods', 'Target Audience Analysis',
      'SEO Basics', 'Keyword Research', 'Content Marketing Strategy',
      'Social Media Marketing', 'Facebook Advertising', 'Google Ads',
      'Email Marketing', 'Influencer Marketing', 'Video Marketing',
      'Analytics and Tracking', 'Conversion Optimization', 'Brand Development',
      'Customer Journey Mapping', 'Marketing Automation', 'ROI Analysis'
    ];
  }
  
  // Data Science
  if (input.includes('data') || input.includes('science') || input.includes('analytics')) {
    return [
      'Data Science Introduction', 'Data Collection Methods', 'Data Cleaning Techniques',
      'Exploratory Data Analysis', 'Statistical Analysis', 'Data Visualization',
      'Python for Data Science', 'Pandas Library', 'NumPy Fundamentals',
      'SQL for Data Analysis', 'Machine Learning Basics', 'Regression Analysis',
      'Classification Models', 'Clustering Techniques', 'Time Series Analysis',
      'Big Data Concepts', 'Data Ethics', 'Reporting and Dashboards'
    ];
  }
  
  // Photography
  if (input.includes('photography') || input.includes('photo')) {
    return [
      'Camera Basics', 'Exposure Triangle', 'Aperture and Depth of Field',
      'Shutter Speed Techniques', 'ISO Settings', 'Composition Rules',
      'Rule of Thirds', 'Leading Lines', 'Lighting Fundamentals',
      'Natural Light Photography', 'Portrait Photography', 'Landscape Photography',
      'Street Photography', 'Photo Editing Basics', 'Lightroom Essentials',
      'Photoshop Fundamentals', 'Color Correction', 'Professional Workflow'
    ];
  }
  
  // Music
  if (input.includes('music') || input.includes('piano') || input.includes('guitar')) {
    return [
      'Music Theory Basics', 'Notes and Scales', 'Rhythm and Time Signatures',
      'Major and Minor Scales', 'Chord Construction', 'Basic Chord Progressions',
      'Reading Sheet Music', 'Ear Training', 'Interval Recognition',
      'Circle of Fifths', 'Modes and Modal Playing', 'Song Structure',
      'Improvisation Basics', 'Recording Techniques', 'Music Production',
      'Mixing Fundamentals', 'Performance Skills', 'Music Business'
    ];
  }
  
  // Fitness and Health
  if (input.includes('fitness') || input.includes('workout') || input.includes('exercise')) {
    return [
      'Fitness Fundamentals', 'Goal Setting', 'Body Composition',
      'Cardiovascular Training', 'Strength Training Basics', 'Proper Form and Technique',
      'Progressive Overload', 'Workout Planning', 'Upper Body Exercises',
      'Lower Body Exercises', 'Core Strengthening', 'Flexibility and Mobility',
      'Nutrition Basics', 'Meal Planning', 'Recovery and Rest',
      'Injury Prevention', 'Tracking Progress', 'Advanced Training Methods'
    ];
  }
  
  // Generic fallback based on input
  const cleanInput = courseName.replace(/course|learning|training|study/gi, '').trim();
  return [
    `Introduction to ${cleanInput}`, `${cleanInput} Fundamentals`, `Basic ${cleanInput} Concepts`,
    `${cleanInput} Principles`, `Practical ${cleanInput}`, `${cleanInput} Techniques`,
    `${cleanInput} Applications`, `Advanced ${cleanInput}`, `${cleanInput} Best Practices`,
    `${cleanInput} Case Studies`, `${cleanInput} Project Work`, `${cleanInput} Assessment`,
    `Professional ${cleanInput}`, `${cleanInput} Innovation`, `${cleanInput} Mastery`,
    `${cleanInput} Optimization`, `${cleanInput} Quality Standards`, `Future of ${cleanInput}`
  ];
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