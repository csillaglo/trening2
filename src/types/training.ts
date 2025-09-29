// Egyszerű Training típus a kártyához
export type Training = {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  shortDescription: string;
};
export interface TrainingTopic {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface TrainingContent {
  id: string;
  title: string;
  short_description: string;
  description?: string; // Changed to optional
  price: number;
  image_url: string;
  duration?: number; // Changed to optional
  created_at: string;
}

export interface Trainer {
  id: string;
  name: string;
  bio: string;
  image_url: string;
  notification_email: string;
  created_at: string;
}

export interface TrainingDate {
  id: string;
  date: string; // ISO date string e.g. "2024-12-31"
  location: string;
  max_participants: number;
  created_at: string;
}

export interface TrainingSession {
  id: string;
  topic_id: string;
  content_id: string;
  trainer_id: string;
  date_id: string;
  is_active: boolean;
  created_at: string;
  
  // Joined data from Supabase (optional, hence '?')
  topic?: TrainingTopic;
  content?: TrainingContent; // Will now be TrainingContent with optional description and duration
  trainer?: Trainer;
  date_object?: TrainingDate; // Renamed to avoid conflict with computed 'date' string

  // Computed fields for UI, populated in TrainingContext
  title?: string;
  shortDescription?: string;
  description?: string; // This will be derived from content.description, so it can also be undefined
  imageUrl?: string;
  price?: number;
  date?: string | null; // This is the formatted date string or null
  location?: string;
}

export interface Booking {
  id: string;
  session_id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  participants: number;
  created_at: string;
  // Joined data
  session?: TrainingSession;
}
