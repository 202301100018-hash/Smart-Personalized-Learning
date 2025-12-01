import { generateCourseTopics } from './openaiService';
import { searchVideos } from './youtubeService';
import { courseCategories } from '../data/courseCategories';

export const generateCategoryRoadmap = async (selectionData) => {
  const { courseType, subcategory, selectedTopics, days, skillLevel, studyHours } = selectionData;
  
  try {
    console.log('Generating category-specific roadmap:', selectionData);
    
    // Generate course name and description based on selection
    const courseInfo = generateCourseInfo(courseType, subcategory, selectedTopics);
    
    // Create category-specific AI prompt
    const aiPrompt = createCategoryPrompt(courseType, courseInfo, days, skillLevel, studyHours, selectedTopics);
    
    // Generate roadmap using AI or fallback
    const roadmapData = await generateCourseTopics(
      courseInfo.courseName,
      days,
      skillLevel,
      studyHours,
      aiPrompt
    );
    
    // Add videos to first day only for faster loading
    const enhancedRoadmap = roadmapData.roadmap.map((day, dayIndex) => {
      const enhancedTopics = day.topics.map((topic, topicIndex) => ({
        ...topic,
        id: topic.id || `${day.day}_${topicIndex + 1}`,
        videos: [], // Videos will be loaded on demand
        completed: false
      }));
      
      return {
        ...day,
        topics: enhancedTopics,
        completed: false
      };
    });
    
    // Load videos for first day only
    if (enhancedRoadmap.length > 0) {
      try {
        const firstDayTopics = await Promise.all(
          enhancedRoadmap[0].topics.map(async (topic) => {
            try {
              const videos = await searchVideos(`${courseInfo.courseName} ${topic.title}`, 2);
              return { ...topic, videos };
            } catch (error) {
              return { ...topic, videos: [] };
            }
          })
        );
        enhancedRoadmap[0].topics = firstDayTopics;
      } catch (error) {
        console.log('Video loading failed for category roadmap');
      }
    }
    
    return {
      courseName: courseInfo.courseName,
      courseDescription: courseInfo.description,
      courseType,
      subcategory,
      selectedTopics,
      totalDays: days,
      skillLevel,
      studyHours,
      roadmap: enhancedRoadmap,
      createdAt: new Date().toISOString(),
      progress: {
        completedDays: 0,
        completedTopics: 0,
        totalTopics: enhancedRoadmap.reduce((acc, day) => acc + day.topics.length, 0),
        quizScore: 0,
        streak: 0,
        xpPoints: 0
      }
    };
  } catch (error) {
    console.error('Category roadmap generation failed:', error);
    throw error;
  }
};

const generateCourseInfo = (courseType, subcategory, selectedTopics) => {
  const category = courseCategories[courseType];
  
  switch (courseType) {
    case 'programming':
      const language = category.subcategories[subcategory];
      const isComplete = selectedTopics.includes('complete');
      const topicNames = isComplete 
        ? ['Complete Language'] 
        : selectedTopics.map(id => {
            const topic = language.topics.find(t => t.id === id);
            return topic ? topic.name : id;
          });
      
      return {
        courseName: `${language.name} Programming${isComplete ? '' : ` - ${topicNames.join(', ')}`}`,
        description: `Learn ${language.name} programming${isComplete ? ' from basics to advanced' : ` focusing on ${topicNames.join(', ')}`}`
      };
      
    case 'competitive':
      const exam = category.subcategories[subcategory];
      const subjects = selectedTopics.map(id => {
        const subject = exam.subjects?.find(s => s.id === id);
        return subject ? subject.name : id;
      });
      const subjectText = subjects.length > 0 ? ` - ${subjects.join(', ')}` : '';
      return {
        courseName: `${exam.name} Preparation${subjectText}`,
        description: `Comprehensive preparation for ${exam.name} competitive examination${subjectText ? ` focusing on ${subjects.join(', ')}` : ''}`
      };
      
    case 'college':
      const branch = category.branches[subcategory];
      const semesters = selectedTopics.map(id => id.replace('sem_', 'Semester ')).join(', ');
      return {
        courseName: `${branch.name} - ${semesters}`,
        description: `College curriculum for ${branch.name} covering ${semesters}`
      };
      
    case 'skills':
      const skillCategory = category.categories[subcategory];
      const skills = selectedTopics.map(id => {
        const skill = skillCategory.skills.find(s => s.id === id);
        return skill ? skill.name : id;
      });
      return {
        courseName: `${skillCategory.name} - ${skills.join(', ')}`,
        description: `Develop practical skills in ${skills.join(', ')}`
      };
      
    case 'certifications':
      const provider = category.providers[subcategory];
      const certs = selectedTopics.map(id => {
        const cert = provider.certifications.find(c => c.id === id);
        return cert ? cert.name : id;
      });
      return {
        courseName: `${provider.name} Certification - ${certs.join(', ')}`,
        description: `Prepare for ${provider.name} certifications: ${certs.join(', ')}`
      };
      
    case 'languages':
      const selectedLanguage = category.languages[subcategory];
      const levels = selectedTopics.map(id => {
        const level = selectedLanguage.levels.find(l => l.id === id);
        return level ? level.name : id;
      });
      return {
        courseName: `${selectedLanguage.name} Language Learning - ${levels.join(', ')}`,
        description: `Learn ${selectedLanguage.name} at ${levels.join(', ')} level`
      };
      
    default:
      return {
        courseName: 'Custom Learning Path',
        description: 'Personalized learning experience'
      };
  }
};

const createCategoryPrompt = (courseType, courseInfo, days, skillLevel, studyHours, selectedTopics) => {
  const basePrompt = `Generate a comprehensive ${days}-day learning roadmap for "${courseInfo.courseName}".
  
  Course Type: ${courseType}
  Skill Level: ${skillLevel}
  Daily Study Hours: ${studyHours}
  Selected Topics: ${selectedTopics.join(', ')}
  
  Requirements:
  - Create exactly ${days} days of structured learning
  - Each day should have ${Math.ceil(studyHours / 2)} relevant topics
  - Progress logically from basic to advanced concepts
  - Include hands-on practice and real-world applications
  - Make revision days every 5th day with practice exercises
  - Ensure topics are specific and actionable for ${courseType}
  `;
  
  // Add category-specific requirements
  switch (courseType) {
    case 'programming':
      return basePrompt + `
      Programming-specific requirements:
      - Include coding exercises and projects
      - Cover syntax, concepts, and practical implementation
      - Add debugging and testing practices
      - Include code review and best practices
      - Focus on real-world programming scenarios`;
      
    case 'competitive':
      return basePrompt + `
      Competitive exam requirements:
      - Include subject-wise topic coverage
      - Add mock tests and practice questions
      - Focus on exam pattern and time management
      - Include previous year questions analysis
      - Add revision and quick review sessions`;
      
    case 'college':
      return basePrompt + `
      College syllabus requirements:
      - Follow academic curriculum structure
      - Include theoretical concepts and practical labs
      - Add assignment and project work
      - Focus on exam preparation and assessment
      - Include semester-wise progression`;
      
    case 'skills':
      return basePrompt + `
      Skill-based learning requirements:
      - Focus on practical, hands-on learning
      - Include real-world projects and case studies
      - Add industry best practices and tools
      - Include portfolio development
      - Focus on job-ready skills and applications`;
      
    case 'certifications':
      return basePrompt + `
      Certification preparation requirements:
      - Follow official certification curriculum
      - Include practice exams and mock tests
      - Focus on certification-specific topics
      - Add hands-on labs and practical exercises
      - Include exam tips and strategies`;
      
    case 'languages':
      return basePrompt + `
      Language learning requirements:
      - Include grammar, vocabulary, and conversation practice
      - Add listening, speaking, reading, and writing exercises
      - Focus on practical communication scenarios
      - Include cultural context and real-world usage
      - Add pronunciation and fluency practice`;
      
    default:
      return basePrompt;
  }
};

const addVideosToRoadmap = async (roadmap, courseName) => {
  const enhancedRoadmap = [];
  
  for (const day of roadmap) {
    const enhancedTopics = [];
    
    for (const topic of day.topics) {
      try {
        const searchQuery = `${courseName} ${topic.title}`;
        const videos = await searchVideos(searchQuery, 2);
        
        enhancedTopics.push({
          ...topic,
          id: topic.id || `${day.day}_${enhancedTopics.length + 1}`,
          videos,
          completed: false
        });
      } catch (error) {
        console.log(`Video search failed for topic: ${topic.title}`);
        enhancedTopics.push({
          ...topic,
          id: topic.id || `${day.day}_${enhancedTopics.length + 1}`,
          videos: [],
          completed: false
        });
      }
    }
    
    enhancedRoadmap.push({
      ...day,
      topics: enhancedTopics
    });
  }
  
  return enhancedRoadmap;
};