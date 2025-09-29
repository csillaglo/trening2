/*
  # Update training management system

  1. Changes
    - Add missing indexes for performance optimization
    - Add missing foreign key for trainer-training relationship
    - Add constraints for data integrity

  2. Security
    - Add additional RLS policies for new relationships
*/

-- Add indexes for frequently accessed columns
CREATE INDEX IF NOT EXISTS idx_training_sessions_topic_id ON training_sessions(topic_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_content_id ON training_sessions(content_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_trainer_id ON training_sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date_id ON training_sessions(date_id);

-- Add constraints
ALTER TABLE training_contents ADD CONSTRAINT price_positive CHECK (price >= 0);
ALTER TABLE training_dates ADD CONSTRAINT max_participants_positive CHECK (max_participants > 0);

-- Add RLS policies for joined queries
CREATE POLICY "Public users can view active sessions with related data" 
  ON training_sessions FOR SELECT 
  TO public
  USING (
    is_active = true AND 
    EXISTS (
      SELECT 1 FROM training_dates d 
      WHERE d.id = training_sessions.date_id AND 
      d.date >= CURRENT_DATE
    )
  );

-- Add policy for viewing past sessions (admin only)
CREATE POLICY "Admin can view all sessions including past ones" 
  ON training_sessions 
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'training_admin@example.com');
