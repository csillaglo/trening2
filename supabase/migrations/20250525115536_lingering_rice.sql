/*
  # Add participants validation

  1. Changes
    - Add participants count column to bookings table
    - Add trigger to validate participants count against max_participants
    
  2. Notes
    - Uses a trigger instead of a check constraint for complex validation
    - Ensures participants count is positive and within session limits
*/

-- Add participants count column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'participants'
  ) THEN
    ALTER TABLE bookings ADD COLUMN participants integer NOT NULL DEFAULT 1;
  END IF;
END $$;

-- Add constraint for positive participants count
ALTER TABLE bookings 
ADD CONSTRAINT participants_positive 
CHECK (participants > 0);

-- Create function for validating participants count
CREATE OR REPLACE FUNCTION validate_booking_participants()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if participants count exceeds max_participants
  IF NEW.participants > (
    SELECT td.max_participants 
    FROM training_dates td 
    JOIN training_sessions ts ON ts.date_id = td.id 
    WHERE ts.id = NEW.session_id
  ) THEN
    RAISE EXCEPTION 'Participants count exceeds maximum allowed for this session';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
DROP TRIGGER IF EXISTS validate_booking_participants_trigger ON bookings;
CREATE TRIGGER validate_booking_participants_trigger
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION validate_booking_participants();
