// routes/nurse.js
const express = require('express');
const db      = require('../db');
const router  = express.Router();

router.use((req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'nurse') {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  next();
});

router.post('/vitals', async (req, res) => {
  const { patient_id, temperature, blood_pressure, weight, heart_rate, age } = req.body;
  const nurse_id = req.session.user.id;
  const q = `
    INSERT INTO vitals 
      (patient_id, nurse_id, temperature, blood_pressure, weight, heart_rate, age)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;
  const { rows } = await db.query(q, [
    patient_id, nurse_id, temperature, blood_pressure, weight, heart_rate, age
  ]);
  res.json(rows[0]);
});

router.get('/patients', async (_, res) => {
  const { rows } = await db.query('SELECT * FROM patients');
  res.json(rows);
});

module.exports = router;
