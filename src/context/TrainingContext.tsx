import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { TrainingTopic, TrainingContent, Trainer, TrainingDate, TrainingSession } from '../types/training';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface TrainingContextType {
  topics: TrainingTopic[];
  contents: TrainingContent[];
  getSession: (id: string) => TrainingSession | undefined;
  filteredSessions: TrainingSession[];
  setFilteredSessions: (sessions: TrainingSession[]) => void;
  trainers: Trainer[];
  dates: TrainingDate[];
  sessions: TrainingSession[];
  fetchTopics: () => Promise<void>;
  fetchContents: () => Promise<void>;
  fetchTrainers: () => Promise<void>;
  fetchDates: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  createTopic: (topic: Partial<TrainingTopic>) => Promise<void>;
  updateTopic: (topic: TrainingTopic) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  createContent: (content: Partial<TrainingContent>) => Promise<void>;
  updateContent: (content: TrainingContent) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  createTrainer: (trainer: Partial<Trainer>) => Promise<void>;
  updateTrainer: (trainer: Trainer) => Promise<void>;
  deleteTrainer: (id: string) => Promise<void>;
  createDate: (date: Partial<TrainingDate>) => Promise<void>;
  updateDate: (date: TrainingDate) => Promise<void>;
  deleteDate: (id: string) => Promise<void>;
  createSession: (session: Partial<TrainingSession>) => Promise<void>;
  updateSession: (session: TrainingSession) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const TrainingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<TrainingTopic[]>([]);
  const [contents, setContents] = useState<TrainingContent[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TrainingSession[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [dates, setDates] = useState<TrainingDate[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);

  const getSession = (id: string) => {
    return sessions.find(session => session.id === id);
  };

  const fetchTopics = async () => {
    const { data, error } = await supabase.from('training_topics').select('*').order('name', { ascending: true });
    if (error) throw error;
    setTopics(data || []);
  };

  const fetchContents = async () => {
    const { data, error } = await supabase.from('training_contents').select('*').order('title', { ascending: true });
    if (error) throw error;
    setContents(data || []);
  };

  const fetchTrainers = async () => {
    const { data, error } = await supabase.from('trainers').select('*').order('name', { ascending: true });
    if (error) throw error;
    setTrainers(data || []);
  };

  const fetchDates = async () => {
    const { data, error } = await supabase.from('training_dates').select('*').order('date', { ascending: true });
    if (error) throw error;
    setDates(data || []);
  };

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('training_sessions')
      .select(`
        *,
        topic:training_topics(*),
        content:training_contents(*),
        trainer:trainers(*),
        date_object:training_dates(*) 
      `)
      .order('date', { foreignTable: 'training_dates', ascending: true });
      
    if (error) throw error;
    
    const transformedSessions = (data || []).map(session => ({
      ...session,
      title: session.content?.title,
      shortDescription: session.content?.short_description,
      description: session.content?.description,
      imageUrl: session.content?.image_url,
      price: session.content?.price,
      date: session.date_object?.date || null, // Correctly access date from date_object
      location: session.date_object?.location
    }));
    
    setSessions(transformedSessions);
    setFilteredSessions(transformedSessions);
  };

  // CRUD operations for topics
  const createTopic = async (topic: Partial<TrainingTopic>) => {
    const { data, error } = await supabase.from('training_topics').insert([topic]).select();
    if (error) throw error;
    if (data) await fetchTopics();
  };

  const updateTopic = async (topic: TrainingTopic) => {
    const { error } = await supabase.from('training_topics').update(topic).eq('id', topic.id);
    if (error) throw error;
    await fetchTopics();
  };

  const deleteTopic = async (id: string) => {
    const { error } = await supabase.from('training_topics').delete().eq('id', id);
    if (error) throw error;
    await fetchTopics();
  };

  // CRUD operations for contents
  const createContent = async (content: Partial<TrainingContent>) => {
    const { data, error } = await supabase.from('training_contents').insert([content]).select();
    if (error) throw error;
    if (data) await fetchContents();
  };

  const updateContent = async (content: TrainingContent) => {
    const { error } = await supabase.from('training_contents').update(content).eq('id', content.id);
    if (error) throw error;
    await fetchContents();
  };

  const deleteContent = async (id: string) => {
    const { error } = await supabase.from('training_contents').delete().eq('id', id);
    if (error) throw error;
    await fetchContents();
  };

  // CRUD operations for trainers
  const createTrainer = async (trainer: Partial<Trainer>) => {
    const { data, error } = await supabase.from('trainers').insert([trainer]).select();
    if (error) throw error;
    if (data) await fetchTrainers();
  };

  const updateTrainer = async (trainer: Trainer) => {
    const { error } = await supabase.from('trainers').update(trainer).eq('id', trainer.id);
    if (error) throw error;
    await fetchTrainers();
  };

  const deleteTrainer = async (id: string) => {
    const { error } = await supabase.from('trainers').delete().eq('id', id);
    if (error) throw error;
    await fetchTrainers();
  };

  // CRUD operations for dates
  const createDate = async (dateData: Partial<TrainingDate>) => {
    const { data, error } = await supabase.from('training_dates').insert([dateData]).select();
    if (error) throw error;
    if (data) await fetchDates();
  };

  const updateDate = async (dateData: TrainingDate) => {
    const { error } = await supabase.from('training_dates').update(dateData).eq('id', dateData.id);
    if (error) throw error;
    await fetchDates();
  };

  const deleteDate = async (id: string) => {
    const { error } = await supabase.from('training_dates').delete().eq('id', id);
    if (error) throw error;
    await fetchDates();
  };

  // CRUD operations for sessions
  const createSession = async (session: Partial<TrainingSession>) => {
    // Remove joined/computed fields before insert/update
    const { topic, content, trainer, date_object, title, shortDescription, description, imageUrl, price, date, location, ...dbSession } = session;
    const { data, error } = await supabase.from('training_sessions').insert([dbSession]).select();
    if (error) throw error;
    if (data) await fetchSessions();
  };

  const updateSession = async (session: TrainingSession) => {
    const { topic, content, trainer, date_object, title, shortDescription, description, imageUrl, price, date, location, ...dbSession } = session;
    const { error } = await supabase.from('training_sessions').update(dbSession).eq('id', session.id);
    if (error) throw error;
    await fetchSessions();
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase.from('training_sessions').delete().eq('id', id);
    if (error) throw error;
    await fetchSessions();
  };
  
  useEffect(() => {
    fetchTopics();
    fetchContents();
    fetchTrainers();
    fetchDates();
    fetchSessions();
  }, []);

  return (
    <TrainingContext.Provider value={{
      topics,
      getSession,
      filteredSessions,
      setFilteredSessions,
      contents,
      trainers,
      dates,
      sessions,
      fetchTopics,
      fetchContents,
      fetchTrainers,
      fetchDates,
      fetchSessions,
      createTopic,
      updateTopic,
      deleteTopic,
      createContent,
      updateContent,
      deleteContent,
      createTrainer,
      updateTrainer,
      deleteTrainer,
      createDate,
      updateDate,
      deleteDate,
      createSession,
      updateSession,
      deleteSession
    }}>
      {children}
    </TrainingContext.Provider>
  );
};

export const useTrainings = (): TrainingContextType => {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error('useTrainings must be used within a TrainingProvider');
  }
  return context;
};
