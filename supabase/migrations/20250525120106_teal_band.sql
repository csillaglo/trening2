/*
  # Fix bookings table structure and RLS policies

  1. Changes
    - Drop existing bookings table (commented out, assuming table exists)
    - Recreate bookings table with correct structure (commented out, assuming table exists)
    - Add necessary constraints and indexes (commented out, assuming they exist)
    - Refine RLS policies for clarity and correctness.
    
  2. Security
    - Enable RLS (assuming already enabled)
    - Add policies for public insert.
    - Add policies for authenticated users to view their own bookings.
    - Add policies for admin users to manage all bookings.
*/

-- Drop existing bookings table (if re-running, ensure this part is appropriate for your setup)
-- DROP TABLE IF EXISTS bookings;

-- Create new bookings table (if not already existing with correct structure)
/*
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES training_sessions(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text,
  participants integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
*/

-- Add constraints (if not already existing)
/*
ALTER TABLE bookings 
ADD CONSTRAINT participants_positive 
CHECK (participants > 0);
*/

-- Create index for faster lookups (if not already existing)
-- CREATE INDEX IF NOT EXISTS idx_bookings_session_id ON bookings(session_id);

-- Enable RLS (should be enabled on the table)
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop old policies to prevent conflicts if they exist with same names or overlapping logic
DROP POLICY IF EXISTS "Public users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Public users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Admin users can view all bookings" ON bookings;
-- Add any other old policy names here if they were different

-- New/Updated RLS Policies
CREATE POLICY "Allow public to create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.email() = email);

CREATE POLICY "Admin users can manage all bookings"
  ON bookings FOR ALL -- Applies to SELECT, INSERT, UPDATE, DELETE
  TO authenticated -- Policy applies to any authenticated user
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com') -- This condition filters for the admin
  WITH CHECK (auth.jwt() ->> 'email' = 'training_admin@example.com'); -- For INSERT/UPDATE, new data must also satisfy this (i.e., user must be admin)
