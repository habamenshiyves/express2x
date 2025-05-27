// server.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const authRoutes  = require('./routes/auth');
const nurseRoutes = require('./routes/nurse');
const doctorRoutes= require('./routes/doctor');

const app = express();
app.use(express.json());
app.use(express.static('./public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'changeme',
  resave: false,
  saveUninitialized: false
}));

// Montez vos routes
app.use('/api/auth',   authRoutes);
app.use('/api/nurse',  nurseRoutes);
app.use('/api/doctor', doctorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`⏳ Server running on port ${PORT}`));
