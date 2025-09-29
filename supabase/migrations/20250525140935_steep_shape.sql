/*
  # Add time field to training dates

  1. Changes
    - Add time field to training_dates table
    - Update display format in existing data
*/

-- Add time field to training_dates
ALTER TABLE training_dates
ADD COLUMN time time NOT NULL DEFAULT '09:00';

-- Add check constraint for valid time
ALTER TABLE training_dates
ADD CONSTRAINT valid_time_range 
CHECK (time >= '08:00' AND time <= '20:00');
