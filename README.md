# AeroKeep 🚀
### Inventory Management System
> Built for BeRAM Drones — A defense-tech startup developing AI-powered UAVs

![AeroKeep Dashboard](https://img.shields.io/badge/AeroKeep-Deep%20Orbit-06b6d4?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node%20%2B%20PostgreSQL-3b82f6?style=for-the-badge)

---

## 🌐 Live Demo
> **Frontend:** [your-vercel-url-here]
> **Backend API:** [your-render-url-here]

---

## ✨ Features
- 🔐 JWT Authentication (Register / Login / Protected Routes)
- 📊 Mission Control Dashboard (Live stats, Low stock alerts, Recent activity)
- 📦 Full Product CRUD (Name, SKU, Category, Price, Qty, Threshold, Serial No, Manufacturer)
- 🔄 Stock In / Stock Out with reason notes and audit trail
- ⚠️ Low Stock Alerts with visual badges
- 🗂️ Category Management
- 🔍 Search & Filter (by name, SKU, category, stock status)
- 📋 Stock Movement History Log
- 📥 CSV Export
- 📱 Responsive UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 5 |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- A Supabase account (free)

### 1. Clone the repo
```bash
git clone https://github.com/Nidhi2-4/AeroKeep.git
cd AeroKeep
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=8000
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your_secret_here"
NODE_ENV=development
```

```bash
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup
```bash
cd ..
npm install
```

Create `.env` in root:
```env
VITE_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

### 4. Open the app
