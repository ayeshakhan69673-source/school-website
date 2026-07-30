const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const router = express.Router();
const SALT_ROUNDS = 10;

// --- Helpers -------------------------------------------------

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- POST /api/register ---------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, role } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const safeRole = role === 'parent' ? 'parent' : 'student';

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.query(
      'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [fullName, email, passwordHash, safeRole]
    );

    return res.status(201).json({ message: 'Account created successfully. You can now log in.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// --- POST /api/login ---------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const [rows] = await pool.query(
      'SELECT id, full_name, email, password_hash, role FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Store only what we need in the session.
    req.session.userId = user.id;
    req.session.fullName = user.full_name;
    req.session.role = user.role;

    return res.json({ message: 'Logged in successfully.' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// --- POST /api/logout ---------------------------------------
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Could not log out. Please try again.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out.' });
  });
});

// --- GET /api/session ---------------------------------------
// Lets client-side JS ask "am I logged in, and as who?"
router.get('/session', (req, res) => {
  if (req.session && req.session.userId) {
    return res.json({
      loggedIn: true,
      fullName: req.session.fullName,
      role: req.session.role
    });
  }
  return res.json({ loggedIn: false });
});

module.exports = router;