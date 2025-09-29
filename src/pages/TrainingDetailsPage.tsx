import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrainings } from '../context/TrainingContext';
import BookingForm, { BookingFormData } from '../components/BookingForm';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Calendar, User, Coins, ChevronLeft } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const TrainingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getSession } = useTrainings();
  const session = getSession(id || '');
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  if (!session) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Képzés nem található</h2>
        <p className="text-gray-600 mb-6">A keresett képzés nem létezik vagy eltávolításra került.</p>
        <Link to="/" className="btn-primary">Vissza a főoldalra</Link>
      </div>
    );
  }
  
  const handleBookingSubmit = async (formData: BookingFormData) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          session_id: session.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          participants: formData.participants
        }]);

      if (error) {
        console.error('Booking error:', error);
        throw error;
      }

      // Várjunk 1.5 másodpercet, hogy ne legyen rate limit hiba
      await new Promise(res => setTimeout(res, 1500));

      // Hívjuk meg a training_applicant_email edge function-t
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/training_applicant_email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            booking: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              company: formData.company,
              participants: formData.participants,
              session_id: session.id
            },
            session
          })
        });
        const text = await response.text();
        let errorMsg = '';
        try {
          const json = JSON.parse(text);
          if (json.error) errorMsg = json.error;
        } catch {}
        if (!response.ok) {
          console.error('training_applicant_email error:', response.status, errorMsg || text);
        } else {
          console.log('training_applicant_email response:', response.status, text);
        }
      } catch (err) {
        console.error('training_applicant_email fetch error:', err);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      throw error;
    }
  };
  
  const formattedDate = new Date(session.date || '').toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const formattedPrice = new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0
  }).format(session.price || 0) + ' + áfa';

  return (
    <div className="pb-10">
  <Link to="/" className="inline-flex items-center text-[#003459] hover:text-[#00263a] transition-colors mb-6 px-4 pt-4">
        <ChevronLeft size={18} />
        <span className="ml-1">Vissza a képzésekhez</span>
      </Link>
      
  <div className="relative w-full h-64 sm:h-80 md:h-96 bg-center bg-cover rounded-lg mb-8 px-4">
        <img 
          src={session.imageUrl} 
          alt={session.title} 
          className="w-full h-full object-cover rounded-lg"
        />
    
        <div className="absolute bottom-0 left-0 p-6 ">
          <p className="text-blue-200 text-sm font-medium mb-2">{formattedDate}</p>
          <h1 className="text-3xl font-bold mb-2">{session.title}</h1>
        </div>
      </div>
  
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Képzés leírása</h2>
            {/* Render HTML content using dangerouslySetInnerHTML */}
            <div 
              className="text-gray-700 leading-relaxed mb-6 quill-content ql-editor" // Added ql-editor class here
              dangerouslySetInnerHTML={{ __html: session.description || '' }} 
            />
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar size={20} className="text-blue-500" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={20} className="text-blue-500" />
                <span>{session.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <User size={20} className="text-blue-500" />
                <span>{session.trainer?.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Coins size={20} className="text-blue-500" />
                <span>{formattedPrice}</span>
              </div>
            </div>
            
            {!showBookingForm && (
              <button 
                onClick={() => setShowBookingForm(true)}
                className="btn-primary"
              >
                Jelentkezés a képzésre
              </button>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">A trénerről</h2>
            <div className="flex items-center gap-4 mb-4">
              {session.trainer?.image_url && session.trainer.image_url.trim().length > 0 ? (
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src={session.trainer.image_url} 
                    alt={session.trainer.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
              <div>
                <h3 className="font-bold text-lg">{session.trainer?.name}</h3>
                <p className="text-gray-600 text-sm">Tréner</p>
              </div>
            </div>
            <p className="text-gray-700">{session.trainer?.bio}</p>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            {showBookingForm ? (
              <>
                <h2 className="text-xl font-bold mb-4">Jelentkezés a képzésre</h2>
                <BookingForm 
                  session={session} 
                  onSubmit={handleBookingSubmit} 
                />
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Képzés adatai</h2>
                <div className="space-y-4">
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Időpont</p>
                    <p className="font-medium">{formattedDate}</p>
                  </div>
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Képzés időtartama</p>
                    <p className="font-medium">
                      {session.content?.duration ? (
                        `${Math.floor(session.content.duration / 60)} óra${session.content.duration % 60 > 0 ? ` ${session.content.duration % 60} perc` : ''}`
                      ) : 'Nincs megadva'}
                    </p>
                  </div>
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Helyszín</p>
                    <p className="font-medium">{session.location}</p>
                  </div>
                  <div className="pb-3 border-b border-gray-200">
                    <p className="text-sm text-gray-500">Kategória</p>
                    <p className="font-medium capitalize">{session.topic?.name}</p>
                  </div>
                  <div className="pb-3">
                    <p className="text-sm text-gray-500">Ár</p>
                    <p className="font-medium text-lg">{formattedPrice}</p>
                  </div>
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="w-full mt-4 btn-primary"
                  >
                    Jelentkezés a képzésre
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailsPage;
