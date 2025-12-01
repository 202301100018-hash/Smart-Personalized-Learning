import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, CheckCircle } from 'lucide-react';

const SimpleRoadmapView = ({ roadmap, onTopicComplete }) => {
  if (!roadmap || !roadmap.roadmap) {
    return (
      <div className="text-center text-white">
        <p>No roadmap data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">{roadmap.courseName}</h2>
        <p className="text-blue-200">
          {roadmap.totalDays} Day Learning Journey • {roadmap.skillLevel} Level
        </p>
      </div>

      <div className="grid gap-6">
        {roadmap.roadmap.map((day, dayIndex) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
            className={`glass-effect rounded-xl p-6 ${
              day.completed ? 'border-2 border-green-500' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  day.completed ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {day.completed ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <Calendar className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Day {day.day}
                    {day.isRevisionDay && (
                      <span className="ml-2 px-2 py-1 bg-yellow-500 text-black text-xs rounded-full">
                        Revision
                      </span>
                    )}
                  </h3>
                  <p className="text-blue-200 text-sm">
                    {day.topics.length} topics • {day.topics.reduce((acc, topic) => {
                      const hours = parseInt(topic.duration) || 2;
                      return acc + hours;
                    }, 0)} hours total
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {day.topics.map((topic, topicIndex) => (
                <div
                  key={topic.id}
                  className={`p-4 rounded-lg border transition-all ${
                    topic.completed
                      ? 'bg-green-500/20 border-green-500'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{topic.title}</h4>
                      <p className="text-blue-200 text-sm mb-2">{topic.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-blue-300">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {topic.duration}
                        </span>
                        <span className="px-2 py-1 bg-blue-500/30 rounded-full">
                          {topic.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-purple-500/30 rounded-full">
                          {topic.category}
                        </span>
                      </div>
                    </div>
                    {!topic.completed && (
                      <button
                        onClick={() => onTopicComplete(dayIndex, topic.id)}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors ml-4"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimpleRoadmapView;