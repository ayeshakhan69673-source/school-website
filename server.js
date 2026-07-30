require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware -------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
  })
);

// --- Auth guard for protected pages -------------------------------------------------
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.redirect('/login.html');
}

// Guard the dashboard BEFORE the static file middleware serves it directly.
app.get('/dashboard.html', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// --- Static files (home, login, register pages, css, js) -------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// --- API routes -------------------------------------------------
app.use('/api', authRoutes);

// --- Fallback 404 -------------------------------------------------
app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`School website running at http://localhost:${PORT}`);
});