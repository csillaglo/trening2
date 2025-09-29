import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Booking, TrainingSession, TrainingContent, TrainingTopic, Trainer, TrainingDate } from '../types/training';
import { Calendar, MapPin, FileSpreadsheet, Pencil, Trash2 } from 'lucide-react';
import BookingEditForm from '../components/BookingEditForm';
import BookingsFilter from '../components/BookingsFilter';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Record<string, Booking[]>>({});
  const [sessions, setSessions] = useState<Record<string, TrainingSession>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<{ trainingId: string | null; dateFrom: string | null; dateTo: string | null }>({ trainingId: null, dateFrom: null, dateTo: null });

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateBooking = async (bookingId: string, data: Partial<Booking>) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update(data)
        .eq('id', bookingId);

      if (error) throw error;
      
      await fetchBookings(); // Refetch to update the list
      setEditingBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Hiba történt a mentés során. Kérjük, próbálja újra.');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm('Biztosan törli ezt a jelentkezést?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      
      await fetchBookings(); // Refetch to update the list
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Hiba történt a törlés során. Kérjük, próbálja újra.');
    }
  };

  const syncToGoogleSheets = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-bookings-to-sheets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to sync with Google Sheets');
      }

      const result = await response.json();
      alert(`Sikeres szinkronizálás! ${result.rowCount} jelentkezés exportálva.`);
    } catch (error) {
      console.error('Error syncing to Google Sheets:', error);
      alert(`Hiba történt a Google Sheets szinkronizálás során: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Fetch active sessions with leaner related data
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('training_sessions')
        .select(`
          id, topic_id, content_id, trainer_id, date_id, is_active, created_at,
          topic:training_topics(id, name),
          content:training_contents(id, title, short_description, image_url, price, created_at), 
          trainer:trainers(id, name),
          date:training_dates(id, date, location)
        `)
        .eq('is_active', true);

      if (sessionsError) throw sessionsError;
      console.log('Fetched active sessions:', sessionsData?.length);


      const activeSessionIds = (sessionsData || []).map(session => session.id);

      let bookingsData: Booking[] = [];
      if (activeSessionIds.length > 0) {
        const { data: fetchedBookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .in('session_id', activeSessionIds)
          .order('created_at', { ascending: false });

        if (bookingsError) throw bookingsError;
        bookingsData = fetchedBookings || [];
      }
      console.log('Fetched bookings for active sessions:', bookingsData.length);


      const sessionsLookup = (sessionsData || []).reduce((acc, session_from_db) => {
        // Ensure that session_from_db.content and other joined data are correctly typed or handled if null
        const typedContent = session_from_db.content as TrainingContent | null;
        const typedTopic = session_from_db.topic as TrainingTopic | null;
        const typedTrainer = session_from_db.trainer as Trainer | null;
        const typedDate = session_from_db.date as TrainingDate | null;

        const trainingSessionEntry: TrainingSession = {
          id: session_from_db.id,
          topic_id: session_from_db.topic_id,
          content_id: session_from_db.content_id,
          trainer_id: session_from_db.trainer_id,
          date_id: session_from_db.date_id,
          is_active: session_from_db.is_active,
          created_at: session_from_db.created_at,
          
          topic: typedTopic || undefined,
          content: typedContent || undefined,
          trainer: typedTrainer || undefined,
          date_object: typedDate || undefined,

          title: typedContent?.title,
          shortDescription: typedContent?.short_description,
          description: typedContent?.description, // Will be undefined if not fetched, which is fine due to optional type
          imageUrl: typedContent?.image_url,
          price: typedContent?.price,
          date: typedDate?.date || null,
          location: typedDate?.location,
        };
        acc[session_from_db.id] = trainingSessionEntry;
        return acc;
      }, {} as Record<string, TrainingSession>);
      
      console.log('Processed sessionsLookup:', Object.keys(sessionsLookup).length);

      const groupedBookings = bookingsData.reduce((acc, booking) => {
        if (!acc[booking.session_id]) {
          acc[booking.session_id] = [];
        }
        acc[booking.session_id].push(booking);
        return acc;
      }, {} as Record<string, Booking[]>);

      setSessions(sessionsLookup);
      setBookings(groupedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-gray-600">Betöltés...</div>
      </div>
    );
  }

  // Szűrt sessionIds
  const filteredSessionIds = Object.keys(sessions).filter(sessionId => {
    const session = sessions[sessionId];
    // Tréning szűrés
    if (filter.trainingId && session.content_id !== filter.trainingId) return false;
    // Dátum szűrés
    if (filter.dateFrom && session.date && new Date(session.date) < new Date(filter.dateFrom)) return false;
    if (filter.dateTo && session.date && new Date(session.date) > new Date(filter.dateTo)) return false;
    return true;
  }).sort((a, b) => {
    const dateA = new Date(sessions[a].date || 0);
    const dateB = new Date(sessions[b].date || 0);
    return dateA.getTime() - dateB.getTime();
  });

  // Tréningek listája a filterhez
  const trainingsList = Object.values(sessions)
    .map(s => ({ id: s.content_id, title: s.title }))
    .filter((v, i, arr) => arr.findIndex(t => t.id === v.id) === i); // Egyedi tréningek

  return (
    <div className="space-y-8">
      <BookingsFilter
        trainings={trainingsList}
        onFilter={setFilter}
      />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Jelentkezések kezelése</h1>
        <button
          onClick={syncToGoogleSheets}
          disabled={isSyncing}
          className="btn-primary"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          {isSyncing ? 'Szinkronizálás...' : 'Exportálás Google Sheets-be'}
        </button>
      </div>
      {filteredSessionIds.length === 0 && !isLoading && (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Nincsenek a szűrésnek megfelelő jelentkezések.</p>
        </div>
      )}
      {filteredSessionIds.map((sessionId) => {
        const session = sessions[sessionId];
        const sessionBookings = bookings[sessionId] || [];
        
        if (!session || !session.is_active) return null; 

        return (
          <div key={sessionId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <img
                  src={session.imageUrl}
                  alt={session.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">{session.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      {session.date ? new Date(session.date).toLocaleDateString('hu-HU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{session.shortDescription}</p>
                  <p className="text-blue-600 text-sm mt-2">
                    Összes jelentkező: {sessionBookings.reduce((sum, booking) => sum + booking.participants, 0)} fő
                  </p>
                </div>
              </div>
            </div>

            {sessionBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jelentkező
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Létszám
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Elérhetőség
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jelentkezés ideje
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Műveletek
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sessionBookings.map((booking) => (
                      editingBooking?.id === booking.id ? (
                        <tr key={booking.id}>
                          <td colSpan={5} className="px-6 py-4">
                            <BookingEditForm
                              booking={booking}
                              onSubmit={(data) => handleUpdateBooking(booking.id, data)}
                              onCancel={() => setEditingBooking(null)}
                            />
                          </td>
                        </tr>
                      ) : (
                        <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.name}
                            </div>
                            {booking.company && (
                              <div className="text-sm text-gray-500">
                                {booking.company}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.participants} fő
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-900">{booking.email}</div>
                            <div className="text-sm text-gray-500">{booking.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(booking.created_at).toLocaleDateString('hu-HU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setEditingBooking(booking)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Nincsenek jelentkezések ehhez a képzéshez.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingsPage;
