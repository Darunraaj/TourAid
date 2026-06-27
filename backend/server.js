const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const database = require('./db');

// Route imports
const authRoutes = require('./routes/auth');
const touristRoutes = require('./routes/tourists');
const alertRoutes = require('./routes/alerts');
const policeRoutes = require('./routes/police');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tourists', touristRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/police', policeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TourAid API is running', timestamp: new Date().toISOString() });
});

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Initialize DB and start server
database.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`TourAid server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

module.exports = app;
