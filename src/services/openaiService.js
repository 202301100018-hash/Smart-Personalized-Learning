// OpenAI integration with dynamic fallback
let openai = null;

// Initialize OpenAI if API key is available
try {
  const key = process.env.REACT_APP_OPENAI_API_KEY;
  const isPlaceholder = key === 'your_openai_api_key_here' || key === 'sk-dummy_openai_key_add_real_key_here';
  const looksValid = typeof key === 'string' && (key.startsWith('sk-') || key.startsWith('sk_proj-') || key.startsWith('sk-proj-'));

  if (key && !isPlaceholder && looksValid) {
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: key,
      dangerouslyAllowBrowser: true
    });
    console.log('OpenAI API initialized successfully');
  } else {
    console.log('⚠️ OpenAI API key not found or invalid. Add a real key (starts with "sk-") for AI-powered roadmaps');
  }
} catch (error) {
  console.log('OpenAI initialization failed:', error);
}

export const generateCourseTopics = async (courseName, days, skillLevel, studyHours, customPrompt = null) => {
  console.log('Generating course topics for:', courseName);
  
  // Always try OpenAI first for quality content
  if (openai) {
    try {
      const topicsPerDay = Math.ceil(studyHours / 2);
      const prompt = customPrompt || `Create a detailed ${days}-day learning roadmap for "${courseName}".
      
      IMPORTANT: Generate SPECIFIC, ACTIONABLE topics, not generic ones.
      
      Course: ${courseName}
      Duration: ${days} days
      Skill Level: ${skillLevel}
      Daily Study Hours: ${studyHours}
      Topics per day: ${topicsPerDay}
      
      Requirements:
      - Each topic must be SPECIFIC to ${courseName} (not generic like "fundamentals" or "overview")
      - Include concrete skills, techniques, or knowledge areas
      - Progress from basic to advanced concepts
      - Make every 5th day a revision day with practice exercises
      - Avoid repetitive or vague titles
      
      Examples of GOOD topics:
      - For "English B1-B2": "Present Perfect Tense", "Business Email Writing", "Listening Comprehension Practice"
      - For "Python": "Variables and Data Types", "For Loops and While Loops", "File Handling"
      - For "Digital Marketing": "SEO Keyword Research", "Facebook Ads Setup", "Email Campaign Design"
      
      Return ONLY valid JSON:
      {
        "roadmap": [
          {
            "day": 1,
            "topics": [
              {
                "title": "Specific Topic Name",
                "description": "What exactly will be learned",
                "duration": "${Math.floor(studyHours/topicsPerDay)} hours",
                "difficulty": "${skillLevel}",
                "category": "Theory"
              }
            ],
            "isRevisionDay": false
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 4000
      });

      const content = response.choices?.[0]?.message?.content || '';
      let parsed;
      try {
        const cleanContent = content.replace(/```json\n?|```\n?/g, '').trim();
        parsed = JSON.parse(cleanContent);
      } catch (_) {
        // Fallback: extract JSON object boundaries
        const start = content.indexOf('{');
        const end = content.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
          const possibleJson = content.slice(start, end + 1);
          parsed = JSON.parse(possibleJson);
        } else {
          throw new Error('Unable to parse AI JSON response');
        }
      }
      console.log('OpenAI generated specific roadmap for:', courseName);
      return parsed;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      console.log('Using improved fallback generation');
    }
  } else {
    console.log('OpenAI not available - ADD YOUR API KEY for better results');
  }
  
  // Improved fallback with specific topics
  return generateSpecificRoadmap(courseName, days, skillLevel, studyHours);
};

const generateSpecificRoadmap = (courseName, days, skillLevel, studyHours) => {
  console.log(`Generating dynamic roadmap for ${courseName} - ${days} days`);
  
  // Handle generic course names
  if (!courseName || courseName.toLowerCase().includes('learning course') || courseName.trim().length < 3) {
    console.log('⚠️ Generic course name detected. Please provide a specific course name for better results.');
    courseName = 'General Learning';
  }
  
  const roadmap = [];
  const topicsPerDay = Math.max(1, Math.ceil(studyHours / 2));
  
  console.log(`⚠️ Using fallback generation. Add OpenAI API key (sk-...) for AI-powered, specific topics.`);
  
  const specificTopics = generateCourseSpecificTopics(courseName, days);
  let topicIndex = 0;
  
  for (let day = 1; day <= days; day++) {
    const dayTopics = [];
    const isRevisionDay = day % 5 === 0;
    
    if (isRevisionDay) {
      dayTopics.push({
        id: `revision_${day}`,
        title: `${courseName} Review & Practice`,
        description: `Review and test your knowledge of ${courseName} topics from previous days`,
        duration: `${studyHours} hours`,
        difficulty: skillLevel,
        category: 'Assessment',
        completed: false
      });
    } else {
      for (let i = 0; i < topicsPerDay; i++) {
        const topic = specificTopics[topicIndex % specificTopics.length];
        const topicDifficulty = getDifficultyProgression(day, days, skillLevel);
        
        dayTopics.push({
          id: `${day}_${i + 1}`,
          title: topic,
          description: `Learn and practice ${topic} with examples and exercises`,
          duration: `${Math.ceil(studyHours / topicsPerDay)} hours`,
          difficulty: topicDifficulty,
          category: i % 2 === 0 ? 'Theory' : 'Practical',
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

  return { roadmap };
};

// Removed - using course-specific topics instead

const generateCourseSpecificTopics = (courseName, days) => {
  const course = courseName.toLowerCase();
  
  // Generate specific topics based on course type
  if (course.includes('english') || course.includes('language')) {
    return [
      'Grammar Basics', 'Vocabulary Building', 'Reading Comprehension', 'Listening Skills',
      'Speaking Practice', 'Writing Fundamentals', 'Pronunciation', 'Conversation Skills',
      'Business English', 'Academic Writing', 'Phrasal Verbs', 'Idioms and Expressions',
      'Tenses Review', 'Conditional Sentences', 'Passive Voice', 'Reported Speech',
      'Email Writing', 'Presentation Skills', 'Debate and Discussion', 'Literature Reading'
    ];
  }
  
  if (course.includes('python') || course.includes('programming')) {
    return [
      'Variables and Data Types', 'Control Structures', 'Functions', 'Lists and Tuples',
      'Dictionaries', 'File Handling', 'Error Handling', 'Object-Oriented Programming',
      'Modules and Packages', 'Web Scraping', 'Data Analysis', 'GUI Development',
      'Database Integration', 'API Development', 'Testing', 'Debugging Techniques'
    ];
  }
  
  if (course.includes('marketing') || course.includes('digital')) {
    return [
      'Market Research', 'SEO Basics', 'Content Marketing', 'Social Media Strategy',
      'Email Marketing', 'PPC Advertising', 'Analytics Setup', 'Brand Development',
      'Customer Personas', 'Conversion Optimization', 'Influencer Marketing', 'Video Marketing',
      'Mobile Marketing', 'E-commerce Strategy', 'Marketing Automation', 'ROI Analysis'
    ];
  }
  
  if (course.includes('data') || course.includes('science')) {
    return [
      'Data Collection', 'Data Cleaning', 'Statistical Analysis', 'Data Visualization',
      'Machine Learning Basics', 'Python for Data Science', 'SQL Queries', 'Excel Analysis',
      'Hypothesis Testing', 'Regression Analysis', 'Classification Models', 'Clustering',
      'Time Series Analysis', 'Big Data Tools', 'Data Ethics', 'Reporting and Dashboards'
    ];
  }
  
  // Intelligent fallback based on course name analysis
  const cleanCourse = courseName.replace(/course|learning|preparation|advanced|intermediate|beginner/gi, '').trim();
  
  // If course name is too generic, create better topics
  if (cleanCourse.toLowerCase().includes('learning') || cleanCourse.length < 3) {
    return [
      'Foundation Concepts', 'Core Principles', 'Practical Applications', 'Skill Development',
      'Problem Solving', 'Advanced Techniques', 'Real-world Examples', 'Best Practices',
      'Case Studies', 'Project Work', 'Assessment Methods', 'Professional Skills',
      'Industry Standards', 'Quality Assurance', 'Continuous Improvement', 'Expert Strategies'
    ];
  }
  
  // Generate specific topics based on course name
  return [
    `Introduction to ${cleanCourse}`, `${cleanCourse} Fundamentals`, `Core ${cleanCourse} Concepts`,
    `${cleanCourse} Methodology`, `Practical ${cleanCourse} Skills`, `${cleanCourse} Applications`,
    `${cleanCourse} Problem Solving`, `Advanced ${cleanCourse}`, `${cleanCourse} Tools & Resources`,
    `${cleanCourse} Best Practices`, `${cleanCourse} Case Studies`, `${cleanCourse} Project Work`,
    `${cleanCourse} Quality Standards`, `${cleanCourse} Innovation`, `${cleanCourse} Mastery`,
    `Professional ${cleanCourse}`, `${cleanCourse} Optimization`, `${cleanCourse} Assessment`,
    `${cleanCourse} Research`, `Future of ${cleanCourse}`
  ];
};

const getDifficultyProgression = (day, totalDays, skillLevel) => {
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
};

const generateTopicForPhase = (courseName, phase, topicNumber, difficulty, duration) => {
  const courseType = detectCourseType(courseName);
  const phaseTopics = getPhaseTopics(courseType, phase, courseName);
  const selectedTopic = phaseTopics[topicNumber % phaseTopics.length];
  
  return {
    title: selectedTopic.title.replace('{course}', courseName),
    description: selectedTopic.description.replace('{course}', courseName),
    duration: `${Math.ceil(duration)} hours`,
    difficulty,
    category: selectedTopic.category
  };
};

const detectCourseType = (courseName) => {
  const name = courseName.toLowerCase();
  if (name.includes('programming') || name.includes('coding') || 
      ['python', 'java', 'javascript', 'cpp', 'c++', 'c#', 'go', 'rust'].some(lang => name.includes(lang))) {
    return 'programming';
  }
  if (name.includes('web') || name.includes('react') || name.includes('vue') || name.includes('angular')) {
    return 'web';
  }
  if (name.includes('data') || name.includes('machine learning') || name.includes('ai')) {
    return 'data';
  }
  if (name.includes('design') || name.includes('ui') || name.includes('ux')) {
    return 'design';
  }
  if (name.includes('ssc') || name.includes('jee') || name.includes('neet') || name.includes('upsc') || name.includes('gate') || name.includes('competitive') || name.includes('exam')) {
    return 'competitive';
  }
  return 'general';
};

const getPhaseTopics = (courseType, phase, courseName) => {
  const topicTemplates = {
    programming: {
      'Fundamentals and Setup': [
        { title: 'Introduction to {course}', description: 'Learn the basics, syntax, and development environment setup for {course}', category: 'Theory' },
        { title: '{course} Development Environment', description: 'Set up IDE, compiler/interpreter, and essential tools for {course} development', category: 'Practical' },
        { title: 'Basic Syntax and Structure', description: 'Understand variables, data types, and basic program structure in {course}', category: 'Theory' }
      ],
      'Core Concepts': [
        { title: 'Control Flow and Logic', description: 'Master conditional statements, loops, and program flow control in {course}', category: 'Theory' },
        { title: 'Functions and Methods', description: 'Learn to create reusable code with functions, parameters, and return values', category: 'Theory' },
        { title: 'Data Structures', description: 'Work with arrays, lists, objects, and other data structures in {course}', category: 'Practical' }
      ],
      'Practical Application': [
        { title: 'Problem Solving with {course}', description: 'Apply programming concepts to solve real-world problems and challenges', category: 'Practical' },
        { title: 'Debugging and Testing', description: 'Learn debugging techniques and testing methodologies for {course} applications', category: 'Practical' },
        { title: 'Code Organization', description: 'Understand modules, packages, and code organization best practices', category: 'Theory' }
      ],
      'Intermediate Topics': [
        { title: 'Object-Oriented Programming', description: 'Master classes, objects, inheritance, and OOP principles in {course}', category: 'Theory' },
        { title: 'Error Handling', description: 'Implement robust error handling and exception management strategies', category: 'Theory' },
        { title: 'File I/O and Data Processing', description: 'Read, write, and process files and external data sources', category: 'Practical' }
      ],
      'Advanced Concepts': [
        { title: 'Advanced {course} Features', description: 'Explore advanced language features, patterns, and programming paradigms', category: 'Theory' },
        { title: 'Performance Optimization', description: 'Optimize code performance, memory usage, and execution efficiency', category: 'Theory' },
        { title: 'Concurrency and Parallelism', description: 'Handle multiple tasks, threading, and parallel processing concepts', category: 'Advanced' }
      ],
      'Real-world Projects': [
        { title: '{course} Project Development', description: 'Build a complete application or system using {course} best practices', category: 'Practical' },
        { title: 'Integration and APIs', description: 'Connect with external services, databases, and third-party APIs', category: 'Practical' },
        { title: 'Deployment and Distribution', description: 'Package, deploy, and distribute {course} applications to production', category: 'Practical' }
      ],
      'Best Practices and Optimization': [
        { title: '{course} Design Patterns', description: 'Implement common design patterns and architectural principles', category: 'Theory' },
        { title: 'Code Quality and Standards', description: 'Follow coding standards, documentation, and quality assurance practices', category: 'Theory' },
        { title: 'Advanced Project Work', description: 'Complete advanced projects showcasing mastery of {course} concepts', category: 'Practical' }
      ]
    },
    web: {
      'Fundamentals and Setup': [
        { title: 'Web Development Basics', description: 'Understand web technologies, browsers, and development environment setup', category: 'Theory' },
        { title: 'HTML Structure and Semantics', description: 'Create well-structured, semantic HTML documents and layouts', category: 'Practical' },
        { title: 'CSS Styling and Layout', description: 'Style web pages with CSS, including flexbox and grid layouts', category: 'Practical' }
      ],
      'Core Concepts': [
        { title: 'JavaScript Fundamentals', description: 'Learn JavaScript syntax, DOM manipulation, and event handling', category: 'Theory' },
        { title: 'Responsive Web Design', description: 'Create mobile-friendly, responsive layouts and user interfaces', category: 'Practical' },
        { title: 'Web Forms and Validation', description: 'Build interactive forms with client-side and server-side validation', category: 'Practical' }
      ],
      'Practical Application': [
        { title: 'Frontend Framework Basics', description: 'Introduction to modern frontend frameworks and component-based development', category: 'Theory' },
        { title: 'State Management', description: 'Manage application state and data flow in web applications', category: 'Theory' },
        { title: 'API Integration', description: 'Connect frontend applications with backend services and APIs', category: 'Practical' }
      ],
      'Intermediate Topics': [
        { title: 'Advanced Framework Features', description: 'Explore routing, lifecycle methods, and advanced framework concepts', category: 'Theory' },
        { title: 'Build Tools and Workflow', description: 'Set up development workflow with bundlers, preprocessors, and automation', category: 'Practical' },
        { title: 'Testing Web Applications', description: 'Implement unit testing, integration testing, and end-to-end testing', category: 'Practical' }
      ],
      'Advanced Concepts': [
        { title: 'Performance Optimization', description: 'Optimize web application performance, loading times, and user experience', category: 'Theory' },
        { title: 'Progressive Web Apps', description: 'Build PWAs with offline functionality and native app features', category: 'Advanced' },
        { title: 'Advanced JavaScript', description: 'Master async programming, modules, and modern JavaScript features', category: 'Theory' }
      ],
      'Real-world Projects': [
        { title: 'Full-Stack Web Application', description: 'Build a complete web application with frontend and backend integration', category: 'Practical' },
        { title: 'Database Integration', description: 'Connect web applications with databases and implement CRUD operations', category: 'Practical' },
        { title: 'Deployment and Hosting', description: 'Deploy web applications to cloud platforms and configure hosting', category: 'Practical' }
      ],
      'Best Practices and Optimization': [
        { title: 'Web Security Best Practices', description: 'Implement security measures and protect against common vulnerabilities', category: 'Theory' },
        { title: 'Accessibility and SEO', description: 'Ensure web accessibility compliance and search engine optimization', category: 'Theory' },
        { title: 'Portfolio Project', description: 'Create a comprehensive portfolio showcasing web development skills', category: 'Practical' }
      ]
    },
    competitive: {
      'Fundamentals and Setup': [
        { title: 'Exam Pattern and Syllabus Analysis', description: 'Understand the complete exam pattern, marking scheme, and detailed syllabus for {course}', category: 'Theory' },
        { title: 'Study Plan and Time Management', description: 'Create a strategic study plan and learn effective time management techniques for {course}', category: 'Theory' },
        { title: 'Basic Concepts Review', description: 'Review fundamental concepts and identify strengths and weaknesses in {course} subjects', category: 'Theory' }
      ],
      'Core Concepts': [
        { title: 'Subject-wise Foundation Building', description: 'Build strong foundation in core subjects with concept clarity and basic problem solving', category: 'Theory' },
        { title: 'Practice Questions and MCQs', description: 'Solve topic-wise practice questions and multiple choice questions for {course}', category: 'Practical' },
        { title: 'Speed and Accuracy Development', description: 'Develop speed and accuracy through timed practice sessions and quick solving techniques', category: 'Practical' }
      ],
      'Practical Application': [
        { title: 'Mock Tests and Assessment', description: 'Take full-length mock tests and analyze performance to identify improvement areas', category: 'Assessment' },
        { title: 'Previous Year Questions Analysis', description: 'Solve and analyze previous year questions to understand exam trends and patterns', category: 'Practical' },
        { title: 'Weak Area Improvement', description: 'Focus on weak areas with targeted practice and concept reinforcement', category: 'Practical' }
      ],
      'Intermediate Topics': [
        { title: 'Advanced Problem Solving', description: 'Master advanced problem-solving techniques and shortcuts for {course} subjects', category: 'Theory' },
        { title: 'Sectional Tests and Analysis', description: 'Take sectional tests for each subject and perform detailed performance analysis', category: 'Assessment' },
        { title: 'Current Affairs and GK', description: 'Stay updated with current affairs and general knowledge relevant to {course}', category: 'Theory' }
      ],
      'Advanced Concepts': [
        { title: 'High-Level Problem Solving', description: 'Tackle high-difficulty questions and develop advanced analytical skills', category: 'Advanced' },
        { title: 'Exam Strategy and Techniques', description: 'Learn exam-specific strategies, time allocation, and question selection techniques', category: 'Theory' },
        { title: 'Stress Management and Confidence Building', description: 'Develop mental preparation, stress management, and confidence-building techniques', category: 'Theory' }
      ],
      'Real-world Projects': [
        { title: 'Full-Length Mock Exam Series', description: 'Complete comprehensive mock exam series simulating actual {course} exam conditions', category: 'Assessment' },
        { title: 'Performance Analysis and Improvement', description: 'Detailed analysis of mock test performance with targeted improvement strategies', category: 'Assessment' },
        { title: 'Final Preparation and Revision', description: 'Intensive final preparation with quick revision and last-minute tips for {course}', category: 'Assessment' }
      ],
      'Best Practices and Optimization': [
        { title: 'Exam Day Preparation', description: 'Final exam day preparation, document checklist, and last-minute revision strategies', category: 'Theory' },
        { title: 'Post-Exam Analysis', description: 'Analyze exam performance and plan for future attempts or next steps', category: 'Assessment' },
        { title: 'Continuous Improvement Strategy', description: 'Develop long-term learning strategy for competitive exam success', category: 'Theory' }
      ]
    },
    general: {
      'Fundamentals and Setup': [
        { title: 'Introduction to {course}', description: 'Learn the fundamental concepts, principles, and applications of {course}', category: 'Theory' },
        { title: 'Getting Started with {course}', description: 'Set up necessary tools, environment, and resources for learning {course}', category: 'Practical' },
        { title: 'Basic Concepts and Terminology', description: 'Understand key terms, concepts, and foundational knowledge in {course}', category: 'Theory' }
      ],
      'Core Concepts': [
        { title: 'Essential {course} Principles', description: 'Master the core principles and methodologies central to {course}', category: 'Theory' },
        { title: 'Practical {course} Applications', description: 'Apply theoretical knowledge through hands-on exercises and examples', category: 'Practical' },
        { title: '{course} Tools and Techniques', description: 'Learn essential tools, techniques, and workflows used in {course}', category: 'Practical' }
      ],
      'Practical Application': [
        { title: 'Real-world {course} Scenarios', description: 'Work through realistic scenarios and case studies in {course}', category: 'Practical' },
        { title: 'Problem-solving in {course}', description: 'Develop problem-solving skills and analytical thinking for {course}', category: 'Practical' },
        { title: '{course} Best Practices', description: 'Learn industry standards and best practices for {course}', category: 'Theory' }
      ],
      'Intermediate Topics': [
        { title: 'Intermediate {course} Concepts', description: 'Explore more complex topics and advanced applications in {course}', category: 'Theory' },
        { title: '{course} Project Work', description: 'Apply knowledge through structured projects and assignments', category: 'Practical' },
        { title: 'Analysis and Evaluation', description: 'Develop skills in analyzing and evaluating {course} solutions and outcomes', category: 'Theory' }
      ],
      'Advanced Concepts': [
        { title: 'Advanced {course} Topics', description: 'Master sophisticated concepts and cutting-edge developments in {course}', category: 'Theory' },
        { title: 'Specialized {course} Applications', description: 'Explore specialized areas and niche applications within {course}', category: 'Advanced' },
        { title: 'Research and Innovation', description: 'Engage with current research and innovative approaches in {course}', category: 'Theory' }
      ],
      'Real-world Projects': [
        { title: 'Capstone {course} Project', description: 'Complete a comprehensive project demonstrating mastery of {course}', category: 'Practical' },
        { title: 'Industry Applications', description: 'Explore how {course} is applied in various industries and contexts', category: 'Practical' },
        { title: 'Professional {course} Practice', description: 'Understand professional standards and practices in {course} field', category: 'Practical' }
      ],
      'Best Practices and Optimization': [
        { title: '{course} Mastery and Expertise', description: 'Achieve advanced proficiency and develop expertise in {course}', category: 'Theory' },
        { title: 'Continuous Learning in {course}', description: 'Develop strategies for ongoing learning and skill development', category: 'Theory' },
        { title: 'Final {course} Assessment', description: 'Comprehensive evaluation and demonstration of {course} competency', category: 'Assessment' }
      ]
    }
  };
  
  const courseTopics = topicTemplates[courseType] || topicTemplates.general;
  return courseTopics[phase] || courseTopics['Fundamentals and Setup'];
};

