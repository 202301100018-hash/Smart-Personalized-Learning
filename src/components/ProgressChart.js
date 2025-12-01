import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Target, Award, Flame } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProgressChart = ({ progress }) => {
  const completionPercentage = progress.totalTopics > 0 
    ? Math.round((progress.completedTopics / progress.totalTopics) * 100) 
    : 0;

  const barData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        label: 'Topics',
        data: [progress.completedTopics, progress.totalTopics - progress.completedTopics],
        backgroundColor: ['#22c55e', '#e5e7eb'],
        borderColor: ['#16a34a', '#d1d5db'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutData = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [completionPercentage, 100 - completionPercentage],
        backgroundColor: ['#22c55e', '#e5e7eb'],
        borderColor: ['#16a34a', '#d1d5db'],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Overall Progress
        </h3>
        
        <div className="text-center mb-4">
          <div className="relative w-32 h-32 mx-auto">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{completionPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-blue-200 text-sm">
            {progress.completedTopics} of {progress.totalTopics} topics completed
          </p>
        </div>
      </motion.div>

      {/* Progress Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Statistics
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white font-medium">Topics Completed</p>
                <p className="text-blue-200 text-sm">{progress.completedTopics}</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{progress.completedTopics}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Quiz Score</p>
                <p className="text-blue-200 text-sm">Best attempt</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{progress.quizScore}%</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white font-medium">Learning Streak</p>
                <p className="text-blue-200 text-sm">Days in a row</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{progress.streak}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">XP Points</p>
                <p className="text-blue-200 text-sm">Level {Math.floor((progress.xpPoints || 0) / 100) + 1}</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{progress.xpPoints || 0}</span>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Topic Progress</h3>
        <div className="h-48">
          <Bar data={barData} options={barOptions} />
        </div>
      </motion.div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-effect rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-2">Keep Going! 🚀</h3>
        <p className="text-blue-200 text-sm">
          {completionPercentage === 0 && "Start your learning journey today!"}
          {completionPercentage > 0 && completionPercentage < 25 && "Great start! You're building momentum."}
          {completionPercentage >= 25 && completionPercentage < 50 && "You're making excellent progress!"}
          {completionPercentage >= 50 && completionPercentage < 75 && "You're more than halfway there!"}
          {completionPercentage >= 75 && completionPercentage < 100 && "Almost there! You're doing amazing!"}
          {completionPercentage === 100 && "Congratulations! You've completed the course!"}
        </p>
      </motion.div>
    </div>
  );
};

export default ProgressChart;
