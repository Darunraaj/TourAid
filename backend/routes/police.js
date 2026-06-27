const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const verifyToken = require('../middleware/auth');
const db = require('../db');

// GET /api/police/dashboard — Officer dashboard overview
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const stats = await Alert.getStats(7);
    const activeAlerts = await Alert.getActive({ limit: 10 });
    res.json({ success: true, stats, activeAlerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/police/alerts — All alerts with filters
router.get('/alerts', verifyToken, async (req, res) => {
  try {
    const filters = req.query;
    const alerts = await Alert.getAll(filters);
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/police/alerts/:id/respond — Officer responds to alert
router.put('/alerts/:id/respond', verifyToken, async (req, res) => {
  try {
    const { officer_id, action, notes } = req.body;
    // Log response and update status
    const alert = await Alert.update(req.params.id, { status: 'active', description: notes });
    res.json({ success: true, message: 'Response logged', alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/police/officers/status — Get all officer duty statuses
router.get('/officers/status', verifyToken, async (req, res) => {
  try {
    const officers = await db.getAllQuery(
      'SELECT id, name, badge_number, rank, station, status FROM police_officers ORDER BY status DESC'
    );
    res.json({ success: true, officers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
