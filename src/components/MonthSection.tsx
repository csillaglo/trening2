import React from 'react';
import { Training } from '../types/training';
import AnimatedTrainingCard from './AnimatedTrainingCard';
import { motion } from 'framer-motion';

interface MonthSectionProps {
  monthKey: string;
  trainings: Training[];
}

const MonthSection: React.FC<MonthSectionProps> = ({ monthKey, trainings }) => {
  // Parse the month key in format "YYYY Month"
  const [year, month] = monthKey.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      className="mb-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
    >
      <motion.h3 
        className="text-gray-700 text-xl font-semibold leading-tight px-4 pb-3 pt-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {year}. {month}
      </motion.h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        {trainings.map(training => (
          <AnimatedTrainingCard key={training.id} training={training} />
        ))}
      </div>
    </motion.div>
  );
};

export default MonthSection;
