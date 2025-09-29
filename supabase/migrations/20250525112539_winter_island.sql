/*
  # Restructure training management tables

  1. New Tables
    - `training_topics`: Stores training topic categories
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `training_contents`: Stores training content details
      - `id` (uuid, primary key)
      - `title` (text)
      - `short_description` (text)
      - `description` (text)
      - `price` (integer)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `trainers`: Stores trainer information
      - `id` (uuid, primary key)
      - `name` (text)
      - `bio` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `training_dates`: Stores available training dates
      - `id` (uuid, primary key)
      - `date` (timestamp)
      - `location` (text)
      - `max_participants` (integer)
      - `created_at` (timestamp)
    
    - `training_sessions`: Connects topics, content, trainers and dates
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key)
      - `content_id` (uuid, foreign key)
      - `trainer_id` (uuid, foreign key)
      - `date_id` (uuid, foreign key)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users
    - Add policies for public users to view active sessions
*/

-- Create training_topics table
CREATE TABLE training_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create training_contents table
CREATE TABLE training_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_description text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create trainers table
CREATE TABLE trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  bio text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create training_dates table
CREATE TABLE training_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz NOT NULL,
  location text NOT NULL,
  max_participants integer NOT NULL DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

-- Create training_sessions table
CREATE TABLE training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES training_topics(id) ON DELETE CASCADE,
  content_id uuid REFERENCES training_contents(id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES trainers(id) ON DELETE CASCADE,
  date_id uuid REFERENCES training_dates(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE training_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for training_topics
CREATE POLICY "Public users can view topics" 
  ON training_topics FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Admin users can manage topics" 
  ON training_topics 
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'training_admin@example.com');

-- Policies for training_contents
CREATE POLICY "Public users can view contents" 
  ON training_contents FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Admin users can manage contents" 
  ON training_contents 
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'training_admin@example.com');

-- Policies for trainers
CREATE POLICY "Public users can view trainers" 
  ON trainers FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Admin users can manage trainers" 
  ON trainers 
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'training_admin@example.com');

-- Policies for training_dates
CREATE POLICY "Public users can view dates" 
  ON training_dates FOR SELECT 
  TO public
  USING (true);

CREATE POLICY "Admin users can manage dates" 
  ON training_dates 
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'training_admin@example.com');

-- Policies for training_sessions
CREATE POLICY "Public users can view active sessions" 
  ON training_sessions FOR SELECT 
  TO public
  USING (is_active = true);

CREATE POLICY "Admin users can manage sessions" 
  ON training_sessions 
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'training_admin@example.com');

-- Insert initial topics
INSERT INTO training_topics (name, description) VALUES
  ('Toborzás', 'Toborzási és kiválasztási folyamatok'),
  ('Teljesítménymenedzsment', 'Teljesítményértékelés és fejlesztés'),
  ('Munkavállalói kapcsolatok', 'Munkavállalói kapcsolatok kezelése'),
  ('Javadalmazás és juttatások', 'Kompenzációs és juttatási rendszerek');
