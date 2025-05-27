// routes/doctor.js
const express = require('express');
const db      = require('../db');
const router  = express.Router();

router.use((req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'doctor') {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  next();
});

router.get('/vitals', async (_, res) => {
  const { rows } = await db.query(`
    SELECT v.*, u.username AS nurse
    FROM vitals v
    JOIN users u ON v.nurse_id = u.id
    ORDER BY v.taken_at DESC
  `);
  res.json(rows);
});

router.post('/consultations', async (req, res) => {
  const { patient_id, observations, recommendations, prescriptions } = req.body;
  const doctor_id = req.session.user.id;
  const q = `
    INSERT INTO consultations
      (patient_id, doctor_id, observations, recommendations, prescriptions)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `;
  const { rows } = await db.query(q, [
    patient_id, doctor_id, observations, recommendations, prescriptions
  ]);
  res.json(rows[0]);
});

router.get('/patients', async (_, res) => {
  const { rows } = await db.query(`
    SELECT DISTINCT p.*
    FROM patients p
    JOIN consultations c ON c.patient_id = p.id
  `);
  res.json(rows);
});

router.get('/dashboard', async (_, res) => {
  const { rows } = await db.query('SELECT * FROM monthly_registrations');
  res.json(rows);
});

module.exports = router;
