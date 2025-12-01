import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';

const QuizModal = ({ topic, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const { quizzes, dispatch } = useLearning();

  const quiz = quizzes[topic.id];
  
  if (!quiz) {
    return null;
  }

  const questions = quiz.questions;

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correct) {
        correct++;
      }
    });
    const calculatedScore = Math.round((correct / questions.length) * 100);
    setScore(calculatedScore);
    
    onComplete(calculatedScore);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const getAnswerClass = (questionId, answerIndex) => {
    if (!showResults) {
      return selectedAnswers[questionId] === answerIndex
        ? 'quiz-option selected'
        : 'quiz-option';
    }

    const question = questions.find(q => q.id === questionId);
    if (answerIndex === question.correct) {
      return 'quiz-option correct';
    }
    if (selectedAnswers[questionId] === answerIndex && answerIndex !== question.correct) {
      return 'quiz-option incorrect';
    }
    return 'quiz-option';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{topic.title} Quiz</h2>
              <p className="text-gray-600">Test your knowledge</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {!showResults ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {questions[currentQuestion].question}
                </h3>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${getAnswerClass(questions[currentQuestion].id, index)}`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={resetQuiz}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[questions[currentQuestion].id] === undefined}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-6"
              >
                {score >= 70 ? (
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {score >= 70 ? 'Great Job!' : 'Keep Learning!'}
                </h3>
                <p className="text-gray-600 mb-4">
                  You scored {score}% on this quiz
                </p>
              </motion.div>

              {/* Detailed Results */}
              <div className="space-y-3 mb-6">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`p-3 rounded-lg ${
                      selectedAnswers[question.id] === question.correct
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">
                        Question {index + 1}
                      </span>
                      {selectedAnswers[question.id] === question.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{question.question}</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">Correct Answer: </span>
                      {question.options[question.correct]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizModal;
