import React, { useState } from 'react';
import { useTrainings } from '../../context/TrainingContext';
import { Trainer } from '../../types/training';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const TrainersSection: React.FC = () => {
  const { trainers, createTrainer, updateTrainer, deleteTrainer } = useTrainings();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image_url: '',
    notification_email: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTrainer) {
        await updateTrainer({ ...editingTrainer, ...formData });
      } else {
        await createTrainer(formData);
      }
      setFormData({ name: '', bio: '', image_url: '', notification_email: '' });
      setIsEditing(false);
      setEditingTrainer(null);
    } catch (error) {
      console.error('Error saving trainer:', error);
    }
  };

  const handleEdit = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      bio: trainer.bio,
      image_url: trainer.image_url,
      notification_email: trainer.notification_email
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Biztosan törli ezt a trénert?')) {
      try {
        await deleteTrainer(id);
      } catch (error) {
        console.error('Error deleting trainer:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Trénerek</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Új tréner
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Név</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bemutatkozás</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profilkép URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="(nem kötelező)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Értesítési email cím</label>
              <input
                type="email"
                value={formData.notification_email}
                onChange={(e) => setFormData(prev => ({ ...prev, notification_email: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingTrainer(null);
                  setFormData({ name: '', bio: '', image_url: '', notification_email: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingTrainer ? 'Mentés' : 'Létrehozás'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div key={trainer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {trainer.image_url && trainer.image_url.trim().length > 0 ? (
              <img
                src={trainer.image_url}
                alt={trainer.name}
                className="w-full h-48 object-cover"
              />
            ) : null}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{trainer.bio}</p>
              <p className="text-gray-500 text-sm mt-1">{trainer.notification_email}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(trainer)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(trainer.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainersSection;
