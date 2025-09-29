import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainings } from '../../context/TrainingContext';
import { TrainingDate } from '../../types/training';
import { Plus, Pencil, Trash2, MapPin, Users } from 'lucide-react';

const DatesSection: React.FC = () => {
  const navigate = useNavigate();
  const { dates, createDate, updateDate, deleteDate } = useTrainings();
  const [isEditing, setIsEditing] = useState(false);
  const [editingDate, setEditingDate] = useState<TrainingDate | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    max_participants: 20
  });

  const formatDateForInput = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  };

  const validateBusinessHours = (dateStr: string) => {
    const date = new Date(dateStr);
    const hours = date.getHours();
    return hours >= 8 && hours < 20;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!validateBusinessHours(formData.date)) {
        alert('Csak munkaidőben (8:00-20:00) lehet időpontot létrehozni!');
        return;
      }

      if (editingDate) {
        await updateDate({ ...editingDate, ...formData });
        setIsEditing(false);
      } else {
        await createDate(formData);
        navigate('/admin');
      }
      setFormData({ date: '', location: '', max_participants: 20 });
      setEditingDate(null);
    } catch (error) {
      console.error('Error saving date:', error);
    }
  };

  const handleEdit = (date: TrainingDate) => {
    setEditingDate(date);
    setFormData({
      date: formatDateForInput(date.date),
      location: date.location,
      max_participants: date.max_participants
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Biztosan törli ezt az időpontot?')) {
      try {
        await deleteDate(id);
      } catch (error) {
        console.error('Error deleting date:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Időpontok</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Új időpont
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Dátum és időpont</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                min="2024-01-01T08:00"
                max="2025-12-31T19:59"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Helyszín</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum létszám</label>
              <input
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                min="1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingDate(null);
                  setFormData({ date: '', location: '', max_participants: 20 });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingDate ? 'Mentés' : 'Létrehozás'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dates.map((date) => (
          <div key={date.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-900">
                {new Date(date.date).toLocaleDateString('hu-HU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(date)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(date.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {date.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Maximum {date.max_participants} fő
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatesSection;
