# GRVTY — Athletic & Streetwear E-Commerce

A full-stack online clothing store for an athletic and streetwear brand. The Express + MongoDB backend
handles products, categories, carts, orders, stock and reviews through a REST API. The Next.js frontend
renders a live storefront with React Query, a Zustand cart and an admin panel for stock and order management.

**Stack:** Next.js 14 (App Router) · React Query · Zustand · Tailwind CSS · Node.js · Express · MongoDB Atlas (Mongoose) · JWT · Zod

---

## Features

**Storefront**
- Homepage hero carousel with live categories, latest drops and best sellers pulled from MongoDB
- Shop page with URL-driven filters (category, collection, size, price, availability), sorting and pagination
- Product page with image gallery + hover zoom, colour/size selection, live stock indicators, reviews and related products
- Live navbar search, skeleton loading states, empty/error states, mobile filter drawer

**Cart & checkout**
- Guest cart persisted in the browser (Zustand) — merged into the server cart on login
- Logged-in cart stored in MongoDB, so it follows the user across devices
- Free-shipping progress bar, quantity limits based on stock
- Cash-on-delivery checkout with address saved for next time

**Orders & stock**
- Stock is reserved atomically when an order is placed (no overselling the last unit) and rolled back on failure
- Customers can cancel pending orders — stock is released automatically
- Admin order workflow: `pending → processing → shipped → delivered` (or `cancelled`)

**Accounts**
- Register / login with JWT, profile and password management, order history and order tracking page
- Product reviews (one per customer) with rating breakdown and "verified buyer" badge

**Admin panel** (`/admin`)
- Dashboard: revenue, orders by status, recent orders, low-stock alerts
- Products: create / edit / hide products, inline per-variant stock editor
- Orders: filter by status and move orders through the workflow

**API quality**
- Request validation with Zod, central error handling, Helmet, CORS whitelist, rate-limited auth routes
- Cached MongoDB connection so it runs both as a normal server and as a Vercel serverless function

---

## Project structure

```
backend/
  api/index.js              # Vercel serverless entry
  src/
    app.js                  # Express app (middleware + routes)
    server.js               # Local server entry
    config/                 # env + cached Mongo connection
    controllers/            # auth, product, category, cart, order, review, admin
    middleware/             # auth guard, zod validation, error handler
    models/                 # User, Product, Category, Cart, Order, Review
    routes/
    utils/                  # query helpers, stock reservation, response helpers
    validators/schemas.js   # zod request schemas
    seed/                   # demo catalog + accounts
frontend/
  app/                      # Next.js routes (shop, products/[slug], cart, checkout, account, orders, admin…)
  components/               # UI, product, cart, shop, admin, layout
  lib/                      # API client, React Query hooks, session helpers
  store/                    # Zustand auth + cart stores
```

---

## Running locally

**Requirements:** Node.js 18.18+ and a MongoDB database (a free MongoDB Atlas cluster or a local `mongod`).

### 1. Backend

```bash
cd backend
cp .env.example .env        # then set MONGO_URI and JWT_SECRET
npm install
npm run seed                # loads categories, products and demo accounts
npm run dev                 # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
npm install
npm run dev                 # http://localhost:3000
```

### Demo accounts (created by `npm run seed`)

The seed script creates an admin and a customer using the `SEED_*` values in `backend/.env`
(defaults are in `backend/.env.example`). Log in with the admin account to open `/admin`.

### Useful scripts

| Where     | Command                | What it does                               |
| --------- | ---------------------- | ------------------------------------------ |
| backend   | `npm run dev`          | API with auto-reload (nodemon)             |
| backend   | `npm run seed`         | Reset catalog and upsert demo accounts     |
| backend   | `npm run seed:destroy` | Remove catalog, carts, orders and reviews  |
| frontend  | `npm run dev`          | Next.js dev server                         |
| frontend  | `npm run build`        | Production build                           |

---

## Environment variables

**backend/.env**

| Variable                  | Description                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| `MONGO_URI`               | MongoDB connection string                                        |
| `JWT_SECRET`              | Long random string used to sign tokens                           |
| `JWT_EXPIRES_IN`          | Token lifetime (default `7d`)                                    |
| `CLIENT_URL`              | Allowed frontend origin(s), comma separated                      |
| `FREE_SHIPPING_THRESHOLD` | Order subtotal for free shipping (PKR, default `5000`)           |
| `SHIPPING_FEE`            | Flat shipping fee below the threshold (PKR, default `250`)       |
| `SEED_*`                  | Demo account credentials used by the seed script                 |

**frontend/.env.local**

| Variable                               | Description                                  |
| -------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                  | API base URL including `/api/v1`             |
| `NEXT_PUBLIC_SITE_URL`                 | Public site URL (SEO / Open Graph)           |
| `NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD`  | Must match the backend value                 |
| `NEXT_PUBLIC_SHIPPING_FEE`             | Must match the backend value                 |

---

## Deploying to Vercel

The repo deploys as **two Vercel projects** from the same GitHub repository.

### Backend (API)
1. In MongoDB Atlas → *Network Access*, allow `0.0.0.0/0` (Vercel uses dynamic IPs).
2. Vercel → *Add New Project* → import the repo → set **Root Directory** to `backend`.
   Framework preset: **Other** (no build command needed — `vercel.json` routes every request to `api/index.js`).
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, and
   `CLIENT_URL=https://<your-frontend>.vercel.app` (add `http://localhost:3000` too, comma separated, if you want local dev against it).
4. Deploy and check `https://<your-api>.vercel.app/api/v1/health`.
5. Seed the production database once from your machine: put the Atlas `MONGO_URI` in `backend/.env` and run `npm run seed`.

### Frontend
1. *Add New Project* → same repo → **Root Directory** `frontend` (Next.js is detected automatically).
2. Environment variables:
   - `NEXT_PUBLIC_API_URL=https://<your-api>.vercel.app/api/v1`
   - `NEXT_PUBLIC_SITE_URL=https://<your-frontend>.vercel.app`
3. Deploy. If you change the frontend URL later, update `CLIENT_URL` on the backend project and redeploy it.

---

## API overview

Base URL: `/api/v1` — responses are `{ status, message, data }`.

| Method | Endpoint                                   | Access   |
| ------ | ------------------------------------------ | -------- |
| POST   | `/auth/register`, `/auth/login`            | Public   |
| GET/PATCH | `/auth/me`, PATCH `/auth/password`      | User     |
| GET    | `/categories`, `/categories/:slug`         | Public   |
| POST/PATCH/DELETE | `/categories[/:id]`             | Admin    |
| GET    | `/products?category=&tags=&size=&minPrice=&maxPrice=&inStock=&q=&sort=&page=` | Public |
| GET    | `/products/new-arrivals`, `/products/featured`, `/products/tag/:tag`, `/products/search?q=` | Public |
| GET    | `/products/:slug`, `/products/:slug/related` | Public |
| GET/POST | `/products/:productId/reviews`           | Public / User |
| GET    | `/products/admin/all`, `/products/admin/:id` | Admin  |
| POST/PATCH/DELETE | `/products[/:id]`, PATCH `/products/:id/stock` | Admin |
| GET/POST/PATCH/DELETE | `/cart`, `/cart/items[/:itemId]`, `/cart/merge`, `/cart/clear` | User |
| POST   | `/orders`                                  | User     |
| GET    | `/orders/my`, `/orders/:id`, PATCH `/orders/:id/cancel` | User |
| GET    | `/orders`, PATCH `/orders/:id/status`      | Admin    |
| GET    | `/admin/stats`                             | Admin    |
