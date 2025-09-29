import React, { useState } from 'react';
import { Training } from '../types/training';
import { X } from 'lucide-react';

interface TrainingFormProps {
  training?: Training;
  onSubmit: (data: Partial<Training>) => void;
  onCancel: () => void;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ training, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: training?.title || '',
    shortDescription: training?.shortDescription || '',
    description: training?.description || '',
    topic: training?.topic || 'recruitment',
    price: training?.price || 0,
    imageUrl: training?.imageUrl || '',
    date: training?.date || '',
    location: training?.location || 'Budapest, Központi Iroda',
    trainer: {
      name: training?.trainer?.name || '',
      bio: training?.trainer?.bio || '',
      imageUrl: training?.trainer?.imageUrl || ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('trainer.')) {
      const trainerField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        trainer: {
          ...prev.trainer,
          [trainerField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {training ? 'Tréning szerkesztése' : 'Új tréning létrehozása'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Cím</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rövid leírás</label>
            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Részletes leírás</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téma</label>
            <select
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            >
              <option value="recruitment">Toborzás</option>
              <option value="performance">Teljesítménymenedzsment</option>
              <option value="relations">Munkavállalói kapcsolatok</option>
              <option value="compensation">Javadalmazás és juttatások</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ár (HUF)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Kép URL</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dátum</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Helyszín</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tréner adatai</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Név</label>
            <input
              type="text"
              name="trainer.name"
              value={formData.trainer.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bemutatkozás</label>
            <textarea
              name="trainer.bio"
              value={formData.trainer.bio}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Profilkép URL</label>
            <input
              type="url"
              name="trainer.imageUrl"
              value={formData.trainer.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Mégse
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {training ? 'Mentés' : 'Létrehozás'}
        </button>
      </div>
    </form>
  );
};

export default TrainingForm;
