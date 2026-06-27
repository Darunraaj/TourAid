# TourAid – Setup Guide

## Prerequisites
- Node.js v16 or higher
- npm v8 or higher

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/darunraajm/TourAid.git
cd TourAid
```

### 2. Install backend dependencies
```bash
cd backend
npm install express sqlite3 jsonwebtoken bcrypt cors dotenv
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and set:
```
JWT_SECRET=choose_a_strong_random_secret
DATABASE_URL=./tourist_safety.db
PORT=5000
```

### 4. Start the server
```bash
node server.js
```
Server runs at: http://localhost:5000

### 5. Open the app
Open your browser and go to: http://localhost:5000

---

## Project Structure
- `backend/` — Node.js + Express API server
- `frontend/` — HTML/CSS/JS user interface
- `docs/` — API and setup documentation

## Key API Endpoints
- `POST /api/auth/register` — Register tourist
- `POST /api/auth/login` — Login
- `POST /api/alerts` — Send emergency alert
- `GET /api/alerts/active` — View all active alerts
- `GET /api/alerts/stats` — Analytics dashboard

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** SQLite3
- **Auth:** JWT (JSON Web Tokens)
- **Frontend:** HTML5, CSS3, JavaScript
- **Geo-location:** HTML5 Geolocation API + Haversine formula
- 
