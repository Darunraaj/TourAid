const express = require('express');
const router = express.Router();
const Tourist = require('../models/Tourist');
const verifyToken = require('../middleware/auth');

// GET /api/tourists/:id — Get tourist profile
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const tourist = await Tourist.findById(req.params.id);
    if (!tourist) return res.status(404).json({ success: false, message: 'Tourist not found' });
    res.json({ success: true, tourist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/tourists/:id/location — Update real-time location
router.put('/:id/location', verifyToken, async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;
    const location = await Tourist.updateLocation(req.params.id, latitude, longitude, accuracy);
    res.json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/tourists/:id/location-history — Get movement history
router.get('/:id/location-history', verifyToken, async (req, res) => {
  try {
    const { limit = 50, hours = 24 } = req.query;
    const history = await Tourist.getLocationHistory(req.params.id, parseInt(limit), parseInt(hours));
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/tourists/:id/status — Update tourist status
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const tourist = await Tourist.updateStatus(req.params.id, status);
    res.json({ success: true, tourist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/tourists/stats — Dashboard stats
router.get('/stats/all', verifyToken, async (req, res) => {
  try {
    const stats = await Tourist.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
