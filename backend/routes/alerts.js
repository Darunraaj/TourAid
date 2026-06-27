const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const verifyToken = require('../middleware/auth');

// POST /api/alerts — Create emergency alert
router.post('/', verifyToken, async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/alerts/active — Get all active alerts
router.get('/active', verifyToken, async (req, res) => {
  try {
    const { alert_type, priority, location, limit } = req.query;
    const alerts = await Alert.getActive({ alert_type, priority, location, limit });
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/alerts/stats — Alert analytics
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const stats = await Alert.getStats(parseInt(days));
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/alerts/nearby — Find alerts within radius
router.get('/nearby', verifyToken, async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query;
    const alerts = await Alert.getByLocation(parseFloat(lat), parseFloat(lng), parseFloat(radius));
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/alerts/trends — Daily trend data
router.get('/trends', verifyToken, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const trends = await Alert.getTrendData(parseInt(days));
    res.json({ success: true, trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/alerts/:id — Get single alert
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/alerts/:id/resolve — Resolve alert
router.put('/:id/resolve', verifyToken, async (req, res) => {
  try {
    const { resolved_by } = req.body;
    const alert = await Alert.updateStatus(req.params.id, 'resolved', resolved_by);
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/alerts/:id/escalate — Escalate alert priority
router.put('/:id/escalate', verifyToken, async (req, res) => {
  try {
    const { priority } = req.body;
    const alert = await Alert.escalate(req.params.id, priority);
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
