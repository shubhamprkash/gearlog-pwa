# 🏍️ GearLog — Vehicle Tracker PWA

**Every km. Every service. Every cost.**

A complete mobile-first Progressive Web App for tracking vehicles (bikes & cars) — fuel logs, service history, trips, reminders, and part status. Built with React, Tailwind CSS, and Supabase.

![GearLog](https://img.shields.io/badge/GearLog-v2.4.1-orange?style=for-the-badge)

---

## 🚀 Features

| Screen | Description |
|--------|-------------|
| **Splash / Onboarding** | Animated splash with gear logo, stats preview |
| **Auth (Login/Signup)** | Email + password, Google sign-in, Demo mode |
| **Dashboard** | Fleet overview, vehicle cards, health rings, quick stats |
| **Vehicle Detail** | 5-tab layout: Overview, Fuel, Trips, Service, Parts |
| **Add Vehicle (6 steps)** | Guided onboarding: info → odometer → oil → service → parts → reminders |
| **Add Fuel Log** | Auto-calculates mileage from previous fill-up |
| **Add Service Log** | Service types, parts changed chips, oil details |
| **Add Trip** | From/to locations, distance auto-calc, purpose tags |
| **Reminders** | Active/Completed/Dismissed tabs, grouped by vehicle |
| **Profile** | Vehicle management (4 max), notification toggles, logout |

## 🎨 Design System

- **Background:** `#0f172a`
- **Cards:** `#1e293b` with `#334155` borders
- **Accent:** `#f97316` (Orange)
- **Status:** Green `#22c55e` / Yellow `#eab308` / Red `#ef4444`
- **Typography:** Inter, bold large numbers, small caps labels

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Auth & DB:** Supabase (Postgres + Auth + RLS)
- **PWA:** vite-plugin-pwa (Service Worker + Web Manifest)
- **Hosting:** Vercel or Netlify

---

## 📦 Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd gearlog-pwa
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `src/lib/supabase.js` (see the commented SQL block)
3. Go to **Authentication → Providers** and enable Email + Google
4. Copy your project URL and anon key

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173`

### 5. Demo Mode

Click **"Try Demo Mode"** on the Login screen to explore the app with pre-populated data — no Supabase required.

---

## 🌐 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Netlify

```bash
npm run build
# Drag & drop the `dist` folder to Netlify
# Or connect your Git repo
```

Set environment variables in Netlify dashboard.

---

## 📱 PWA Installation

1. Open the deployed URL on mobile Chrome/Safari
2. Tap "Add to Home Screen"
3. The app works offline with cached assets

---

## 🗄️ Database Schema

Tables: `profiles`, `vehicles`, `fuel_logs`, `service_logs`, `trips`, `reminders`

All tables have Row Level Security (RLS) policies so users can only access their own data.

See `src/lib/supabase.js` for the complete SQL schema.

---

## 📂 Project Structure

```
gearlog-pwa/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── EmptyState.jsx
│   │   ├── FormInput.jsx
│   │   ├── HealthRing.jsx
│   │   └── Skeleton.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── DataContext.jsx
│   ├── lib/
│   │   ├── demoData.js
│   │   └── supabase.js
│   ├── pages/
│   │   ├── SplashScreen.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── SignupScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── VehicleListScreen.jsx
│   │   ├── VehicleDetailScreen.jsx
│   │   ├── AddVehicleScreen.jsx
│   │   ├── AddScreen.jsx
│   │   ├── AddFuelScreen.jsx
│   │   ├── AddServiceScreen.jsx
│   │   ├── AddTripScreen.jsx
│   │   ├── RemindersScreen.jsx
│   │   └── ProfileScreen.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── index.html
├── netlify.toml
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 📜 License

MIT © 2026 GearSystems Global
