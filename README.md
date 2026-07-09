# SnipLink — Modern URL Shortener

A production-ready, full-stack URL shortener application built with React, Node.js, Express, and MongoDB. Features a premium SaaS-style dashboard with analytics, QR codes, custom aliases, and dark mode.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-success)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- **URL Shortening** — Generate short URLs with nanoid
- **Custom Aliases** — Create branded short links (e.g., `/my-brand`)
- **QR Code Generation** — Auto-generated QR codes with PNG download
- **Click Analytics** — Track clicks, devices, browsers, and trends
- **Dashboard** — Real-time statistics with interactive charts
- **User Authentication** — JWT auth with bcrypt password hashing
- **Dark Mode** — System-preference aware with manual toggle
- **Responsive Design** — Mobile-first with sidebar/drawer navigation
- **Search & Filters** — Debounced search with sort options
- **Pagination** — Efficient data loading for large link collections
- **Security** — Helmet, CORS, rate limiting, input validation

## Tech Stack

### Frontend
- React 19 + Vite 8
- Tailwind CSS v4 (with `@tailwindcss/vite` plugin)
- React Router v7
- Recharts (analytics charts)
- Framer Motion (animations)
- React Hook Form (form validation)
- React Hot Toast (notifications)
- React Icons
- Axios (API client)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- nanoid (short code generation)
- qrcode (QR code generation)
- helmet, cors, express-rate-limit (security)
- morgan (logging)
- validator (input validation)

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB Atlas** account (free tier works)

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd "url project new"
```

### 2. Set Up the Backend

```bash
cd server

# Copy env template and configure
cp .env.example .env

# Install dependencies
npm install
```

Edit `server/.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/url-shortener?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
BASE_URL=http://localhost:5000
```

> **Generating a JWT Secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Set Up the Frontend

```bash
cd client

# Install dependencies
npm install
```

### 4. Run the Application

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)
- Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/update` | Update profile | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### URLs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/url/create` | Create short URL | Yes |
| GET | `/api/url/all` | Get all user URLs | Yes |
| GET | `/api/url/:id` | Get URL by ID | Yes |
| PUT | `/api/url/:id` | Update URL | Yes |
| DELETE | `/api/url/:id` | Delete URL | Yes |
| GET | `/:shortCode` | Redirect to original URL | No |

### Analytics

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/analytics/dashboard` | Dashboard stats | Yes |
| GET | `/api/analytics/url/:id` | URL-specific analytics | Yes |

## Project Structure

```
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── urlController.js      # URL CRUD + redirect
│   │   └── analyticsController.js# Analytics aggregation
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   ├── errorHandler.js       # Global error handler
│   │   └── rateLimiter.js        # Rate limiting configs
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Url.js                # URL schema
│   │   └── Click.js              # Click tracking schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── urlRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   ├── generateToken.js      # JWT helper
│   │   └── helpers.js            # UA parsing, IP extraction
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express app entry point
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   └── UrlCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MyUrlsPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── analyticsService.js
│   │   │   ├── authService.js
│   │   │   └── urlService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB Atlas connection string | — |
| `JWT_SECRET` | Secret key for JWT signing | — |
| `JWT_EXPIRE` | Token expiration time | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `BASE_URL` | Base URL for short links | `http://localhost:5000` |

## Deployment

### Backend (e.g., Render, Railway, Fly.io)

1. Set all environment variables in the hosting platform
2. Set `NODE_ENV=production`
3. Set `BASE_URL` to your production domain
4. Set `CLIENT_URL` to your frontend production URL
5. Deploy the `server/` directory
6. Start command: `npm start`

### Frontend (e.g., Vercel, Netlify)

1. Build the production bundle:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `client/dist/` directory
3. Configure the API proxy or update `src/services/api.js` baseURL to point to your production backend

## Security Features

- **JWT Authentication** with httpOnly cookies
- **bcrypt** password hashing (12 salt rounds)
- **Helmet** for HTTP security headers
- **CORS** with whitelist origin
- **Rate Limiting** (100/15min API, 10/15min auth, 30/15min URL creation)
- **Input Validation** via validator.js and Mongoose schemas
- **MongoDB Injection Prevention** via Mongoose
- **XSS Protection** via Helmet and input sanitization

## License

MIT License — feel free to use this project for personal or commercial purposes.

---
---

## 🚀 Detailed Step-by-Step Guide to Run Locally

Follow these beginner-friendly steps to run the application on your local machine.

### Step 1: Prerequisites
Make sure you have installed:
- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)
- **MongoDB Atlas Account** - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) to get your database connection URI.

### Step 2: Clone the Repository
Open your terminal and run:
```bash
git clone <your-repo-url>
cd "url project new"
```

### Step 3: Configure the Backend (Server)
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create your environment variables file:
   Copy `.env.example` to a new file named `.env` (or create it manually).
4. Open the `.env` file and add your MongoDB connection string and a secret for JWT:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/url-shortener?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   BASE_URL=http://localhost:5000
   ```

### Step 4: Configure the Frontend (Client)
Open a **new terminal tab** and navigate to the client folder:
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```

### Step 5: Start Both Servers
You will need two terminal windows open:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### Step 6: View the Application
- Open your browser and go to: **[http://localhost:5173](http://localhost:5173)**
- The backend API will be running on: **[http://localhost:5000](http://localhost:5000)**

---

## 🌍 Detailed Step-by-Step Guide to Host / Deploy

Once your application is working locally, you can deploy it for the world to see. We recommend **Render** for the backend and **Vercel** for the frontend.

### Step 1: Push Your Code to GitHub
Ensure all your code is committed and pushed to a GitHub repository. Both Vercel and Render will connect to this repo to deploy.

### Step 2: Deploy the Backend (Render)
1. Go to [Render.com](https://render.com) and create an account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your repository.
4. Fill in the following details:
   - **Name**: sniplink-backend (or any name you prefer)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (or `npm start`)
5. **Add Environment Variables** (Under Advanced settings):
   - `PORT`: (Leave empty, Render assigns this automatically)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_super_secret_key_here`
   - `CLIENT_URL`: `(You will update this later with your Vercel URL)`
   - `BASE_URL`: `(Your Render app URL, e.g., https://sniplink-backend.onrender.com)`
6. Click **Create Web Service**. Wait for the deployment to finish and copy your Render Backend URL.

### Step 3: Deploy the Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. In the configuration settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
5. **Environment Variables**:
   *(Make sure your `client/src/services/api.js` file is configured to use production endpoints!)*
   If you have variables like `VITE_API_URL`, add it here pointing to your Render Backend URL.
6. Click **Deploy**.

### Step 4: Final Connection (Important!)
Now that you have your Vercel URL (e.g., `https://sniplink.vercel.app`), go back to your **Render Backend Dashboard**:
1. Go to your backend service -> **Environment**.
2. Update the `CLIENT_URL` to your new Vercel URL (e.g., `https://sniplink.vercel.app`).
3. Save changes (Render will automatically redeploy).

Congratulations! Your app is now live on the internet! 🎉
