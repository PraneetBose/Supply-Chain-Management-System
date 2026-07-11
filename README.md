# 📦 Enterprise Supply Chain Management (SCM) Portal

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Open Source](https://img.shields.io/badge/Open_Source-Yes-brightgreen?style=for-the-badge)

</div>

---

## 📖 Introduction

Welcome to the **Enterprise Supply Chain Management (SCM) Portal**, a robust, secure, and modern platform engineered to handle complex B2B supply chain catalogs and secure order processing.

Built on the cutting edge of web technology using **Next.js 16 (App Router)** and **React 19**, this portal offers an exceptionally fast, dynamic, and responsive user experience. The backend is completely managed by **Supabase**, providing real-time database capabilities, robust PostgreSQL relations, and strict authentication mechanisms.

Whether you are a customer browsing the product catalog, an admin managing approvals, or a supreme administrator overseeing the entire ecosystem, this platform is tailored to ensure secure, role-based workflows at every level.

---

## ✨ Comprehensive Feature Set

### 🏢 Multi-Tenant & Role-Based Workflows
The platform is built on a strictly enforced Role-Based Access Control (RBAC) model, ensuring that users only have access to their designated areas and data:
- **Customer Portal:** Browse the product/service catalog, place orders, and track the status of existing requests.
- **Admin Dashboard:** Review incoming customer orders, approve module access, or decline orders (with specific `decline_reason` tracking).
- **Supreme Admin Dashboard:** Full oversight of the application. Manage global module settings, oversee admin activities, and act as the final decision-maker for escalated workflows.

### 🛍️ Dynamic Product & Module Catalog
A highly responsive and interactive catalog system that allows customers to seamlessly browse available products and services. The system intuitively prevents duplicate orders for active subscriptions.

### 📦 Order Management Lifecycle
Orders go through a rigorous, transparent lifecycle:
1. **Pending:** Order is placed by the customer.
2. **Approved:** An admin grants access, updating the `customer_modules` table to provision the requested resource.
3. **Pending Decline (Two-Step Decline):** An admin proposes a rejection. A higher-tier admin must review the reasoning.
4. **Rejected:** The order is officially declined, and the reason is recorded for transparency.

### 🔒 Enterprise-Grade Security
Security is baked into the foundation. Supabase **Row Level Security (RLS)** ensures that every single database query is authenticated and authorized at the row level. Customers can never read other customers' orders, and only authorized admins can mutate order states.

---

## 🛠️ Technical Architecture & Stack

### Frontend Architecture
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19 (Server Components & Server Actions)
- **Styling:** Tailwind CSS v4 (Utility-first, highly responsive)
- **Language:** TypeScript for end-to-end type safety.

### Backend Architecture
- **Database:** PostgreSQL (Hosted via Supabase)
- **Authentication:** Supabase Auth (JWT based session management)
- **Data Access:** Supabase SSR clients (Next.js middleware integration for protected routes)

---

## 📂 Project Directory Structure

```text
SCM/
├── web/                      # Main Next.js Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/     # Unauthenticated routes (Login, Register)
│   │   │   ├── (tenant)/     # Customer/Tenant facing routes (Catalog, User Dashboard)
│   │   │   ├── (supreme)/    # Supreme Admin Dashboard
│   │   │   └── components/   # Reusable UI components & Server Actions
│   │   ├── utils/
│   │   │   └── supabase/     # SSR, Client, and Middleware Auth logic
│   ├── scripts/              # Helper scripts (e.g., Database Seeders)
│   ├── .env.example          # Template for environment variables
│   └── package.json          # Dependencies & Scripts
├── supabase/                 # Supabase configuration
│   └── migrations/           # SQL Database Migrations (Schema, RLS, Triggers)
├── supreme-admin/            # Reserved for future micro-services or build targets
└── README.md                 # Project Documentation
```

---

## 🗄️ Database Architecture Deep-Dive

Our PostgreSQL schema is highly structured and normalized:

1. **`user_roles`**: Links directly to the `auth.users` table. Defines whether a user is a `Customer`, `Admin`, or `Supreme Admin`.
2. **`catalog` / `modules`**: The inventory tables.
3. **`orders`**: 
   - Fields include: `id`, `cust_id`, `module_id`, `status`, `decline_reason`, `created_at`.
   - Constraints ensure status must be one of: `pending`, `approved`, `rejected`, `pending_decline`.
4. **`customer_modules`**: Acts as a join table to map which customers have active access to which modules.
5. **PostgreSQL Triggers**: We utilize triggers to automatically keep timestamps updated and prevent invalid state transitions.

---

## 🚀 Getting Started Guide

Follow these instructions to get the application running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started): `npm install -g supabase`

### 1. Clone & Install
```bash
git clone https://github.com/your-username/scm-portal.git
cd scm-portal/web
npm install
```

### 2. Database Initialization
You can run the entire backend locally using Docker and the Supabase CLI.
```bash
# Navigate to the project root
cd ..

# Initialize and start local Supabase instance
supabase start

# Apply all schema migrations
supabase db push
```

### 3. Environment Variables
Secure your application by copying the provided example variables file.
```bash
cd web
cp .env.example .env.local
```
Fill out `.env.local` using the credentials provided by `supabase status` (if running locally) or your remote Supabase dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DATABASE_URL_SESSION`

### 4. Seeding the Database
Populate your database with mock modules to test the catalog feature:
```bash
cd web
node scripts/seedModules.js
```

### 5. Launch the Application
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the application!

---

## 🤝 Contribution Guidelines

We highly encourage open-source contributions. To maintain code quality and security, please follow these steps:

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally.
3. **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`
4. **Make your changes**. Ensure all code is clean, documented, and properly typed with TypeScript.
5. **Commit your changes**: `git commit -m 'Add some feature'`
6. **Push to the branch**: `git push origin feature/your-feature-name`
7. **Submit a Pull Request** against the `main` branch.

**Security Note:** Never commit `.env` files or hardcode credentials into your scripts. Always use `process.env`.

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## ✨ README Improvement Notes

### 📌 Formatting Enhancements Needed
- Improve heading hierarchy for better readability
- Ensure consistent spacing between sections
- Use proper Markdown formatting for code blocks and lists
- Align all installation and usage steps properly

### 🚀 Suggested Structure Upgrade
- Introduction
- Features
- Tech Stack
- Installation
- Usage
- Project Structure
- Contribution Guidelines
- License

### 🛠️ Documentation Improvements
- Add badges (optional): build, license, contributors
- Add screenshots for better UI understanding
- Standardize code blocks for commands

### 🎯 Goal
Improve onboarding experience for new contributors and users by making README more structured, readable, and professional.

