import React, { useState } from 'react';
import { useTrainings } from '../../context/TrainingContext';
import { TrainingContent } from '../../types/training';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import RichTextEditor from '../ui/RichTextEditor'; // Import the RichTextEditor

const ContentsSection: React.FC = () => {
  const { contents, createContent, updateContent, deleteContent } = useTrainings();
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState<TrainingContent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    price: 0,
    image_url: '',
    duration: 480
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContent) {
        await updateContent({ ...editingContent, ...formData });
      } else {
        await createContent(formData);
      }
      setFormData({ title: '', short_description: '', description: '', price: 0, image_url: '', duration: 480 });
      setIsEditing(false);
      setEditingContent(null);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleEdit = (content: TrainingContent) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      short_description: content.short_description,
      description: content.description,
      price: content.price,
      image_url: content.image_url,
      duration: content.duration
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Biztosan törli ezt a tartalmat?')) {
      try {
        await deleteContent(id);
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Tréning tartalmak</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Új tartalom
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Cím</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rövid leírás</label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Részletes leírás</label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="Írja be a részletes leírást..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ár (HUF)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Időtartam (perc)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                min="30"
                step="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kép URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingContent(null);
                  setFormData({ title: '', short_description: '', description: '', price: 0, image_url: '', duration: 480 });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingContent ? 'Mentés' : 'Létrehozás'}
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
                Cím
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rövid leírás
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Időtartam
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ár
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Műveletek
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contents.map((content) => (
              <tr key={content.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={content.image_url}
                      alt={content.title}
                      className="h-10 w-10 rounded-lg object-cover mr-3"
                    />
                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{content.short_description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {Math.floor(content.duration / 60)} óra {content.duration % 60 > 0 ? `${content.duration % 60} perc` : ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Intl.NumberFormat('hu-HU', {
                      style: 'currency',
                      currency: 'HUF',
                      maximumFractionDigits: 0
                    }).format(content.price) + ' + áfa'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(content)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(content.id)}
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

export default ContentsSection;
