import React, { useState } from 'react';
import { Booking } from '../types/training';

interface BookingEditFormProps {
  booking: Booking;
  onSubmit: (data: Partial<Booking>) => Promise<void>;
  onCancel: () => void;
}

const BookingEditForm: React.FC<BookingEditFormProps> = ({ booking, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    company: booking.company || '',
    participants: booking.participants
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Név
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefon
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cég
        </label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Létszám
        </label>
        <input
          type="number"
          value={formData.participants}
          onChange={(e) => setFormData(prev => ({ ...prev, participants: parseInt(e.target.value) }))}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
          required
          min="1"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
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
          Mentés
        </button>
      </div>
    </form>
  );
};

export default BookingEditForm;
