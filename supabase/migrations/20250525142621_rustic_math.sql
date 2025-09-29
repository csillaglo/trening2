/*
  # Add duration field to training contents

  1. Changes
    - Add duration column to training_contents table
    - Add check constraint to ensure duration is positive
*/

ALTER TABLE training_contents
ADD COLUMN duration integer NOT NULL DEFAULT 480;

-- Add constraint to ensure duration is positive (in minutes)
ALTER TABLE training_contents
ADD CONSTRAINT duration_positive 
CHECK (duration > 0);

-- Update existing records with default 8-hour duration
UPDATE training_contents
SET duration = 480;
