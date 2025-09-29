import React from 'react';
import { Link } from 'react-router-dom';
import { Training } from '../types/training';
import { ArrowRight } from 'lucide-react';

interface TrainingCardProps {
  training: Training;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ training }) => {
  const formattedDate = new Date(training.date).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="training-card">
      <div 
        className="card-image"
        style={{ backgroundImage: `url(${training.imageUrl})` }}
      ></div>
      <div className="flex flex-col gap-1.5">
  <p className="text-[#003459] text-gray-900 text-lg font-bold mb-1">{formattedDate}</p>
        <p className="text-gray-900 text-lg font-bold leading-tight">{training.title}</p>
        <p className="text-gray-600 text-sm font-normal leading-normal">
          {training.shortDescription}
        </p>
        <Link 
          to={`/training/${training.id}`}
          className="mt-3 self-start btn-primary"
        >
          Részletek
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default TrainingCard;
