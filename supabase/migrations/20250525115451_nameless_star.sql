/*
  # Add participants count to bookings

  1. Changes
    - Add participants count column to bookings table
    - Add constraint to ensure participants count is positive
    - Add constraint to ensure participants count doesn't exceed max_participants
*/

-- Add participants count column
ALTER TABLE bookings 
ADD COLUMN participants integer NOT NULL DEFAULT 1;

-- Add constraint to ensure participants count is positive
ALTER TABLE bookings 
ADD CONSTRAINT participants_positive 
CHECK (participants > 0);

-- Add constraint to ensure participants count doesn't exceed max_participants
ALTER TABLE bookings 
ADD CONSTRAINT participants_within_limit 
CHECK (participants <= (
  SELECT max_participants 
  FROM training_dates td 
  JOIN training_sessions ts ON ts.date_id = td.id 
  WHERE ts.id = bookings.session_id
));
