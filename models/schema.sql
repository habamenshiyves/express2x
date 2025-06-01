-- users : patients, infirmiers, médecins
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,             -- haché en bcrypt
  role   TEXT CHECK(role IN('patient','nurse','doctor')) NOT NULL
);

-- patients (données générales)
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  first_name TEXT, last_name TEXT,
  date_of_birth DATE,
  -- etc.
  UNIQUE(user_id)
);

-- signaux vitaux relevés par infirmier
CREATE TABLE vitals (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  nurse_id   INTEGER REFERENCES users(id)     ON DELETE SET NULL,
  taken_at TIMESTAMP DEFAULT NOW(),
  temperature DECIMAL, blood_pressure TEXT,
  weight DECIMAL, heart_rate INTEGER,
  age INTEGER
);

-- consultations par le médecin
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id  INTEGER REFERENCES users(id)    ON DELETE SET NULL,
  consulted_at TIMESTAMP DEFAULT NOW(),
  observations TEXT,
  recommendations TEXT,
  prescriptions TEXT
);

-- Pour le dashboard mensuel du médecin
CREATE VIEW monthly_registrations AS
SELECT p.id AS patient_id, p.first_name, p.last_name,
       COUNT(v.id) AS visits_last_month
FROM patients p
LEFT JOIN vitals v ON v.patient_id = p.id 
  AND v.taken_at >= (CURRENT_DATE - INTERVAL '1 month')
GROUP BY p.id;
