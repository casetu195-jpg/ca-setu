# CA Dwar — Production README & Deployment Guide

> **"Your Gateway to the Right CA Career."**  
> A specialized career marketplace engineered exclusively for the Indian Chartered Accountancy community. Connecting CA Intermediate, CA Final, and Qualified CAs with verified CA firms and corporate employers.

---

## 1. Quick Start (Run Locally)

The application is completely built with decoupled Frontend (`/client`) and Backend (`/server`) architectures.

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch

#### Step 1: Start the Backend Server
```bash
cd server
npm install
npm start
```
*The server will start listening on `http://localhost:5000`.*

#### Step 2: Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 2. Instant 1-Click Demo Accounts

To test the full user journeys immediately without manual signups, navigate to `http://localhost:5173/login` and use the 1-click test buttons:

| Role | Test User Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **Student** | `aman.sharma@casetu.com` | `demo123` | CA Final profile, 1-click apply, duplicate application checks, and live status tracking (`/student/dashboard`). |
| **Employer** | `hiring@motilaloswal.com` | `demo123` | Post vacancies, pause/close listings, and screen candidates across the recruitment pipeline (`/employer/dashboard`). |
| **Admin** | `admin@casetu.com` | `demo123` | Moderate pending job listings and award the **✓ CA Dwar Verified** badge (`/admin/dashboard`). |

---

## 3. MongoDB Configuration & Seeding

The platform functions seamlessly out of the box with realistic mock data sync. To connect a live MongoDB cluster:

1. Copy `.env.example` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
2. Update `MONGO_URI` with your connection string:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ca-setu?retryWrites=true&w=majority
   JWT_SECRET=your-secure-jwt-secret-key-2026
   PORT=5000
   ```
3. Populate the database with 20+ realistic CA vacancies and 10 verified firms:
   ```bash
   cd server
   npm run seed
   ```

---

## 4. Building for Production

### Build Frontend
```bash
cd client
npm run build
```
*Creates optimized, minified production assets in `/client/dist`.*

### Run Production Server
```bash
cd server
npm start
```

---

## 5. Architecture Summary
- **Frontend:** React, Vite, Tailwind CSS v4, React Router, Lucide React Icons.
- **Backend:** Node.js, Express.js REST API with centralized error handling.
- **Database:** MongoDB & Mongoose with compound unique indexes preventing duplicate applications.
- **Security:** Bcrypt password hashing, JWT authentication, and strict Role-Based Access Control (RBAC).
