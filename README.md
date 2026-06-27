# TourAid# 🛡️ TourAid – Tourist Safety Monitoring System

A full-stack AI-assisted safety monitoring application designed to protect tourists through real-time geo-location tracking, emergency alert management, and intelligent incident response coordination.

---

## 🚀 Features

- **Real-time Geo-location Tracking** – Continuously tracks tourist location with accuracy data and stores full location history
- **Emergency Alert System** – Multi-type alerts (panic, medical, crime, lost) with priority levels (low → critical)
- **JWT Authentication** – Secure token-based auth for tourists and police officers
- **Geo-fencing** – Define safe zones, restricted zones, and tourist areas with coordinate-based boundaries
- **QR Code System** – Dynamic QR codes for tourist identification and location tagging
- **Police Dashboard** – Officers can view, resolve, and escalate active alerts in real time
- **Haversine-based Proximity Search** – Find all active alerts within a configurable radius (km)
- **Alert Analytics** – Trend data, type distribution, priority stats, and average response time metrics
- **Location History** – Full audit trail of tourist movements over time

---

## 🏗️ Project Structure

```
TourAid/
├── backend/
│   ├── db.js                    # SQLite database connection & table creation
│   ├── middleware/
│   │   └── auth.js              # JWT token verification middleware
│   ├── models/
│   │   ├── Tourist.js           # Tourist CRUD, location tracking, QR codes
│   │   └── Alert.js             # Alert lifecycle, stats, geo-proximity search
│   ├── routes/
│   │   ├── auth.js              # Login / register endpoints
│   │   ├── tourists.js          # Tourist management API
│   │   ├── alerts.js            # Alert creation & resolution API
│   │   └── police.js            # Police officer dashboard API
│   ├── services/
│   │   └── locationService.js   # Geo-location processing logic
│   ├── .env.example             # Environment variable template
│   └── server.js                # Express app entry point
├── frontend/
│   ├── index.html               # App entry point
│   ├── css/
│   │   └── styles.css           # Application styles
│   └── js/
│       ├── app.js               # Main frontend logic
│       ├── map.js               # Map & geo-location handling
│       └── alerts.js            # Alert UI components
├── docs/
│   ├── API.md                   # API endpoint documentation
│   └── SETUP.md                 # Detailed setup guide
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | SQLite3 (via `sqlite3` npm package) |
| Authentication | JWT (JSON Web Tokens) |
| Geo-location | HTML5 Geolocation API + Haversine formula |
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| Security | bcrypt password hashing, JWT middleware |

---

## 🗄️ Database Schema

The system uses 6 relational tables:

- **tourists** – Profile, credentials, real-time location, status
- **alerts** – Emergency events with type, priority, coordinates, resolution
- **police_officers** – Officer profiles, badge numbers, duty status
- **geo_fences** – Coordinate-based safe/restricted zone definitions
- **qr_codes** – Dynamic QR codes linked to tourist accounts
- **location_history** – Full timestamped movement log per tourist

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+
- npm v8+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/darunraajm/TourAid.git
cd TourAid

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your JWT_SECRET and other config

# 4. Start the server
node server.js
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` folder:

```env
JWT_SECRET=your_secure_secret_key_here
DATABASE_URL=./tourist_safety.db
ML_SERVICE_URL=http://localhost:8000
PORT=5000
```

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Tourist registration |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/tourists/:id` | Get tourist profile |
| PUT | `/api/tourists/:id/location` | Update real-time location |
| POST | `/api/alerts` | Create emergency alert |
| GET | `/api/alerts/active` | Get all active alerts |
| PUT | `/api/alerts/:id/resolve` | Resolve an alert |
| GET | `/api/alerts/stats` | Alert analytics & trends |
| GET | `/api/alerts/nearby` | Find alerts within radius (km) |

---

## 🧠 Key Technical Highlights

- **Concurrency-safe DB operations** – Promise-based SQLite wrapper handles async queries without race conditions
- **Haversine formula** – Calculates real-world distance (km) between GPS coordinates for proximity-based alert dispatch
- **Priority escalation engine** – Alerts can be escalated through low → medium → high → critical programmatically
- **Geo-fence validation** – Coordinate boundary checks against defined safe/restricted zones
- **Audit trail** – Every tourist location update is logged to `location_history` for forensic review

---

## 👨‍💻 Developer

**Darunraaj M**  
B.Sc. Computer Science, Dr. N.G.P Arts and Science College  
📧 darunraaj16@gmail.com  
🔗 [LinkedIn](https://linkedin.com/in/darunraajm)

---

## 📄 License

This project is for educational and portfolio purposes.
