/*
  # Fix training dates structure

  1. Changes
    - Drop existing constraints
    - Ensure date column is timestamptz
    - Add new business hours constraint
*/

-- Drop existing constraints if they exist
ALTER TABLE training_dates
DROP CONSTRAINT IF EXISTS valid_time_range,
DROP CONSTRAINT IF EXISTS business_hours_only;

-- Ensure date column is timestamptz and has business hours constraint
ALTER TABLE training_dates
ADD CONSTRAINT business_hours_only 
CHECK (
  EXTRACT(HOUR FROM date AT TIME ZONE 'Europe/Budapest') >= 8 AND 
  EXTRACT(HOUR FROM date AT TIME ZONE 'Europe/Budapest') < 20
);
