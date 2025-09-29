/*
  # Update training_dates table structure

  1. Changes
    - Remove time column and combine with date field
    - Update existing records to use combined datetime
    - Add check constraint for business hours

  2. Notes
    - Ensures backward compatibility
    - Maintains data integrity
*/

-- First, update existing records to combine date and time
UPDATE training_dates
SET date = date + time
WHERE time IS NOT NULL;

-- Drop the time column as it's now combined with date
ALTER TABLE training_dates
DROP COLUMN time;

-- Add check constraint for business hours (8:00-20:00)
ALTER TABLE training_dates
ADD CONSTRAINT business_hours_only 
CHECK (
  EXTRACT(HOUR FROM date) >= 8 AND 
  EXTRACT(HOUR FROM date) < 20
);
