import React, { useState } from 'react';
import { TrainingSession } from '../types/training';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface BookingFormProps {
  session: TrainingSession;
  onSubmit: (formData: BookingFormData) => void;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  participants: number;
  sessionId: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ session, onSubmit }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    participants: 1,
    sessionId: session.id
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const maxParticipants = session.date?.max_participants || 20;
  const totalPrice = (session.price || 0) * formData.participants;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, participants: parseInt(e.target.value) }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          session_id: session.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          participants: formData.participants
        }])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Send notification emails
      const notificationResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trainer_notification_email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          booking,
          session
        })
      });

      if (!notificationResponse.ok) {
        const errorData = await notificationResponse.json();
        console.error('Notification error:', errorData);
      }

      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Hiba történt a jelentkezés során. Kérjük, próbálja újra később.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-green-700 text-xl font-bold mb-2">Sikeres jelentkezés!</h3>
        <p className="text-green-600">
          Köszönjük a jelentkezését a tréningre. A részleteket elküldtük a megadott email címre.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Teljes név
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Adja meg a teljes nevét"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email cím
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="pelda@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefonszám
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="+36 30 123 4567"
        />
      </div>
      
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Vállalat (opcionális)
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Vállalat neve"
        />
      </div>
      
      <div>
        <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1">
          Jelentkezők száma
        </label>
        <select
          id="participants"
          name="participants"
          value={formData.participants}
          onChange={handleParticipantsChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          {Array.from({ length: maxParticipants }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num} fő</option>
          ))}
        </select>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Összesen fizetendő:</span>
          <span>{new Intl.NumberFormat('hu-HU', {
            style: 'currency',
            currency: 'HUF',
            maximumFractionDigits: 0
          }).format(totalPrice) + ' + áfa'}</span>
        </div>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Feldolgozás...' : 'Jelentkezés elküldése'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
