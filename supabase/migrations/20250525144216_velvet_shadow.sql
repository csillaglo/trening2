/*
  # Add notification email field for trainers

  1. Changes
    - Add notification_email column to trainers table
    - Add email format validation
*/

-- Add notification_email column
ALTER TABLE trainers
ADD COLUMN notification_email text NOT NULL DEFAULT '';

-- Add email format validation
ALTER TABLE trainers
ADD CONSTRAINT valid_notification_email
CHECK (notification_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
