import React from 'react';
import { Link } from 'react-router-dom';
import { TrainingSession } from '../types/training';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrainingCardProps {
  training: TrainingSession;
}

const AnimatedTrainingCard: React.FC<TrainingCardProps> = ({ training }) => {
  const formattedDate = new Date(training.date || '').toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div 
      className="training-card"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="card-image"
        style={{ backgroundImage: `url(${training.imageUrl || ''})` }}
      ></div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center text-[#003459] text-xl font-bold">
            <Calendar className="w-4 h-4 mr-1.5" />
            {formattedDate}
          </div>
        </div>
        <h3 className="text-gray-900 text-2xl font-bold leading-tight">{training.title}</h3>
        <p className="text-gray-600 text-sm font-normal leading-normal">
          {training.shortDescription}
        </p>
        <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
          <span>
            {new Intl.NumberFormat('hu-HU', {
              style: 'currency',
              currency: 'HUF',
              maximumFractionDigits: 0
            }).format(training.price || 0) + ' + áfa'}
          </span>
          <span className="flex items-center">
            <MapPin className="w-4 h-4 mr-1.5" />
            {training.location}
          </span>
        </div>
        <Link 
          to={`/training/${training.id}`}
          className="mt-4 self-start btn-primary group"
        >
          Részletek
          <motion.span
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
};

export default AnimatedTrainingCard;
