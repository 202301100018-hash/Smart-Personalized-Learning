import React from 'react';
import { motion } from 'framer-motion';
import { courseCategories } from '../../data/courseCategories';

const SubcategorySelector = ({ courseType, selectedSubcategory, onSelect }) => {
  const category = courseCategories[courseType];
  
  if (!category) return null;

  const renderProgrammingSubcategories = () => {
    const subcategories = Object.entries(category.subcategories);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subcategories.map(([key, subcategory]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: subcategories.indexOf([key, subcategory]) * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(key)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedSubcategory === key
                ? 'bg-blue-500 border-2 border-blue-400'
                : 'glass-effect hover:bg-white/20 border-2 border-transparent'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">{subcategory.icon}</div>
              <h3 className="text-lg font-semibold text-white">{subcategory.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCompetitiveSubcategories = () => {
    const subcategories = Object.entries(category.subcategories);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subcategories.map(([key, subcategory]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: subcategories.indexOf([key, subcategory]) * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(key)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedSubcategory === key
                ? 'bg-blue-500 border-2 border-blue-400'
                : 'glass-effect hover:bg-white/20 border-2 border-transparent'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">{subcategory.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{subcategory.name}</h3>
              <div className="text-sm text-blue-200">
                {subcategory.subjects?.map(subject => subject.name).join(', ')}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCollegeSubcategories = () => {
    const branches = Object.entries(category.branches);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map(([key, branch]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: branches.indexOf([key, branch]) * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(key)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedSubcategory === key
                ? 'bg-blue-500 border-2 border-blue-400'
                : 'glass-effect hover:bg-white/20 border-2 border-transparent'
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">{branch.name}</h3>
              <p className="text-sm text-blue-200 mt-2">8 Semesters Available</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderSkillsSubcategories = () => {
    const skillCategories = Object.entries(category.categories);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillCategories.map(([key, skillCategory]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: skillCategories.indexOf([key, skillCategory]) * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(key)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedSubcategory === key
                ? 'bg-blue-500 border-2 border-blue-400'
                : 'glass-effect hover:bg-white/20 border-2 border-transparent'
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">{skillCategory.name}</h3>
              <p className="text-sm text-blue-200">
                {skillCategory.skills?.length} skills available
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCertificationSubcategories = () => {
    const providers = Object.entries(category.providers);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map(([key, provider]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: providers.indexOf([key, provider]) * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(key)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedSubcategory === key
                ? 'bg-blue-500 border-2 border-blue-400'
                : 'glass-effect hover:bg-white/20 border-2 border-transparent'
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">{provider.name}</h3>
              <p className="text-sm text-blue-200">
                {provider.certifications?.length} certifications available
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderLanguageSubcategories = () => {
    const languages = Object.entries(category.languages);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {languages.map(([key, language]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: languages.indexOf([key, language]) * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(key)}
            className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
              selectedSubcategory === key
                ? 'bg-blue-500 border-2 border-blue-400'
                : 'glass-effect hover:bg-white/20 border-2 border-transparent'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">{language.flag}</div>
              <h3 className="text-lg font-semibold text-white">{language.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const getTitle = () => {
    switch (courseType) {
      case 'programming': return 'Select Programming Language';
      case 'competitive': return 'Select Competitive Exam';
      case 'college': return 'Select Your Branch';
      case 'skills': return 'Select Skill Category';
      case 'certifications': return 'Select Certification Provider';
      case 'languages': return 'Select Language to Learn';
      default: return 'Select Subcategory';
    }
  };

  const renderSubcategories = () => {
    switch (courseType) {
      case 'programming': return renderProgrammingSubcategories();
      case 'competitive': return renderCompetitiveSubcategories();
      case 'college': return renderCollegeSubcategories();
      case 'skills': return renderSkillsSubcategories();
      case 'certifications': return renderCertificationSubcategories();
      case 'languages': return renderLanguageSubcategories();
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">{getTitle()}</h2>
        <p className="text-blue-200">Choose your specific area of interest</p>
      </div>

      {renderSubcategories()}
    </div>
  );
};

export default SubcategorySelector;