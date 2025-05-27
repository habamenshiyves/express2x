// routes/auth.js
const express = require('express');
const bcrypt  = require('bcrypt');
const db      = require('../db');
const router  = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { rows } = await db.query(
    'SELECT * FROM users WHERE username=$1',
    [username]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Utilisateur inconnu' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Mot de passe invalide' });
  req.session.user = { id: user.id, role: user.role };
  res.json({ role: user.role });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

module.exports = router;
