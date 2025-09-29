/*
  # Fix trainer email validation

  1. Changes
    - Drop existing email constraint
    - Add new email constraint with proper validation
    - Update existing records with default email
*/

-- First, drop the existing constraint
ALTER TABLE trainers
DROP CONSTRAINT IF EXISTS valid_notification_email;

-- Update existing records with default email if empty
UPDATE trainers 
SET notification_email = name || '@larskol.hu'
WHERE notification_email = '';

-- Add new constraint with proper validation
ALTER TABLE trainers
ADD CONSTRAINT valid_notification_email
CHECK (notification_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Update demo data with proper emails
UPDATE trainers 
SET notification_email = 'kovacs.anna@larskol.hu'
WHERE name = 'Kovács Anna';

UPDATE trainers 
SET notification_email = 'nagy.peter@larskol.hu'
WHERE name = 'Nagy Péter';
