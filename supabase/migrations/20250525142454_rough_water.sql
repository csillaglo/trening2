/*
  # Create demo data for training platform

  1. Demo Data
    - 3 training contents
    - 2 trainers
    - 4 training dates
    - 4 training sessions

  This migration adds initial demo data to test the platform functionality.
*/

-- Insert demo trainers
INSERT INTO trainers (name, bio, image_url) VALUES
  ('Kovács Anna', 'Senior HR szakértő és tréner 15 éves tapasztalattal a szervezetfejlesztés területén. Szakterülete a vezetőfejlesztés és a teljesítménymenedzsment.', 'https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg'),
  ('Nagy Péter', 'Szervezetpszichológus és HR tanácsadó, aki specializálódott a csapatépítésre és a konfliktuskezelésre. Több mint 200 sikeres tréninget vezetett.', 'https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg');

-- Insert demo training contents
INSERT INTO training_contents (title, short_description, description, price, image_url) VALUES
  ('Vezetői készségfejlesztés', 'Fejlessze vezetői kompetenciáit és építsen hatékony csapatot', 'Átfogó vezetői képzésünk során elsajátíthatja a modern vezetési technikákat, a hatékony delegálás módszereit és a csapatmotiválás eszközeit. A gyakorlatorientált tréning segít a vezetői identitás kialakításában és a különböző vezetési stílusok megfelelő alkalmazásában.', 149000, 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'),
  
  ('Konfliktuskezelés a munkahelyen', 'Tanuljon meg hatékonyan kezelni a munkahelyi konfliktusokat', 'A konfliktuskezelési tréning során megismerheti a különböző konfliktustípusokat, azok kialakulásának okait és a hatékony megoldási stratégiákat. Gyakorlati példákon keresztül sajátíthatja el a mediációs technikákat és a konstruktív kommunikációs módszereket.', 129000, 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg'),
  
  ('Hatékony időmenedzsment', 'Optimalizálja idejét és növelje produktivitását', 'Az időmenedzsment tréning segít azonosítani az időrabló tevékenységeket, és megtanítja a prioritások helyes kezelését. Megismerheti a leghatékonyabb tervezési módszereket és időmegtakarító technikákat, amelyekkel jelentősen növelheti személyes és csapata hatékonyságát.', 99000, 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg');

-- Insert demo training dates
INSERT INTO training_dates (date, location, max_participants) VALUES
  ('2024-07-15 09:00:00+02', 'Budapest, Képzési Központ', 15),
  ('2024-07-22 09:00:00+02', 'Budapest, HR Akadémia', 12),
  ('2024-08-05 09:00:00+02', 'Budapest, Képzési Központ', 15),
  ('2024-08-19 09:00:00+02', 'Budapest, HR Akadémia', 12);

-- Insert demo training sessions
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
  (SELECT id FROM trainers WHERE name = 'Kovács Anna' LIMIT 1) tr,
  (SELECT id FROM training_dates WHERE date = '2024-07-15 09:00:00+02' LIMIT 1) d
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
  (SELECT id FROM trainers WHERE name = 'Nagy Péter' LIMIT 1) tr,
  (SELECT id FROM training_dates WHERE date = '2024-07-22 09:00:00+02' LIMIT 1) d
UNION ALL
SELECT 
  t.id,
  c.id,
  tr.id,
  d.id,
  true
FROM
  (SELECT id FROM training_topics WHERE name = 'Teljesítménymenedzsment' LIMIT 1) t,
  (SELECT id FROM training_contents WHERE title = 'Hatékony időmenedzsment' LIMIT 1) c,
  (SELECT id FROM trainers WHERE name = 'Kovács Anna' LIMIT 1) tr,
  (SELECT id FROM training_dates WHERE date = '2024-08-05 09:00:00+02' LIMIT 1) d
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
  (SELECT id FROM trainers WHERE name = 'Nagy Péter' LIMIT 1) tr,
  (SELECT id FROM training_dates WHERE date = '2024-08-19 09:00:00+02' LIMIT 1) d;
