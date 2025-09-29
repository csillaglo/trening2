import React, { useState } from 'react';
import { useTrainings } from '../context/TrainingContext';

const TopicFilter: React.FC = () => {
  const { topics, filteredSessions, setFilteredSessions, sessions } = useTrainings();
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');

  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId);
    
    if (topicId === 'all') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(session => session.topic_id === topicId));
    }
  };

  const allTopicsOption = { id: 'all', name: 'Összes téma' };

  return (
    <div className="flex flex-wrap gap-3 px-4 pb-6">
      {[allTopicsOption, ...topics].map(topic => (
        <button
          key={topic.id}
          onClick={() => handleTopicChange(topic.id)}
          className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 text-sm font-medium transition-colors ${
            selectedTopicId === topic.id ? 'active-filter' : 'inactive-filter'
          }`}
        >
          {topic.name}
        </button>
      ))}
    </div>
  );
};


export default TopicFilter;
