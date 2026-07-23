<div align="center">

# 🎨 ArtHub

### *Discover, Collect & Empower Creativity.*
### *Where Artists Meet Collectors.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://arthub-by-abid.vercel.app)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](https://github.com/Abid-Hossain-Sifat/ArtHub/pulls)

<br/>

[🌐 Live Demo](https://arthub-by-abid.vercel.app) &nbsp;|&nbsp;
[📁 Frontend Repo](https://github.com/Abid-Hossain-Sifat/ArtHub) &nbsp;|&nbsp;
[🔧 Backend Repo](https://github.com/Abid-Hossain-Sifat/ArtHub-Server)

</div>

---

## 🌟 Project Overview

**ArtHub** is a full-stack MERN-based digital art marketplace that bridges the gap between independent artists and art enthusiasts worldwide. It provides artists with a professional platform to showcase and sell their creative works, while giving collectors a curated, seamless experience to discover and purchase original artworks.

Built with **Next.js 19**, **Express 5**, **MongoDB Atlas**, and **BetterAuth**, ArtHub features a robust role-based system (Admin, Artist, Buyer), tiered subscription plans, Stripe-powered payments, animated UI, and comprehensive dashboards — making it a production-ready, enterprise-grade application.

---

## 💡 Why ArtHub?

### The Problem
The traditional art market is inaccessible, opaque, and gatekept by galleries and intermediaries. Independent artists struggle to reach global buyers, and collectors have no reliable, curated digital space to discover and purchase authentic art.

### The Solution
ArtHub democratizes art commerce by:

- Giving **artists** a self-managed storefront to list, price, and sell their work directly
- Giving **buyers** a subscription-gated purchasing system that ensures quality engagement
- Giving **admins** full platform control with real-time analytics and transaction management
- Eliminating intermediaries through **direct Stripe payments** from buyer to platform

### Why It Was Built
ArtHub was developed as a demonstration of production-level full-stack engineering — showcasing real-world patterns like JWT-based auth, webhook-driven payment processing, role-based access control, subscription management, and Recharts-powered analytics dashboards.

---

## 🔑 Key Features

### 🔐 Authentication & Authorization
- Email/password sign-up and login powered by **BetterAuth**
- **Google OAuth 2.0** social login via BetterAuth social providers
- **JWT tokens** with 7-day expiry and cookie-cached sessions
- Protected client-side routes with session guards
- Role-based access control enforced on both frontend and backend

### 🎨 Artwork Management
- Artists can **add artworks** with title, category, description, price, and image upload
- Custom or predefined **artwork categories**
- Artists can **edit** and **delete** their own listings
- Each artwork tracks status: `available` or `sold`
- Artwork detail pages with full info and buyer comments

### 💳 Stripe Payment Integration
- **Stripe Checkout Sessions** for one-time artwork purchases
- **Stripe Checkout Sessions** for subscription plan upgrades
- **Stripe Webhook** (`checkout.session.completed`) for reliable post-payment processing
- Auto-generated transaction IDs in format `AH-P-XXXXXX` (purchase) and `AH-S-XXXXXX` (subscription)
- Payment success and cancellation pages with session verification

### 📦 Subscription System
| Plan    | Monthly Purchase Limit | Price   |
|---------|------------------------|---------|
| Free    | 3 artworks/month       | $0      |
| Pro     | 9 artworks/month       | $9.99   |
| Premium | Unlimited              | $19.99  |

- Monthly purchase counters **auto-reset** at the start of each month
- Subscription history tracked per user with plan transitions logged

### 💬 Comments System
- Buyers (role: `user`) can leave comments on artwork detail pages
- Comments are **role-restricted** — artists and admins cannot comment
- Comment data includes user name, avatar, and timestamp
- Comments displayed in reverse-chronological order

### 🔍 Search, Filter & Sort
- **Search** artworks by title or artist name (regex-based, case-insensitive)
- **Filter** by category and availability status
- **Sort** by: A-Z, Z-A, Price Low to High, Price High to Low, Newest First
- All filters work together via a combined query pipeline on the backend

### 📄 Pagination
- Server-side pagination with configurable page size (default: 12 per page)
- Returns `totalCount`, `totalPages`, and `currentPage` for frontend pagination controls

### 📊 Analytics Dashboard
- Admin **daily revenue chart** (artwork purchases + subscriptions) using **Recharts**
- Artist **sales statistics** (total artworks, sold artworks)
- Admin **all-transactions table** combining purchase and subscription history

### 🎞️ Animations
- **Framer Motion** animations throughout — page transitions, card entrances, staggered lists, dropdown menus
- Animated hero banner with auto-sliding slides
- Spring-physics-based card animations on artwork grids

### 💀 Skeleton Loading
- Custom skeleton components for all major sections: artwork cards, forms, subscription plans, profile pages
- Smooth loading state prevents layout shift

### 🚨 Error Handling
- Custom `not-found.jsx` (404) page
- `unauthorized` page for role-mismatch redirects
- Toast notifications (`react-hot-toast` & `react-toastify`) for all user actions
- Server-side validation with descriptive error messages

### 🖼️ Image Upload
- Artwork images and profile pictures uploaded via **ImgBB API**
- Image preview before upload
- Fallback avatar system for users without profile pictures

### 👤 Profile Management
- Users can update their **name, email, and avatar**
- Profile updates **cascade** across all related collections: artworks, purchases, comments, and subscription history

---

## 👥 User Roles

### 🛍️ Buyer (role: `user`)
The default role assigned to every new signup. Buyers can:
- Browse and search artworks
- Purchase artworks (within their monthly subscription limit)
- Leave comments on artwork pages
- Upgrade their subscription plan via Stripe
- View their purchase history and bought artworks in their dashboard
- Manage their profile

### 🎨 Artist (role: `artist`)
Promoted from Buyer by an Admin. Artists can:
- Add new artworks with images, descriptions, categories, and pricing
- Edit and delete their own artwork listings
- View their sales history (who bought what)
- See their artist stats (total listings, total sold)
- Manage their profile
- **Cannot** purchase artworks or leave comments

### 🛡️ Admin (role: `admin`)
The platform administrator. Admins can:
- View and manage all users (change roles)
- View and manage all artworks across the platform
- Access all transaction data (purchases + subscriptions)
- View daily revenue analytics via charts
- Manage their profile

---

## 🛠️ Technology Stack

| Category         | Technology                              |
|------------------|-----------------------------------------|
| **Frontend**     | Next.js 16.2.9 (App Router), React 19  |
| **Backend**      | Node.js, Express 5.x                   |
| **Database**     | MongoDB Atlas (Native Driver)           |
| **Authentication** | BetterAuth v1.6.19 (JWT + Google OAuth) |
| **Payment**      | Stripe (Checkout Sessions + Webhooks)   |
| **Image Hosting** | ImgBB API                              |
| **Animations**   | Framer Motion 12.x                      |
| **Charts**       | Recharts 3.x                            |
| **UI Framework** | Tailwind CSS 4.x + DaisyUI 5.x         |
| **Icons**        | Lucide React, React Icons               |
| **Notifications** | React Hot Toast, React Toastify        |
| **Deployment**   | Vercel (Frontend + Backend)             |
| **State Management** | React Hooks (useState, useEffect)  |

---

## 📦 NPM Packages Used

### Frontend (`arthub`)

| Category         | Package                          | Purpose                              |
|------------------|----------------------------------|--------------------------------------|
| **Framework**    | `next@16.2.9`                    | App Router, SSR, routing             |
| **UI/Styling**   | `tailwindcss@4`, `daisyui@5`     | Utility CSS + component library      |
| **Animation**    | `framer-motion@12`               | Page & component animations          |
| **Charts**       | `recharts@3`                     | Admin revenue analytics charts       |
| **Auth**         | `better-auth@1.6.19`             | Auth client, session, JWT            |
| **Payment**      | `@stripe/react-stripe-js`, `@stripe/stripe-js` | Stripe frontend integration |
| **Icons**        | `lucide-react@1.21`, `react-icons@5`, `@gravity-ui/icons@2` | Icon libraries |
| **Notifications**| `react-hot-toast@2`, `react-toastify@11` | Toast notifications          |
| **Linting**      | `eslint@9`, `eslint-config-next` | Code quality                         |

### Backend (`server`)

| Category         | Package                          | Purpose                              |
|------------------|----------------------------------|--------------------------------------|
| **Server**       | `express@5`                      | HTTP server & routing                |
| **Database**     | `mongodb@7`                      | Native MongoDB driver                |
| **Auth**         | `better-auth@1.6.19`, `@better-auth/mongo-adapter` | Auth server & DB adapter |
| **Auth (Legacy)**| `passport@0.7`, `passport-google-oauth20` | Google OAuth support      |
| **Payment**      | `stripe@22`                      | Stripe Checkout & Webhooks           |
| **Middleware**   | `cors@2`, `express-session@1`    | CORS, session handling               |
| **Config**       | `dotenv@17`                      | Environment variable management      |


---

## 📁 Folder Structure

### Frontend
```
arthub/
├── public/
│   ├── Assets/
│   │   ├── Hero1.png
│   │   ├── Hero2.png
│   │   ├── Hero3.png
│   │   ├── Logo.png
│   │   ├── Login.png
│   │   ├── Signup.png
│   │   ├── UserDash.png
│   │   ├── ToolTip1.png
│   │   └── ToolTip2.png
├── src/
│   ├── app/
│   │   ├── page.js                        # Home page
│   │   ├── layout.js                      # Root layout
│   │   ├── globals.css                    # Global styles
│   │   ├── not-found.jsx                  # Custom 404 page
│   │   ├── sign-in/                       # Sign in page
│   │   ├── sign-up/                       # Sign up page
│   │   ├── unauthorized/                  # Unauthorized access page
│   │   ├── artworks/                      # Browse artworks page
│   │   ├── payment-success/               # Stripe payment success
│   │   ├── payment-cancel/                # Stripe payment cancel
│   │   └── dashboard/
│   │       ├── page.jsx                   # Dashboard router
│   │       ├── user/
│   │       │   ├── page.jsx               # Buyer overview
│   │       │   ├── layout.jsx             # Buyer layout
│   │       │   ├── profile/               # Profile management
│   │       │   ├── subscription/          # Subscription plans
│   │       │   ├── purchase-history/      # Purchase history
│   │       │   ├── bought-artworks/       # Purchased artworks
│   │       │   └── my-comments/           # User's comments
│   │       ├── artist/
│   │       │   ├── page.jsx               # Artist overview
│   │       │   ├── layout.jsx             # Artist layout
│   │       │   ├── profile/               # Profile management
│   │       │   ├── add-artwork/           # Add new artwork
│   │       │   ├── manage-artwork/        # Edit/delete artworks
│   │       │   └── sales-history/         # Sales records
│   │       └── admin/
│   │           ├── page.jsx               # Admin overview
│   │           ├── layout.jsx             # Admin layout
│   │           ├── profile/               # Profile management
│   │           ├── manage-user/           # User role management
│   │           ├── manage-artworks/       # Platform-wide artwork control
│   │           └── all-transactions/      # Combined transaction history
│   ├── Components/
│   │   ├── Navbar.jsx                     # Navigation bar
│   │   ├── Footer.jsx                     # Footer
│   │   ├── Banner.jsx                     # Animated hero banner
│   │   ├── TopArt.jsx                     # Featured artworks section
│   │   ├── TopArtist.jsx                  # Featured artists section
│   │   ├── Category.jsx                   # Category browser
│   │   ├── WhyArtHub.jsx                  # Why ArtHub section
│   │   ├── JoinArtHub.jsx                 # CTA join section
│   │   └── Skeleton.jsx                   # Skeleton loading components
│   └── lib/
│       ├── auth-client.js                 # BetterAuth client config
│       ├── data.js                        # API utility functions
│       └── avatar.js                      # Avatar helper
├── next.config.mjs
├── tailwind.config.mjs (via postcss)
├── jsconfig.json
└── package.json
```

### Backend
```
server/
├── index.js          # Express app, all API routes
├── auth.js           # BetterAuth server config (JWT, Google OAuth, MongoDB)
├── package.json
├── vercel.json       # Vercel serverless config
├── .env              # Environment variables
└── .gitignore
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account
- Google Cloud Console project (for OAuth)
- ImgBB account

### 1. Clone the Repositories

```bash
# Frontend
git clone https://github.com/Abid-Hossain-Sifat/ArtHub.git
cd ArtHub

# Backend (separate terminal)
git clone https://github.com/Abid-Hossain-Sifat/ArtHub-Server.git
cd ArtHub-Server
```

### 2. Install Dependencies

```bash
# Frontend
cd ArtHub
npm install

# Backend
cd ArtHub-Server
npm install
```

### 3. Configure Environment Variables

Create `.env` files in both projects (see [Environment Variables](#-environment-variables) section below).

### 4. Run the Backend

```bash
cd ArtHub-Server
npm start
# Server runs on http://localhost:5000
```

### 5. Run the Frontend

```bash
cd ArtHub
npm run dev
# Frontend runs on http://localhost:3000
```

### 6. Set Up Stripe Webhook (Local Development)

```bash
stripe listen --forward-to localhost:5000/webhook
```

---

## 🔒 Environment Variables

### Client (Frontend) — `.env`

| Variable                         | Description                              |
|----------------------------------|------------------------------------------|
| `NEXT_PUBLIC_BACKEND_URL`        | Backend base URL (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_API_URL`            | Artworks API endpoint                    |
| `NEXT_PUBLIC_FILTER_API_URL`     | Artwork filters endpoint                 |
| `NEXT_PUBLIC_USER_API_URL`       | Users API endpoint                       |
| `NEXT_PUBLIC_IMGBB_API_KEY`      | ImgBB API key for image uploads          |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key               |

### Server (Backend) — `.env`

| Variable                   | Description                                     |
|----------------------------|-------------------------------------------------|
| `PORT`                     | Express server port (e.g. `5000`)               |
| `MONGODB_URI`              | MongoDB Atlas connection string                 |
| `CLIENT_URL`               | Frontend URL (e.g. `http://localhost:3000`)     |
| `BETTER_AUTH_URL`          | Backend auth base URL                           |
| `BETTER_AUTH_SECRET`       | BetterAuth secret key                           |
| `CLIENT_ID`                | Google OAuth Client ID                          |
| `CLIENT_SECRET`            | Google OAuth Client Secret                      |
| `STRIPE_SECRET_KEY`        | Stripe secret key                               |
| `STRIPE_WEBHOOK_SECRET`    | Stripe webhook signing secret                   |
| `NODE_ENV`                 | `production` or `development`                   |

> ⚠️ **Never commit `.env` files to version control.**

---

## 📡 API Overview

### Authentication (BetterAuth)

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| POST   | `/api/auth/sign-up`    | Register with email & password     |
| POST   | `/api/auth/sign-in`    | Login with email & password        |
| POST   | `/api/auth/sign-out`   | Sign out current session           |
| GET    | `/api/auth/session`    | Get current session & user data    |
| GET    | `/api/auth/google`     | Initiate Google OAuth login        |
| GET    | `/api/auth/callback/google` | Google OAuth callback         |

### Artworks

| Method | Endpoint                          | Description                                   |
|--------|-----------------------------------|-----------------------------------------------|
| GET    | `/artworks`                       | Get all artworks (search, filter, sort, paginate) |
| GET    | `/artworks/filters`               | Get available categories and statuses         |
| POST   | `/artworks`                       | Create a new artwork listing                  |
| PATCH  | `/artworks/:id`                   | Update artwork details                        |
| DELETE | `/artworks/:id`                   | Delete an artwork                             |

### Users

| Method | Endpoint                    | Description                            |
|--------|-----------------------------|----------------------------------------|
| GET    | `/user`                     | Get all users (admin)                  |
| PATCH  | `/user/:id`                 | Update user role (admin)               |
| PATCH  | `/user/:id/profile`         | Update user profile (cascades across collections) |
| PATCH  | `/user/:id/subscription`    | Update subscription plan               |
| GET    | `/artist/:id/stats`         | Get artist statistics                  |

### Payments (Stripe)

| Method | Endpoint                             | Description                          |
|--------|--------------------------------------|--------------------------------------|
| POST   | `/create-checkout/artwork/:id`       | Create Stripe session for artwork    |
| POST   | `/create-checkout/subscription`      | Create Stripe session for plan       |
| GET    | `/verify-payment/:sessionId`         | Verify Stripe payment status         |
| POST   | `/webhook`                           | Stripe webhook event handler         |

### Purchase History

| Method | Endpoint              | Description                                      |
|--------|-----------------------|--------------------------------------------------|
| GET    | `/purchasehistory`    | Get purchases (filtered by `buyerId` or `artistId`) |
| POST   | `/purchase/:id`       | Direct purchase (non-Stripe flow)                |

### Comments

| Method | Endpoint                    | Description                         |
|--------|-----------------------------|-------------------------------------|
| POST   | `/comments`                 | Post a comment on an artwork        |
| GET    | `/comments/:artworkId`      | Get all comments for an artwork     |
| GET    | `/comments/user/:userId`    | Get all comments by a user (with artwork info) |

### Transactions & Analytics

| Method | Endpoint                   | Description                                        |
|--------|----------------------------|----------------------------------------------------|
| GET    | `/transactions`            | All transactions (purchases + subscriptions)       |
| GET    | `/transactions/daily`      | Daily revenue data grouped by date (for charts)    |
| GET    | `/subscription-history`    | Subscription plan change history                   |
| PATCH  | `/sync-purchases`          | Sync monthly purchase counts across all users      |

---

## 🔐 Authentication Flow

ArtHub uses **BetterAuth v1.6.19** — a modern, framework-agnostic authentication library.

### Email & Password
1. User submits signup form → BetterAuth creates user in MongoDB
2. A `databaseHook` fires `after` creation → assigns default `free` subscription
3. User role defaults to `user`
4. On login, BetterAuth issues a **JWT** (7-day expiry) stored in a secure, `HttpOnly` cookie
5. In production, cookies use `SameSite: None; Secure: true` for cross-origin support

### Google OAuth
1. User clicks "Continue with Google" → redirected to `/api/auth/google`
2. BetterAuth handles the OAuth dance using `CLIENT_ID` and `CLIENT_SECRET`
3. On callback, BetterAuth creates or retrieves the user in MongoDB
4. Same JWT session flow applies

### JWT Plugin
- BetterAuth's `jwt()` plugin is enabled with `cookieCache` (max age 7 days)
- Frontend uses `jwtClient()` plugin to access and use the token
- `inferAdditionalFields()` pulls custom fields (`role`, `subscription`) into the session

### Protected Routes
- Frontend checks `authClient.useSession()` — unauthenticated users are redirected to `/sign-in`
- Role-based redirects: accessing `/dashboard/admin` as a non-admin sends to `/unauthorized`
- Backend validates `buyerId`, `artistId`, and role before processing sensitive operations

---

## 💰 Payment Flow

### Artwork Purchase
1. Buyer clicks "Purchase" on an artwork detail page
2. Frontend calls `POST /create-checkout/artwork/:id` with buyer details
3. Server validates: artwork exists, not already sold, buyer has subscription, monthly limit not reached, buyer is not the artist
4. Server creates a Stripe Checkout Session with artwork metadata
5. Buyer is redirected to Stripe's hosted checkout page
6. On success, Stripe fires `checkout.session.completed` webhook to `/webhook`
7. Webhook handler: inserts purchase record, marks artwork as `sold`, increments buyer's monthly count
8. Buyer is redirected to `/payment-success` with `session_id` for verification

### Subscription Upgrade
1. Buyer selects a plan (Pro or Premium) on the Subscription page
2. Frontend calls `POST /create-checkout/subscription` with `userId` and `plan`
3. Server creates a Stripe Checkout Session for the plan price
4. On Stripe webhook `checkout.session.completed`: user's subscription is updated, history is logged with `previousPlan` → `newPlan`

### Transaction IDs
- Purchase: `AH-P-` + last 6 chars of artwork ObjectId (uppercase)
- Subscription: `AH-S-` + last 6 chars of user ObjectId (uppercase)

---

## 📊 Dashboard Overview

### 🛍️ Buyer Dashboard
| Page              | Description                                              |
|-------------------|----------------------------------------------------------|
| Overview          | Welcome screen with subscription status and quick stats  |
| Subscription      | Upgrade plan (Free → Pro → Premium) via Stripe          |
| Purchase History  | Table of all purchases with transaction IDs              |
| Bought Artworks   | Gallery view of purchased artworks                       |
| My Comments       | All comments the user has posted with artwork previews   |
| Profile           | Edit name, email, avatar (ImgBB upload)                  |

### 🎨 Artist Dashboard
| Page              | Description                                              |
|-------------------|----------------------------------------------------------|
| Overview          | Stats: total artworks listed, total artworks sold        |
| Add Artwork       | Form to create a new listing with ImgBB image upload     |
| Manage Artworks   | Table of own artworks with edit and delete actions       |
| Sales History     | Record of sold artworks with buyer info and sale date    |
| Profile           | Edit name, email, avatar (cascades to all artworks)      |

### 🛡️ Admin Dashboard
| Page              | Description                                              |
|-------------------|----------------------------------------------------------|
| Overview          | Daily revenue chart (artwork + subscription) via Recharts |
| Manage Users      | Table of all users with role update (promote/demote)     |
| Manage Artworks   | Full platform artwork control with delete capability     |
| All Transactions  | Combined purchase + subscription transaction history     |
| Profile           | Edit admin profile                                       |

---

## 📱 Responsive Design

ArtHub is fully responsive across all screen sizes:

- **Mobile (< 768px):** Single-column layouts, collapsible navigation, stacked dashboard cards, touch-friendly buttons and dropdowns
- **Tablet (768px–1024px):** Two-column artwork grid, adaptive sidebar navigation
- **Desktop (> 1024px):** Three-column artwork grid, full sidebar dashboard, expanded analytics charts

Responsive behavior is implemented using **Tailwind CSS 4** responsive prefixes (`sm:`, `md:`, `lg:`) throughout all components and pages.

---

## 🛡️ Security Features

| Feature                   | Implementation                                        |
|---------------------------|-------------------------------------------------------|
| **JWT Authentication**    | 7-day tokens via BetterAuth JWT plugin, `HttpOnly` cookies |
| **Secure Cookies**        | `SameSite: None; Secure: true` in production          |
| **CORS**                  | Origin-whitelisted to `CLIENT_URL` only               |
| **Role Validation**       | Backend checks user role before every sensitive operation |
| **Purchase Guards**       | Artist cannot buy own artwork; artists cannot purchase at all |
| **Subscription Enforcement** | Monthly purchase limits validated server-side before checkout |
| **Stripe Webhook Verification** | `stripe.webhooks.constructEvent()` verifies signature |
| **Input Validation**      | Required fields checked before all DB writes           |
| **Environment Variables** | All secrets stored in `.env`, never committed          |
| **ObjectId Validation**   | `ObjectId.isValid()` checked before all MongoDB queries |

---

## ⚡ Performance Optimizations

- **Next.js App Router** — server and client components used appropriately for optimal rendering
- **Skeleton Loading** — custom skeleton UI for all async data sections prevents layout shift
- **Framer Motion** — GPU-accelerated CSS transforms for smooth animations without repaints
- **Server-Side Pagination** — only the current page of artworks is fetched from the database
- **Debounced Search** — search input is debounced to reduce unnecessary API calls
- **`next/image`** — automatic image optimization (lazy loading, resizing, WebP conversion)
- **MongoDB Indexes** — queries use `artistId`, `buyerId`, `artworkId` which benefit from MongoDB's default `_id` index and query planner
- **Lean API Responses** — endpoints return only required fields; profile updates cascade in a single request
- **Conditional Re-renders** — React state and `useEffect` dependencies are scoped to avoid unnecessary re-renders

---

## 🔮 Future Improvements

1. **Real-Time Notifications** — WebSocket or SSE for live purchase and comment alerts
2. **Artist Portfolio Pages** — Public-facing profiles showcasing all artworks by an artist
3. **Wishlist / Favorites** — Allow buyers to save artworks for later
4. **AI Art Recommendations** — Personalized artwork suggestions based on purchase history
5. **Review & Rating System** — Star ratings on artworks and artists
6. **Artist Payout System** — Stripe Connect for direct artist revenue splits
7. **Multiple Image Uploads** — Allow multiple images per artwork with gallery view
8. **Auction System** — Timed bidding on exclusive or high-value artworks
9. **Admin Content Moderation** — Approve/reject artwork listings before they go live
10. **Email Notifications** — Transactional emails for purchases, subscription changes, and comments
11. **Advanced Analytics** — Monthly revenue trends, top-selling categories, user growth charts
12. **Mobile App** — React Native app for iOS and Android
13. **Dark Mode** — System-aware and toggleable dark theme
14. **Internationalization (i18n)** — Multi-language support for global reach
15. **SEO Optimization** — Dynamic `og:image` and metadata per artwork for social sharing

---

## 👨‍💻 Developer

<div align="center">

**Abid Hossain Sifat**
Full Stack MERN Developer

[![GitHub](https://img.shields.io/badge/GitHub-Abid--Hossain--Sifat-181717?style=for-the-badge&logo=github)](https://github.com/Abid-Hossain-Sifat)

*Built with ❤️ using Next.js, Express, MongoDB, and Stripe*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Abid Hossain Sifat

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

[🌐 Live Demo](https://arthub-by-abid.vercel.app) &nbsp;|&nbsp;
[📁 Frontend Repo](https://github.com/Abid-Hossain-Sifat/ArtHub) &nbsp;|&nbsp;
[🔧 Backend Repo](https://github.com/Abid-Hossain-Sifat/ArtHub-Server)

</div>
