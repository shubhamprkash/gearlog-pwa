# 🏍️ GearLog — Vehicle Tracker PWA

**Every km. Every service. Every cost.**

A complete mobile-first Progressive Web App for tracking vehicles (bikes & cars) — fuel logs, service history, trips, reminders, and part status. Built with React 18, Vite, Tailwind CSS, and Supabase.

![GearLog](https://img.shields.io/badge/GearLog-v1.0.0-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-blue?style=flat)
![Vite](https://img.shields.io/badge/Vite-5.3-blueviolet?style=flat)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=flat)

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| **🔐 Authentication** | Email + password, Google OAuth, Demo mode (no login required) |
| **🚗 Multi-Vehicle Support** | Track bikes, cars, and scooters — unlimited vehicles per user |
| **⏱️ Dashboard** | Fleet overview with health rings, fuel costs, service alerts at a glance |
| **⛽ Fuel Tracking** | Log fill-ups with auto-calculated mileage (km/L), cost per liter, trends |
| **🔧 Service Logs** | Detailed service records with parts tracking, oil grades, workshop info |
| **📍 Trip Tracking** | Record journeys with distance auto-calculation and purpose tagging |
| **⏰ Smart Reminders** | Overdue/upcoming maintenance alerts for oil, service, insurance, PUC, etc. |
| **📊 Analytics** | Fuel efficiency charts, cost-per-km calculations, monthly spending trends |
| **📱 PWA Support** | Install as app on mobile, works offline, push notifications ready |
| **🎨 Dark Mode** | Beautiful dark theme optimized for mobile use |
| **⚡ Fast & Lightweight** | Built with Vite (super-fast builds), <100KB initial load |

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
├── public/                   # Static PWA assets
│   ├── favicon.svg
│   ├── icon-192.png        # PWA icon (home screen)
│   └── icon-512.png        # PWA splash screen
│
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── BottomNav.jsx     # Mobile tab navigation (5 icons + FAB)
│   │   ├── UI.jsx            # Shared: Card, HealthRing, ScrollPage, Empty, Skeleton
│   │   └── VehiclePicker.jsx # Vehicle selector dropdown
│   │
│   ├── lib/                # Core logic & utilities
│   │   ├── store.jsx         # Global state (Context API) — CRITICAL
│   │   ├── supabase.js       # Supabase client initialization
│   │   ├── smartCalc.js      # Calculations (mileage, health, reminders)
│   │   └── demoData.js       # Demo mode test data (no login needed)
│   │
│   ├── pages/              # Page-level components (one per route)
│   │   ├── Splash.jsx        # Onboarding / loader screen
│   │   ├── Login.jsx         # Email login + Google OAuth
│   │   ├── Signup.jsx        # Registration with password strength
│   │   ├── Dashboard.jsx     # Main dashboard (fleet overview)
│   │   ├── FuelPage.jsx      # Fuel history + analytics
│   │   ├── ServicePage.jsx   # Service history + reminders
│   │   ├── AddQuick.jsx      # Quick action menu (what to add?)
│   │   ├── AddVehicle.jsx    # 6-step vehicle setup wizard
│   │   ├── AddFuel.jsx       # Log fuel fill-up
│   │   ├── AddService.jsx    # Log service with parts
│   │   ├── AddTrip.jsx       # Record a trip
│   │   └── Profile.jsx       # Settings & vehicle management
│   │
│   ├── App.jsx             # Router & main layout
│   ├── index.css           # Global Tailwind + custom styles
│   └── main.jsx            # React entry point
│
├── index.html              # HTML template (Vite injects React here)
├── vite.config.js          # Vite + PWA config
├── tailwind.config.js      # Tailwind theme & colors
├── postcss.config.js       # PostCSS plugins
├── package.json            # Dependencies
├── vercel.json             # Vercel deployment config
├── netlify.toml            # Netlify deployment config
├── .env.example            # Example environment variables
├── README.md               # This file
├── � Key Technologies

| Layer | Tech | Purpose |
|-------|------|---------|
| **Frontend** | React 18 + Vite | Lightning-fast UI framework & build tool |
| **Styling** | Tailwind CSS | Utility-first, responsive dark theme |
| **Icons** | Lucide React | 370+ beautiful SVG icons |
| **Charts** | Recharts | Interactive fuel & mileage trends |
| **Database** | Supabase (PostgreSQL) | Secure backend + auth + Row-Level Security |
| **PWA** | vite-plugin-pwa | Service Worker + offline support |
| **Dates** | date-fns | Lightweight date manipulation |
| **Animations** | Framer Motion | Smooth transitions & page animations |

---

## 📱 Getting Started (Quick)

### Try Demo Mode First
No signup needed! Open the app and click **"Try Demo Mode"** to explore with pre-loaded vehicles and data.

### Quick Dev Setup
```bash
# 1. Clone & install
git clone <your-repo>
cd gearlog-pwa
npm install

# 2. Create .env (copy from .env.example)
# Add your Supabase keys

# 3. Run dev server
npm run dev

# Open http://localhost:5173
```

**For detailed setup → See [SETUP_GUIDE.md](SETUP_GUIDE.md)**

---

## 🔍 How It Works

### 1. **First Time Users**
- Click **Login** or **Signup** with email, or use **Demo Mode**
- After login, add your first vehicle (6-step wizard)

### 2. **Daily Usage**
- **Dashboard** shows fleet health at a glance
- **Bottom nav** provides quick access: Dashboard, Fuel, Service, Add, Profile
- **FAB button** (+) opens quick add menu for fuel/service/trip

### 3. **Data Entry**
- **Add Fuel**: Auto-calculates km/L from previous fill-up
- **Add Service**: Track oil, parts, cost, workshop
- **Add Trip**: Log journeys with purpose (work, leisure, travel)

### 4. **Insights**
- **Fuel Page**: Charts, cost trends, efficiency tracking
- **Service Page**: Maintenance history + smart reminders
- **Reminders**: Auto-generated based on service schedules

---

## 🛠️ Development

### Build
```bash
npm run build    # Creates optimized dist/ folder
npm run preview  # Test production build locally
```

### Project Commands
- `npm run dev` — Start Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build

### Folder Organization
- **Pages** (`src/pages/`) — One file per screen
- **Components** (`src/components/`) — Reusable UI building blocks
- **Business Logic** (`src/lib/`) — State management, calculations, API calls
- **Styles** (`src/index.css`) — Global Tailwind + custom CSS

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel dashboard
3. Set environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Auto-deploys on each push to main

**→ See [SETUP_GUIDE.md — PART 2](SETUP_GUIDE.md) for step-by-step**

### Netlify (Alternative)
```bash
npm run build
# Drag & drop dist/ folder to Netlify
# Or connect Git repo
```

---

## 📖 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** — Complete installation (Supabase + Vercel/Netlify)
- **[PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)** — Deep dive for developers & AI (architecture, algorithms, database schema)
- **Code Comments** — Each page has JSDoc explaining its purpose

---

## 🐛 Common Issues & Solutions

### "VITE_SUPABASE_URL is undefined"
→ Check `.env` file exists with correct keys (see `.env.example`)

### "Google OAuth not working"
→ Add callback URL in Google Cloud Console & Supabase OAuth settings (see SETUP_GUIDE Step 6)

### "Data not saving"
→ Check Supabase RLS policies are enabled (see SETUP_GUIDE Step 4)

### "PWA not installing"
→ Ensure HTTPS deployment (Vercel/Netlify handles this) and manifest.json is served

---

## 📞 Support & Contributing

**Found a bug?** Check [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) for architecture details before reporting.

**Want to contribute?** 
- Follow the folder structure
- Add components to `src/components/`
- Add pages to `src/pages/`
- Update `src/lib/store.jsx` for new state

---

## �SETUP_GUIDE.md          # Installation & deployment guide
└── PROJECT_CONTEXT.md      # Developer reference (AI-friendly)
```

---

## 📜 License

MIT © 2026 GearSystems Global
