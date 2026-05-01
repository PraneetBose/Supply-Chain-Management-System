# Contributing to SCM Portal

First off, thank you for considering contributing to the Enterprise Supply Chain Management (SCM) Portal! It's people like you that make open-source software such a great community.

## 🤝 How We Support You

We want to make your contribution experience as smooth and rewarding as possible. Here is our commitment to you:

* **Review Turnaround:** All Pull Requests will receive an initial review within 48 hours to ensure a fast, unblocking feedback loop.
* **Communication Channel:** Core discussions, Q&A, and planning happen directly in GitHub Discussions.
* **Issue Labeling:** Issues are meticulously organized using tags like `good first issue` for beginners, `help wanted` for general bugs, and `architecture` for complex features.
* **Mentorship Plan:** We actively mentor new contributors. Complex issues will include detailed implementation hints. We are also available for code reviews and pairing sessions to help you learn Next.js, React 19, and Supabase RLS.

---

## 🌟 Good First Issues

Looking for a place to start? We have identified 3 self-contained, low-risk issues that are perfect for your first Pull Request!

### 1. Add Loading Skeletons to the Catalog Page (Frontend / UI)
**The Problem:** Currently, when the product catalog is fetching data from the Supabase backend, the screen might look empty or abruptly snap into place once the data arrives. 
**The Fix:** Implement a React Suspense boundary or a simple loading state using Tailwind CSS pulse animations (`animate-pulse`). You will design skeleton cards that display while the data loads to vastly improve the perceived performance.
**Skills needed:** React, Tailwind CSS.

### 2. Implement Toast Notifications for Order Actions (Frontend / UX)
**The Problem:** When a customer places an order or an admin approves/declines one, the UI feedback is currently minimal.
**The Fix:** Integrate a modern toast notification library (like `react-hot-toast` or `sonner`) to display beautiful, slide-in success and error messages after Server Actions complete.
**Skills needed:** Next.js Server Actions, React state management.

### 3. Extract Order Statuses to a Central Constants File (Refactoring)
**The Problem:** There are a few hardcoded magic strings scattered across the application, specifically the order statuses (`pending`, `approved`, `rejected`, `pending_decline`).
**The Fix:** Create a central `src/lib/constants.ts` file. Export these statuses as a TypeScript `enum` or a strongly typed `const` object, and refactor the codebase to use these constants instead of raw strings. This prevents typos and makes the application much more maintainable.
**Skills needed:** TypeScript, Code Refactoring.

---

## 🚀 Getting Started

Ready to code? 

1. **Fork** the repository and clone it locally.
2. Follow the setup instructions in the `README.md` to configure your `.env.local` and start your local Supabase instance.
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes and ensure everything works locally.
5. Push to your fork and **submit a Pull Request** against the `main` branch!
