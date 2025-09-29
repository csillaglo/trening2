import React from 'react';
import TopicFilter from '../components/TopicFilter';
import MonthSection from '../components/MonthSection';
import { useTrainings } from '../context/TrainingContext';
import { groupTrainingsByMonth } from '../data/trainings';

const HomePage: React.FC = () => {
  const { filteredSessions } = useTrainings();
  const groupedTrainings = groupTrainingsByMonth(filteredSessions || []);
  
  // Sort month keys to ensure chronological order
  const sortedMonthKeys = Object.keys(groupedTrainings).sort((a, b) => {
    const [yearA, monthA] = a.split(' ');
    const [yearB, monthB] = b.split(' ');
    
    if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB);
    }
    
    const months = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 
                    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'];
    return months.indexOf(monthA) - months.indexOf(monthB);
  });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 p-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-800 text-3xl md:text-4xl font-bold leading-tight">Larskol Képzési Programok</h1>
          <p className="text-gray-600 text-base font-normal leading-relaxed">
            Célzott HR képzéseink gyakorlati tudással és friss megoldásokkal segítik a HR vezetők és szakértők fejlődését..
          </p>
        </div>
      </div>
      
      <TopicFilter />
      
      <section className="mb-10">
        <h2 className="text-gray-800 text-2xl font-bold leading-tight tracking-tight px-4 pb-3 pt-5">Közelgő képzések</h2>
        
        {sortedMonthKeys.length > 0 ? (
          sortedMonthKeys.map(monthKey => (
            <MonthSection 
              key={monthKey} 
              monthKey={monthKey} 
              trainings={groupedTrainings[monthKey]} 
            />
          ))
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-gray-600">Nincs találat a kiválasztott szűrőkkel.</p>
          </div>
        )}
      </section>
    </>
  );
};

export default HomePage;
