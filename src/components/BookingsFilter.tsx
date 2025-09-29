import React, { useState } from 'react';

export interface BookingsFilterProps {
  trainings: { id: string; title: string }[];
  onFilter: (filter: { trainingId: string | null; dateFrom: string | null; dateTo: string | null }) => void;
}

const BookingsFilter: React.FC<BookingsFilterProps> = ({ trainings, onFilter }) => {
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<string | null>(null);
  const [dateTo, setDateTo] = useState<string | null>(null);

  const handleFilter = () => {
    onFilter({ trainingId, dateFrom, dateTo });
  };

  return (
    <div className="flex gap-4 items-end mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Képzés</label>
        <select
          className="border rounded px-2 py-1 w-48"
          value={trainingId || ''}
          onChange={e => setTrainingId(e.target.value || null)}
        >
          <option value="">Összes</option>
          {trainings.map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dátum -tól</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={dateFrom || ''}
          onChange={e => setDateFrom(e.target.value || null)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dátum -ig</label>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={dateTo || ''}
          onChange={e => setDateTo(e.target.value || null)}
        />
      </div>
      <button
        className="btn-primary h-9 px-4"
        onClick={handleFilter}
      >
        Szűrés
      </button>
    </div>
  );
};

export default BookingsFilter;
