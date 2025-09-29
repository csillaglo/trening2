import React, { useState } from 'react';
import { useTrainings } from '../../context/TrainingContext';
import { TrainingTopic } from '../../types/training';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const TopicsSection: React.FC = () => {
  const { topics, createTopic, updateTopic, deleteTopic } = useTrainings();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TrainingTopic | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTopic) {
        await updateTopic({ ...editingTopic, ...formData });
      } else {
        await createTopic(formData);
      }
      setFormData({ name: '', description: '' });
      setIsEditing(false);
      setEditingTopic(null);
    } catch (error) {
      console.error('Error saving topic:', error);
    }
  };

  const handleEdit = (topic: TrainingTopic) => {
    setEditingTopic(topic);
    setFormData({ name: topic.name, description: topic.description });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Biztosan törli ezt a témát?')) {
      try {
        await deleteTopic(id);
      } catch (error) {
        console.error('Error deleting topic:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Tréning témák</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Új téma
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
              <label className="block text-sm font-medium text-gray-700">Leírás</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingTopic(null);
                  setFormData({ name: '', description: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingTopic ? 'Mentés' : 'Létrehozás'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Név
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leírás
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Létrehozva
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Műveletek
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topics.map((topic) => (
              <tr key={topic.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{topic.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{topic.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(topic.created_at).toLocaleDateString('hu-HU')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(topic)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(topic.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopicsSection;
