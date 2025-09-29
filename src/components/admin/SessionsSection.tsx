import React, { useState, useEffect } from 'react';
import { useTrainings } from '../../context/TrainingContext';
import { TrainingSession, TrainingTopic, TrainingContent, Trainer, TrainingDate } from '../../types/training';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const SessionsSection: React.FC = () => {
  const { 
    sessions, 
    topics, 
    contents, 
    trainers, 
    dates, 
    fetchSessions, 
    createSession, 
    updateSession, 
    deleteSession,
    fetchTopics,
    fetchContents,
    fetchTrainers,
    fetchDates
  } = useTrainings();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
  const [formData, setFormData] = useState<Partial<TrainingSession>>({
    topic_id: '',
    content_id: '',
    trainer_id: '',
    date_id: '',
    is_active: true,
  });

  useEffect(() => {
    // Fetch related data if not already loaded
    if (topics.length === 0) fetchTopics();
    if (contents.length === 0) fetchContents();
    if (trainers.length === 0) fetchTrainers();
    if (dates.length === 0) fetchDates();
    if (sessions.length === 0) fetchSessions();
  }, [topics.length, contents.length, trainers.length, dates.length, sessions.length, fetchTopics, fetchContents, fetchTrainers, fetchDates, fetchSessions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic_id || !formData.content_id || !formData.trainer_id || !formData.date_id) {
      alert('Minden mezőt ki kell tölteni!');
      return;
    }
    try {
      if (editingSession) {
        await updateSession({ ...editingSession, ...formData } as TrainingSession);
      } else {
        await createSession(formData);
      }
      setFormData({ topic_id: '', content_id: '', trainer_id: '', date_id: '', is_active: true });
      setIsEditing(false);
      setEditingSession(null);
    } catch (error) {
      console.error('Error saving session:', error);
      alert(`Hiba történt a képzés mentése közben: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleEdit = (session: TrainingSession) => {
    setEditingSession(session);
    setFormData({
      topic_id: session.topic_id,
      content_id: session.content_id,
      trainer_id: session.trainer_id,
      date_id: session.date_id,
      is_active: session.is_active,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Biztosan törli ezt a képzést?')) {
      try {
        await deleteSession(id);
      } catch (error) {
        console.error('Error deleting session:', error);
        alert(`Hiba történt a képzés törlése közben: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  const handleToggleActive = async (session: TrainingSession) => {
    try {
      await updateSession({ ...session, is_active: !session.is_active });
    } catch (error) {
      console.error('Error toggling session active state:', error);
      alert(`Hiba történt az állapot váltása közben: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  const formatDate = (dateString: string | undefined | null, includeTime: boolean = false) => {
    if (!dateString) return 'Nincs megadva';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Érvénytelen dátum';
      }
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      return new Intl.DateTimeFormat('hu-HU', options).format(date);
    } catch (e) {
      console.error("Error formatting date:", e, "Input was:", dateString);
      return 'Formázási hiba';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Képzések</h2>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setEditingSession(null);
              setFormData({ topic_id: '', content_id: '', trainer_id: '', date_id: '', is_active: true });
            }}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Új képzés
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Téma</label>
              <select
                value={formData.topic_id}
                onChange={(e) => setFormData(prev => ({ ...prev, topic_id: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Válasszon témát</option>
                {topics.map(topic => (
                  <option key={topic.id} value={topic.id}>{topic.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tartalom</label>
              <select
                value={formData.content_id}
                onChange={(e) => setFormData(prev => ({ ...prev, content_id: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Válasszon tartalmat</option>
                {contents.map(content => (
                  <option key={content.id} value={content.id}>{content.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tréner</label>
              <select
                value={formData.trainer_id}
                onChange={(e) => setFormData(prev => ({ ...prev, trainer_id: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Válasszon trénert</option>
                {trainers.map(trainer => (
                  <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Időpont</label>
              <select
                value={formData.date_id}
                onChange={(e) => setFormData(prev => ({ ...prev, date_id: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                <option value="">Válasszon időpontot</option>
                {dates.map(date => (
                  <option key={date.id} value={date.id}>{formatDate(date.date, false)} - {date.location}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Aktív</label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                className={`mt-1 w-full flex items-center justify-center px-3 py-2 rounded-md border ${
                  formData.is_active ? 'bg-green-500 text-white border-green-500' : 'bg-gray-200 text-gray-700 border-gray-300'
                }`}
              >
                {formData.is_active ? <ToggleRight className="w-5 h-5 mr-2" /> : <ToggleLeft className="w-5 h-5 mr-2" />}
                {formData.is_active ? 'Aktív' : 'Inaktív'}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingSession(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Mégse
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {editingSession ? 'Mentés' : 'Létrehozás'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tréning címe
              </th>
              {/* Téma oszlop eltávolítva */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tréner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Időpont
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Helyszín
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Állapot
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Műveletek
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{session.title || session.content?.title || 'N/A'}</div>
                </td>
                {/* Téma cella eltávolítva */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{session.trainer?.name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(session.date, true)}</div> {/* Időpont óra:perc megjelenítéssel */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{session.location || session.date_object?.location || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleActive(session)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      session.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {session.is_active ? 'Aktív' : 'Inaktív'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(session)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    title="Szerkesztés"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Törlés"
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

export default SessionsSection;
