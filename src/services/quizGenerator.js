// Quiz generator with OpenAI integration and fallback
let openai = null;

try {
  if (process.env.REACT_APP_OPENAI_API_KEY && process.env.REACT_APP_OPENAI_API_KEY !== 'your_openai_api_key_here') {
    const OpenAI = require('openai');
    openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }
} catch (error) {
  console.log('OpenAI not available for quiz generation, using fallback');
}

export const generateQuiz = async (topic, difficulty = 'Intermediate') => {
  if (openai) {
    try {
      const prompt = `Generate a quiz for the topic: "${topic.title}"
      Description: ${topic.description}
      Difficulty: ${difficulty}
      
      Create 3-5 multiple choice questions with:
      - 4 options each
      - Only one correct answer
      - Mix of conceptual and practical questions
      
      Return JSON format:
      {
        "questions": [
          {
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const content = response.choices[0].message.content;
      const quiz = JSON.parse(content);
      
      return {
        id: Date.now(),
        topicId: topic.id,
        questions: quiz.questions.map((q, index) => ({
          id: index + 1,
          ...q
        }))
      };
    } catch (error) {
      console.error('Quiz Generation Error:', error);
    }
  }
  
  return generateFallbackQuiz(topic);
};

const generateFallbackQuiz = (topic) => {
  return {
    id: Date.now(),
    topicId: topic.id,
    questions: [
      {
        id: 1,
        question: `What is the main concept of ${topic.title}?`,
        options: [
          "A fundamental principle",
          "An advanced technique",
          "A basic overview",
          "A practical application"
        ],
        correct: 0,
        explanation: "This covers the fundamental principle of the topic."
      },
      {
        id: 2,
        question: `Which approach is best for learning ${topic.title}?`,
        options: [
          "Theory only",
          "Practice only", 
          "Theory and practice combined",
          "Reading documentation"
        ],
        correct: 2,
        explanation: "Combining theory with practice provides the best learning experience."
      }
    ]
  };
};