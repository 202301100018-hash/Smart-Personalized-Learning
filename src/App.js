import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LearningProvider } from './contexts/LearningContext';
import UniversalLearningForm from './components/UniversalLearningForm';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import QuickRoadmap from './components/QuickRoadmap';
import './index.css';

function App() {
  return (
    <LearningProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/universal" element={<UniversalLearningForm />} />
              <Route path="/quick" element={<QuickRoadmap />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </motion.div>
        </div>
      </Router>
    </LearningProvider>
  );
}

export default App;
