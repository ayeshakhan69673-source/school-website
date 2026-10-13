# 🏫 School Website

A full-stack school website where users can register, log in and reach their own dashboard. The frontend is built with plain HTML, CSS and JavaScript, and the backend uses Node.js, Express and MySQL.

## ✨ Features

- Four pages: **Home, Login, Register and Dashboard**
- Secure login with **bcrypt-protected passwords**
- **Session-based authentication** that keeps users logged in
- Simple API for registering, logging in, logging out and checking the current session
- Responsive design built by hand with **CSS Grid and Flexbox** (no framework)

## 🛠️ Tech Stack

| Area | Tools |
|------|-------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL (mysql2) |
| Security | bcrypt, express-session, dotenv |
| Development | nodemon |

## 🔌 API Routes

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/register` | Create a new account |
| POST | `/api/login` | Log in |
| POST | `/api/logout` | Log out |
| GET | `/api/session` | Check who is logged in |

## 🚀 Run It Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayeshakhan69673-source/school-website.git
   cd school-website
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create a `.env` file** with your own database details and a secret key for sessions.
4. **Start the server**
   ```bash
   npm start
   ```

> Never upload your `.env` file to GitHub.

## 📬 Contact

[LinkedIn](https://www.linkedin.com/in/ayesha-khan-dev/) · [GitHub](https://github.com/ayeshakhan69673-source)
