import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { courseCategories } from '../../data/courseCategories';

const TopicSelector = ({ courseType, subcategory, selectedTopics, onToggleTopic, onSelectAll }) => {
  const category = courseCategories[courseType];
  
  if (!category) return null;

  const renderProgrammingTopics = () => {
    const topics = category.subcategories[subcategory]?.topics || [];
    const isCompleteSelected = selectedTopics.includes('complete');
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            const isDisabled = isCompleteSelected && topic.id !== 'complete';
            
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: topics.indexOf(topic) * 0.1 }}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                onClick={() => !isDisabled && onToggleTopic(topic.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-500 border-2 border-blue-400'
                    : isDisabled
                    ? 'glass-effect opacity-50 cursor-not-allowed border-2 border-transparent'
                    : 'glass-effect hover:bg-white/20 border-2 border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-white border-white' : 'border-white/40'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{topic.name}</h3>
                    <p className="text-sm text-blue-200">{topic.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCompetitiveTopics = () => {
    const exam = category.subcategories[subcategory];
    if (!exam?.subjects) return null;
    
    return (
      <div className="space-y-6">
        {exam.subjects.map((subject) => (
          <div key={subject.id} className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">{subject.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {subject.topics.map((topic) => {
                const topicId = `${subject.id}_${topic}`;
                const isSelected = selectedTopics.includes(topicId);
                
                return (
                  <motion.div
                    key={topicId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onToggleTopic(topicId)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-500 border border-blue-400'
                        : 'bg-white/10 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-white border-white' : 'border-white/40'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-blue-500" />}
                      </div>
                      <span className="text-sm text-white">{topic}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCollegeTopics = () => {
    const branch = category.branches[subcategory];
    if (!branch?.semesters) return null;
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Select Semester</h3>
          <p className="text-blue-200">Choose which semester subjects you want to study</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(branch.semesters).map(([semester, subjects]) => {
            const semesterId = `sem_${semester}`;
            const isSelected = selectedTopics.includes(semesterId);
            
            return (
              <motion.div
                key={semesterId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleTopic(semesterId)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-500 border-2 border-blue-400'
                    : 'glass-effect hover:bg-white/20 border-2 border-transparent'
                }`}
              >
                <div className="text-center">
                  <h4 className="font-semibold text-white mb-2">Semester {semester}</h4>
                  <p className="text-xs text-blue-200">{subjects.length} subjects</p>
                  <div className="mt-2 text-xs text-blue-200">
                    {subjects.slice(0, 2).join(', ')}
                    {subjects.length > 2 && '...'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSkillTopics = () => {
    const skillCategory = category.categories[subcategory];
    if (!skillCategory?.skills) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skillCategory.skills.map((skill) => {
          const isSelected = selectedTopics.includes(skill.id);
          
          return (
            <motion.div
              key={skill.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleTopic(skill.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500 border-2 border-blue-400'
                  : 'glass-effect hover:bg-white/20 border-2 border-transparent'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                  isSelected ? 'bg-white border-white' : 'border-white/40'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{skill.name}</h3>
                  <p className="text-sm text-blue-200">{skill.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderCertificationTopics = () => {
    const provider = category.providers[subcategory];
    if (!provider?.certifications) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {provider.certifications.map((cert) => {
          const isSelected = selectedTopics.includes(cert.id);
          
          return (
            <motion.div
              key={cert.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleTopic(cert.id)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-500 border-2 border-blue-400'
                  : 'glass-effect hover:bg-white/20 border-2 border-transparent'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${
                  isSelected ? 'bg-white border-white' : 'border-white/40'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{cert.name}</h3>
                  <p className="text-sm text-blue-200">{cert.level} Level</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderLanguageTopics = () => {
    const language = category.languages[subcategory];
    if (!language?.levels) return null;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Select Proficiency Level</h3>
          <p className="text-blue-200">Choose your current or target level</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {language.levels.map((level) => {
            const isSelected = selectedTopics.includes(level.id);
            
            return (
              <motion.div
                key={level.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToggleTopic(level.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-blue-500 border-2 border-blue-400'
                    : 'glass-effect hover:bg-white/20 border-2 border-transparent'
                }`}
              >
                <div className="text-center">
                  <h4 className="font-semibold text-white mb-2">{level.name}</h4>
                  <p className="text-sm text-blue-200">{level.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const getTitle = () => {
    switch (courseType) {
      case 'programming': return 'Select Topics to Learn';
      case 'competitive': return 'Select Subjects and Topics';
      case 'college': return 'Select Semester';
      case 'skills': return 'Select Skills';
      case 'certifications': return 'Select Certifications';
      case 'languages': return 'Select Level';
      default: return 'Select Topics';
    }
  };

  const renderTopics = () => {
    switch (courseType) {
      case 'programming': return renderProgrammingTopics();
      case 'competitive': return renderCompetitiveTopics();
      case 'college': return renderCollegeTopics();
      case 'skills': return renderSkillTopics();
      case 'certifications': return renderCertificationTopics();
      case 'languages': return renderLanguageTopics();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">{getTitle()}</h2>
        <p className="text-blue-200">Choose what you want to focus on</p>
      </div>

      {renderTopics()}

      {courseType === 'programming' && (
        <div className="text-center">
          <button
            onClick={onSelectAll}
            className="text-blue-300 hover:text-white transition-colors text-sm"
          >
            Select All Topics
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicSelector;