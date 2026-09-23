# iCityFix — Municipal Operations & Citizen Reporting Platform

> **"From Civic Reports to Real Action."**  
> A production-quality civic technology platform for Indian cities connecting citizens with municipal operations. Built on the MERN stack with Leaflet geospatial maps, advisory duplicate detection, a 7-step reporting wizard, real database-backed operations dashboards, and role-based workflows.

---

## Key Highlights

- **Native Geospatial Intelligence**: MongoDB `2dsphere` spatial indexing on GeoJSON Point coordinates with spherical distance calculations.
- **Advisory Duplicate Detection**: Non-blocking nearby report detection (`$geoNear`) alerting citizens to existing tickets within 600m without preventing submission.
- **7-Step Guided Reporting Flow**: Category ➔ Details (with AI Keyword Assistance) ➔ Photo Evidence ➔ Interactive Map Pin (GPS locate) ➔ Advisory Duplicate Check ➔ Review ➔ Official Municipal Receipt (`CF-YYYY-XXXX`).
- **Municipal Operations Command**: Real-time aggregated KPIs (No fake statistics), Recharts analytics (Category volume, Status donut, Ward performance), and urgent priority dispatch queues.
- **Role-Based Operational State Machine**: Strict server-side authorization: `REPORTED` ➔ `UNDER_REVIEW` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `RESOLVED` with internal audit logs and automated citizen notifications.
- **Zero-Setup Database Resilience**: Connects to MongoDB Atlas or local MongoDB; automatically boots an embedded in-memory MongoDB instance with initial seed data if an external daemon is not running.

---

## Demo Credentials (Development / Evaluator)

For instant 30-second evaluation, use the one-click demo fill buttons on the login screen or enter:

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@icityfix.local` | `iCityFix@123` | File reports, track status, view local issues, upvote |
| **Citizen 2** | `citizen2@icityfix.local` | `iCityFix@123` | Secondary test citizen account |
| **Municipal Admin** | `admin@icityfix.local` | `iCityFix@123` | Operations dashboard, triage queue, assign officers, status transitions |

---

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: Vanilla Tailwind CSS with custom Civic Design System
- **Maps / GIS**: Leaflet + React-Leaflet + OpenStreetMap
- **Data Visualization**: Recharts (Bar, Donut, and Line charts)
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT Bearer interceptors

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose (Atlas compatible)
- **Geospatial**: GeoJSON Point with `2dsphere` indexes
- **Security**: JWT Authentication, bcryptjs password hashing, server-side role authorization
- **Validation**: express-validator middleware
- **File Uploads**: Multer with MIME and 5MB size enforcement

---

## Repository Structure

```
CivicPulse/
├── package.json              # Root orchestrator scripts
├── .env.example              # Server environment template
├── README.md                 # Complete documentation
├── server/
│   ├── package.json
│   ├── server.js             # Express app, routes, error handlers, static uploads
│   ├── config/
│   │   └── db.js             # Resilient database connector (Atlas/Local + embedded fallback)
│   ├── models/
│   │   ├── User.js           # User schema (CITIZEN, ADMIN)
│   │   ├── Report.js         # Report schema with GeoJSON coordinates & statusHistory
│   │   └── Notification.js   # User alerts for workflow state transitions
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   ├── adminController.js
│   │   ├── notificationController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── aiRoutes.js
│   │   └── uploadRoutes.js
│   ├── services/
│   │   ├── duplicateDetectionService.js
│   │   └── aiService.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── reportValidator.js
│   └── scripts/
│       └── seed.js           # Seed dataset for Bengaluru/Indian civic contexts
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── index.css
        ├── main.jsx
        ├── App.jsx
        ├── api/axiosClient.js
        ├── context/
        │   ├── AuthContext.jsx
        │   └── NotificationContext.jsx
        ├── components/
        │   ├── common/       # Navbar, StatusBadge, PriorityBadge, CategoryBadge, StatCard, etc.
        │   ├── map/          # CivicMapPicker, OperationsMap
        │   ├── wizard/       # 7-Step ReportWizard
        │   └── report/       # StatusTimeline, EvidenceGallery
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── citizen/      # CitizenDashboard, CreateReportPage, MyReportsPage, etc.
            └── admin/        # AdminDashboard, AdminReportsPage, AdminReportDetailPage, etc.
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)

### 2. Environment Configuration
Create a `.env` file in the `server` directory (or use default values):
```bash
cp server/.env.example server/.env
```

Example `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=icityfix_super_secret_jwt_key_2026_production_grade_token
CLIENT_URL=http://localhost:5173

# Optional: Remote MongoDB Atlas URI
# If left blank, an embedded in-memory MongoDB automatically starts with seed data
MONGO_URI=
```

### 3. Installation
Install all dependencies for root, server, and client:
```bash
npm run install:all
```
*(Or navigate to `/server` and `/client` and run `npm install` in each)*

### 4. Database Seeding
To populate realistic demo reports and accounts:
```bash
npm run seed
```

### 5. Running in Development
Start both server and client concurrently from the root directory:
```bash
npm run dev
```

Or start them individually in separate terminals:
- **Backend**:
  ```bash
  npm run server
  # Server running at http://localhost:5000
  ```
- **Frontend**:
  ```bash
  npm run client
  # Client running at http://localhost:5173
  ```

---

## API Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create citizen or admin user
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get authenticated user profile
- `GET /api/auth/demo-credentials` — Retrieve sample accounts for evaluator quick-fill

### Reports (`/api/reports`)
- `POST /api/reports` — File a new civic issue with GeoJSON coordinates
- `GET /api/reports` — Filterable & paginated reports list (search, category, status, priority, ward)
- `GET /api/reports/my` — Reports filed by current authenticated user
- `GET /api/reports/nearby` — Geospatial radius search (`?lng=...&lat=...&radius=...`)
- `GET /api/reports/duplicates` — Advisory duplicate query within 600m
- `GET /api/reports/:id` — Report details and audit history
- `POST /api/reports/:id/upvote` — Citizen democratic urgency upvoting

### Municipal Admin Operations (`/api/admin` - Protected, Role: ADMIN)
- `GET /api/admin/dashboard` — Live aggregated operational metrics & priority queue
- `GET /api/admin/analytics` — MongoDB aggregation pipelines for charts
- `GET /api/admin/officers` — Staff list for assignment dropdown
- `PATCH /api/admin/reports/:id/status` — State machine transition with audit notes
- `PATCH /api/admin/reports/:id/assign` — Assign department and field officer

### Notifications (`/api/notifications` - Protected)
- `GET /api/notifications` — Citizen/Admin alerts
- `PATCH /api/notifications/:id/read` — Mark single notification read
- `PATCH /api/notifications/read-all` — Mark all read

### Evidence Uploads (`/api/uploads` - Protected)
- `POST /api/uploads` — Upload photos (max 4 files, 5MB each, JPG/PNG/WEBP)

---

## Production Build Verification

To verify production compilation:
```bash
npm run build
```
This bundles the React frontend via Vite into `client/dist`.
