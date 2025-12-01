// Simple, Working Roadmap Service
export const generateSimpleRoadmap = async (courseName, days, skillLevel = 'Intermediate', studyHours = 2) => {
  console.log('🗺️ Generating roadmap for:', courseName);
  
  const topicsPerDay = Math.max(1, Math.ceil(studyHours / 2));
  const roadmap = [];
  
  // Get course-specific topics
  const topics = getCourseTopics(courseName);
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
          description: `Learn and practice ${topic} with hands-on examples`,
          duration: `${Math.ceil(studyHours / topicsPerDay)} hours`,
          difficulty: getDifficulty(day, days, skillLevel),
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

function getCourseTopics(courseName) {
  const course = courseName.toLowerCase();
  
  if (course.includes('english') || course.includes('language')) {
    return [
      'Present Simple Tense', 'Past Simple Tense', 'Future Tense Forms',
      'Vocabulary Building', 'Reading Comprehension', 'Listening Practice',
      'Speaking Fluency', 'Writing Skills', 'Grammar Rules',
      'Pronunciation Practice', 'Conversation Skills', 'Business English',
      'Academic Writing', 'Phrasal Verbs', 'Idioms and Expressions',
      'Conditional Sentences', 'Passive Voice', 'Reported Speech'
    ];
  }
  
  if (course.includes('javascript') || course.includes('programming')) {
    return [
      'Variables and Data Types', 'Functions and Scope', 'Arrays and Objects',
      'DOM Manipulation', 'Event Handling', 'Async Programming',
      'ES6+ Features', 'Error Handling', 'Modules and Imports',
      'API Integration', 'Local Storage', 'Form Validation',
      'Regular Expressions', 'Debugging Techniques', 'Testing Basics',
      'Performance Optimization', 'Security Best Practices', 'Project Structure'
    ];
  }
  
  if (course.includes('python')) {
    return [
      'Variables and Data Types', 'Control Structures', 'Functions',
      'Lists and Tuples', 'Dictionaries and Sets', 'File Handling',
      'Error Handling', 'Object-Oriented Programming', 'Modules and Packages',
      'Web Scraping', 'Data Analysis with Pandas', 'NumPy Arrays',
      'Database Integration', 'API Development', 'Testing with pytest',
      'Virtual Environments', 'Package Management', 'Deployment'
    ];
  }
  
  if (course.includes('react')) {
    return [
      'JSX Syntax', 'Components and Props', 'State Management',
      'Event Handling', 'Conditional Rendering', 'Lists and Keys',
      'Forms and Inputs', 'Component Lifecycle', 'Hooks Introduction',
      'useState Hook', 'useEffect Hook', 'Custom Hooks',
      'Context API', 'React Router', 'State Management Libraries',
      'Performance Optimization', 'Testing Components', 'Deployment'
    ];
  }
  
  if (course.includes('marketing') || course.includes('digital')) {
    return [
      'Market Research', 'Target Audience Analysis', 'SEO Fundamentals',
      'Content Marketing Strategy', 'Social Media Marketing', 'Email Marketing',
      'PPC Advertising', 'Google Analytics', 'Brand Development',
      'Customer Personas', 'Conversion Optimization', 'Influencer Marketing',
      'Video Marketing', 'Mobile Marketing', 'Marketing Automation',
      'ROI Analysis', 'A/B Testing', 'Campaign Management'
    ];
  }
  
  if (course.includes('data') || course.includes('science')) {
    return [
      'Data Collection Methods', 'Data Cleaning Techniques', 'Exploratory Data Analysis',
      'Statistical Analysis', 'Data Visualization', 'Python for Data Science',
      'SQL Fundamentals', 'Excel for Analysis', 'Hypothesis Testing',
      'Regression Analysis', 'Classification Models', 'Clustering Techniques',
      'Time Series Analysis', 'Machine Learning Basics', 'Model Evaluation',
      'Big Data Tools', 'Data Ethics', 'Reporting and Dashboards'
    ];
  }
  
  // Generic fallback
  const cleanCourse = courseName.replace(/course|learning|preparation/gi, '').trim();
  return [
    `Introduction to ${cleanCourse}`, `${cleanCourse} Fundamentals`, `Core Concepts`,
    `Practical Applications`, `Hands-on Practice`, `Advanced Techniques`,
    `Real-world Examples`, `Best Practices`, `Case Studies`,
    `Project Work`, `Problem Solving`, `Quality Standards`,
    `Professional Skills`, `Industry Applications`, `Innovation Trends`,
    `Assessment Methods`, `Continuous Improvement`, `Expert Strategies`
  ];
}

function getDifficulty(day, totalDays, skillLevel) {
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