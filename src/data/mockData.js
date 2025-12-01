// Mock data for the learning roadmap application

export const mockTopics = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the fundamentals of React including components, JSX, and props",
    duration: "2 hours",
    difficulty: "Beginner",
    category: "Frontend"
  },
  {
    id: 2,
    title: "State Management",
    description: "Understanding useState and useEffect hooks",
    duration: "3 hours",
    difficulty: "Intermediate",
    category: "Frontend"
  },
  {
    id: 3,
    title: "Component Lifecycle",
    description: "Learn about component mounting, updating, and unmounting",
    duration: "2.5 hours",
    difficulty: "Intermediate",
    category: "Frontend"
  },
  {
    id: 4,
    title: "Routing in React",
    description: "Implement navigation with React Router",
    duration: "2 hours",
    difficulty: "Intermediate",
    category: "Frontend"
  },
  {
    id: 5,
    title: "API Integration",
    description: "Fetch data from external APIs using fetch and axios",
    duration: "3 hours",
    difficulty: "Advanced",
    category: "Backend Integration"
  }
];

export const mockVideos = [
  {
    id: 1,
    title: "React Tutorial for Beginners",
    thumbnail: "https://img.youtube.com/vi/SqcY0GlETPk/maxresdefault.jpg",
    duration: "2:15:30",
    url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
    topicId: 1,
    channel: "Programming with Mosh"
  },
  {
    id: 2,
    title: "React Hooks Explained",
    thumbnail: "https://img.youtube.com/vi/dpw9EHDh2bM/maxresdefault.jpg",
    duration: "1:45:20",
    url: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
    topicId: 2,
    channel: "Web Dev Simplified"
  },
  {
    id: 3,
    title: "React Component Lifecycle",
    thumbnail: "https://img.youtube.com/vi/m_mtV4YaL8s/maxresdefault.jpg",
    duration: "1:30:15",
    url: "https://www.youtube.com/watch?v=m_mtV4YaL8s",
    topicId: 3,
    channel: "Academind"
  },
  {
    id: 4,
    title: "React Router Tutorial",
    thumbnail: "https://img.youtube.com/vi/59IXY5IDrBA/maxresdefault.jpg",
    duration: "1:20:45",
    url: "https://www.youtube.com/watch?v=59IXY5IDrBA",
    topicId: 4,
    channel: "The Net Ninja"
  },
  {
    id: 5,
    title: "Fetch API in React",
    thumbnail: "https://img.youtube.com/vi/cuEtnrL9-H0/maxresdefault.jpg",
    duration: "1:55:30",
    url: "https://www.youtube.com/watch?v=cuEtnrL9-H0",
    topicId: 5,
    channel: "Traversy Media"
  }
];

export const mockQuizzes = [
  {
    id: 1,
    topicId: 1,
    questions: [
      {
        id: 1,
        question: "What is JSX in React?",
        options: [
          "A JavaScript extension",
          "A syntax extension for JavaScript",
          "A CSS framework",
          "A build tool"
        ],
        correct: 1
      },
      {
        id: 2,
        question: "What is the purpose of props in React?",
        options: [
          "To store component state",
          "To pass data between components",
          "To handle events",
          "To style components"
        ],
        correct: 1
      }
    ]
  },
  {
    id: 2,
    topicId: 2,
    questions: [
      {
        id: 1,
        question: "What does useState return?",
        options: [
          "A single value",
          "An array with state and setter function",
          "A function",
          "An object"
        ],
        correct: 1
      },
      {
        id: 2,
        question: "When does useEffect run?",
        options: [
          "Only on component mount",
          "After every render",
          "Only when dependencies change",
          "All of the above"
        ],
        correct: 3
      }
    ]
  },
  {
    id: 3,
    topicId: 3,
    questions: [
      {
        id: 1,
        question: "What is the first lifecycle method called?",
        options: [
          "componentDidMount",
          "componentWillMount",
          "constructor",
          "render"
        ],
        correct: 2
      }
    ]
  },
  {
    id: 4,
    topicId: 4,
    questions: [
      {
        id: 1,
        question: "What component is used for routing in React Router?",
        options: [
          "Route",
          "Router",
          "BrowserRouter",
          "Switch"
        ],
        correct: 2
      }
    ]
  },
  {
    id: 5,
    topicId: 5,
    questions: [
      {
        id: 1,
        question: "What is the correct way to fetch data in React?",
        options: [
          "Using jQuery",
          "Using fetch or axios",
          "Using XMLHttpRequest only",
          "Using WebSockets"
        ],
        correct: 1
      }
    ]
  }
];

export const generateRoadmap = (courseName, days) => {
  const roadmap = [];
  const topicsPerDay = Math.ceil(mockTopics.length / days);
  
  for (let day = 1; day <= days; day++) {
    const startIndex = (day - 1) * topicsPerDay;
    const endIndex = Math.min(startIndex + topicsPerDay, mockTopics.length);
    const dayTopics = mockTopics.slice(startIndex, endIndex);
    
    roadmap.push({
      day,
      topics: dayTopics,
      isRevisionDay: day % 5 === 0, // Every 5th day is a revision day
      completed: false
    });
  }
  
  return {
    courseName,
    totalDays: days,
    roadmap,
    createdAt: new Date().toISOString()
  };
};
