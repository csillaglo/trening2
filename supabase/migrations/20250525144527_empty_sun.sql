/*
  # Add demo data for trainers and training sessions

  1. Changes
    - Add demo trainers with proper email addresses
    - Add demo training contents
    - Add demo training dates
    - Add demo training sessions
*/

-- Update existing trainers with proper emails
UPDATE trainers 
SET notification_email = 'kovacs.anna@larskol.hu'
WHERE name = 'Kovács Anna';

UPDATE trainers 
SET notification_email = 'nagy.peter@larskol.hu'
WHERE name = 'Nagy Péter';

-- Insert additional demo trainers
INSERT INTO trainers (name, bio, image_url, notification_email) VALUES
  ('Szabó Katalin', 'HR stratéga és szervezetfejlesztési szakértő, aki több mint egy évtizedes tapasztalattal rendelkezik nagyvállalati környezetben.', 'https://images.pexels.com/photos/5905520/pexels-photo-5905520.jpeg', 'szabo.katalin@larskol.hu'),
  ('Varga Tamás', 'Certified agilis coach és változásmenedzsment specialista, aki segít a szervezeteknek az átalakulási folyamatok során.', 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg', 'varga.tamas@larskol.hu');

-- Insert additional training dates
INSERT INTO training_dates (date, location, max_participants) VALUES
  ('2024-09-10 09:00:00+02', 'Budapest, Képzési Központ', 15),
  ('2024-09-24 09:00:00+02', 'Budapest, HR Akadémia', 12);

-- Insert additional training sessions
INSERT INTO training_sessions (topic_id, content_id, trainer_id, date_id, is_active)
SELECT 
  t.id as topic_id,
  c.id as content_id,
  tr.id as trainer_id,
  d.id as date_id,
  true as is_active
FROM
  (SELECT id FROM training_topics WHERE name = 'Teljesítménymenedzsment' LIMIT 1) t,
  (SELECT id FROM training_contents WHERE title = 'Vezetői készségfejlesztés' LIMIT 1) c,
  (SELECT id FROM trainers WHERE name = 'Szabó Katalin' LIMIT 1) tr,
  (SELECT id FROM training_dates WHERE date = '2024-09-10 09:00:00+02' LIMIT 1) d
UNION ALL
SELECT 
  t.id,
  c.id,
  tr.id,
  d.id,
  true
FROM
  (SELECT id FROM training_topics WHERE name = 'Munkavállalói kapcsolatok' LIMIT 1) t,
  (SELECT id FROM training_contents WHERE title = 'Konfliktuskezelés a munkahelyen' LIMIT 1) c,
  (SELECT id FROM trainers WHERE name = 'Varga Tamás' LIMIT 1) tr,
  (SELECT id FROM training_dates WHERE date = '2024-09-24 09:00:00+02' LIMIT 1) d;
