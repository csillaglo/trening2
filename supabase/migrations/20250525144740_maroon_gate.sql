/*
  # Add notification email to trainers

  1. Changes
    - Add notification_email column to trainers table
    - Add email format validation constraint
*/

-- Add notification_email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'trainers' AND column_name = 'notification_email'
  ) THEN
    ALTER TABLE trainers ADD COLUMN notification_email text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Add email format validation
ALTER TABLE trainers
ADD CONSTRAINT valid_notification_email
CHECK (notification_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
