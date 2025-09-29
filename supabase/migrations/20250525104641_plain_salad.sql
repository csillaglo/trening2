/*
  # Create training management tables

  1. New Tables
    - `trainings`: Stores training details
      - `id` (uuid, primary key)
      - `title` (text)
      - `short_description` (text)
      - `description` (text)
      - `topic` (text)
      - `price` (integer)
      - `image_url` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `training_dates`: Stores dates for trainings
      - `id` (uuid, primary key)
      - `training_id` (uuid, foreign key)
      - `date` (timestamp)
      - `location` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `trainers`: Stores trainer information
      - `id` (uuid, primary key)
      - `name` (text)
      - `bio` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    
    - `bookings`: Stores training bookings
      - `id` (uuid, primary key)
      - `training_date_id` (uuid, foreign key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin users to manage all data
    - Add policies for public users to view active trainings and create bookings
*/

-- Create trainings table
CREATE TABLE trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_description text NOT NULL,
  description text NOT NULL,
  topic text NOT NULL,
  price integer NOT NULL,
  image_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create training_dates table
CREATE TABLE training_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id uuid REFERENCES trainings(id) ON DELETE CASCADE,
  date timestamptz NOT NULL,
  location text NOT NULL,
  is_active boolean DEFAULT true,
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

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_date_id uuid REFERENCES training_dates(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies for trainings
CREATE POLICY "Public users can view active trainings" 
  ON trainings FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admin users can manage trainings" 
  ON trainings 
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'training_admin@example.com');

-- Policies for training_dates
CREATE POLICY "Public users can view active dates" 
  ON training_dates FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admin users can manage dates" 
  ON training_dates 
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

-- Policies for bookings
CREATE POLICY "Public users can create bookings" 
  ON bookings FOR INSERT 
  TO public
  WITH CHECK (true);

CREATE POLICY "Admin users can view and manage bookings" 
  ON bookings 
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'training_admin@example.com');
