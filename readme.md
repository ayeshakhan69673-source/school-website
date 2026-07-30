# Crestwood Public School — Website

A multi-page school website with a home page, a notice board, and
account registration/login backed by a real MySQL database. Built
with Node.js, Express, and MySQL.

## Tech stack

- **Frontend:** HTML, CSS, JavaScript (plain, no framework)
- **Backend:** Node.js + Express
- **Database:** MySQL (via `mysql2`)
- **Auth:** Sessions (`express-session`) + password hashing (`bcrypt`)

## Pages

| Page              | File                  | Notes                                   |
|-------------------|-----------------------|------------------------------------------|
| Home              | `public/index.html`   | Hero + notice board                      |
| Log in            | `public/login.html`   | Posts to `/api/login`                    |
| Register          | `public/register.html`| Posts to `/api/register`                 |
| Dashboard         | `public/dashboard.html`| **Protected** — redirects to login if no active session |

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create the database
Open MySQL Workbench, phpMyAdmin, or the `mysql` command line and run the script in `sql/schema.sql`:
```bash
mysql -u root -p < sql/schema.sql
```
This creates a `school_website` database with a `users` table.

### 3. Configure environment variables
Copy `.env.example` to `.env` and fill in your real MySQL credentials:
```bash
cp .env.example .env
```
Then edit `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=school_website
SESSION_SECRET=some_long_random_string
PORT=3000
```

### 4. Run the server
```bash
npm start
```
Then open **http://localhost:3000** in your browser.

## Testing the flow

1. Go to **Register**, create an account (student or parent)
2. You'll be redirected to **Log in** — sign in with the same email/password
3. On success, you land on the **Dashboard**, which greets you by name
4. Try opening `/dashboard.html` directly in a new private/incognito window — it should redirect you to the login page, since there's no active session there

## Project structure

```
school-website/
├── server.js              # Express app entry point
├── config/
│   └── db.js               # MySQL connection pool
├── routes/
│   └── auth.js              # /api/register, /api/login, /api/logout, /api/session
├── sql/
│   └── schema.sql           # Database + users table
├── public/
│   ├── index.html            # Home page
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html         # Protected page
│   ├── css/style.css
│   └── js/main.js              # Form handling + session/logout logic
├── .env.example
└── package.json
```

## Notes

- Passwords are never stored in plain text — they're hashed with `bcrypt` before saving.
- Sessions are stored in memory by default, which is fine for local development/demoing, but should be swapped for a persistent store (e.g. `connect-mysql` or Redis) in a real production deployment.
- The school name, crest, and notices are placeholder content — swap them for your actual school's details.