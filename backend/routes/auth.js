const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tourist = require('../models/Tourist');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, nationality, passport_number, emergency_contact } = req.body;

    const existing = await Tourist.findByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const tourist = await Tourist.create({
      name, email,
      password: hashedPassword,
      phone, nationality,
      passport_number, emergency_contact
    });

    const token = jwt.sign({ id: tourist.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, token, tourist: { id: tourist.id, name, email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const tourist = await Tourist.findByEmail(email);
    if (!tourist) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, tourist.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: tourist.id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, tourist: { id: tourist.id, name: tourist.name, email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
});

module.exports = router;

