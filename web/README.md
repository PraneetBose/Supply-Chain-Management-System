# 🌐 Enterprise SCM Portal - Frontend Application

Welcome to the frontend application for the **Enterprise Supply Chain Management (SCM) Portal**. This application is built as a modular SaaS platform using Next.js 16 (App Router) and React 19.

---

## 🛠️ Tech Stack & Key Features

### Frontend Architecture
- **Framework:** Next.js 16 (App Router & Server Actions)
- **Library:** React 19 (Server Components, Suspense, and state hooks)
- **Styling:** Tailwind CSS v4 (Glassmorphic cards, custom layouts, hover animations)
- **State & Integration:** Supabase Client & SSR APIs for real-time authentication and session state synchronization.

### Key Capabilities
- **Modular Purchasing:** Tenants browse the catalog and purchase separate modules (such as Inventory tracking or Fleet logistics) dynamically.
- **Two-Step Rejection Governance:** Rejections of provisioning orders proposed by internal Admins must be verified and authorized by a higher-tier Supreme Admin.
- **Secure isolation:** Fully enforced PostgreSQL Row Level Security (RLS) policies at the database level prevent data leakage between tenant environments.

---

## 📁 App Directory Structure

```text
web/
├── src/
│   ├── app/
│   │   ├── (public)/      # Unauthenticated routes (Landing, Login, Signup)
│   │   ├── (tenant)/      # Customer Portal, active modules list, and Catalog Checkout
│   │   ├── (admin)/       # Regional Admin Dashboard to evaluate pending provisioning
│   │   ├── (supreme)/     # Supreme Admin Dashboard for global prices & role elevations
│   │   ├── components/    # Common UI components & Server Actions
│   │   └── utils/         # Supabase client, server, and middleware session helpers
├── scripts/               # Seeding script to initialize catalog items
└── package.json           # Next.js scripts & dependency definitions
```

---

## 🚀 Setup & Installation

### 1. Environment Variables Configuration
Copy the default environment variables template and initialize your local settings:
```bash
cp .env.example .env.local
```
Inside `.env.local`, specify your Supabase project endpoints and PG credentials:
```ini
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key_here
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
DATABASE_URL_SESSION=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### 2. Seed the Catalog Modules
Populate the local or remote database with mock modules to test the portal features:
```bash
node scripts/seedModules.js
```

### 3. Launch Development Server
Execute the Next.js dev server:
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the portal.
