# NASA Space Explorer

A full-stack web application that leverages NASA's Open APIs to create a stunning, informative, and interactive experience for users to explore space data. Designed and built using **React**, **Node.js**, and **Express**, this project fulfills all the requirements of the NASA coding challenge while going above and beyond with performance optimizations, visualizations, and backend architecture.

---

## Live Deployment

* **Frontend (Render)**: https://nasa-space-explorer-qk3b.onrender.com/
* **Backend (Render)**: https://nasa-space-explorer-2-hozv.onrender.com/

---

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable components (charts, loaders, nav)
│   │   ├── pages/              # Route-based views (Home, NEO, Mars, EPIC)
│   │   ├── services/           # Axios config and frontend API layer
│   │   └── App.jsx             # Global layout, routing, dark mode
│   └── index.html              # App root HTML
│
├── backend/
│   ├── routes/                 # API route modules (apod, mars, neo, epic)
│   ├── utils/                  # Reusable NASA API client and caching logic
│   ├── server.js               # Express app entry point
│   └── .env                    # Contains NASA_API_KEY and PORT
│
└── README.md                   # You're reading it now
```

---

## Backend Architecture

The Express backend is responsible for securely fetching and serving data from NASA’s public APIs. It acts as a proxy and performance layer, ensuring the frontend never exposes any sensitive API keys and can benefit from caching and error resilience.

### Key Features

* ✅ Modular API routes: `/apod`, `/mars`, `/neo`, `/neo-range`, `/epic`
* ✅ Intelligent caching: One-hour TTL for repeated requests
* ✅ Exponential backoff retry logic on failed fetches
* ✅ Graceful error handling with HTTP status codes and fallbacks

### Routes Overview

#### `/api/apod`

* Fetches Astronomy Picture of the Day.
* If data not available for today, gracefully falls back to yesterday’s data.

#### `/api/mars`

* Accepts `date` and optional `rover` (defaults to "curiosity").
* Returns images captured by the selected rover on the specified Earth date.

#### `/api/neo`

* Fetches NEO data for a single date using NASA’s NeoWs feed.

#### `/api/neo-range`

* Accepts a `start` and `end` date.
* Automatically splits the date range into 6-day chunks to stay within NASA's 7-day API call limit.
* Merges and returns a complete map of `near_earth_objects` grouped by date.

#### `/api/epic`

* Fetches Earth imagery for a given date from NASA's EPIC natural-color image API.

### Utils: `nasaClient.js`

* Encapsulates all API URL logic
* Builds requests with `api_key`, query params, and endpoint paths
* Delegates request execution to `fetchWrapper`

### Caching & Retry: `fetchWrapper.js`

* Provides in-memory cache with 1-hour expiry
* Handles duplicate requests by reusing in-flight Promises
* Retries 3 times with exponential backoff if NASA API fails
* Logs response size, memory usage, and cache hits/misses for observability

---

## Frontend Features

### `HeroSection.jsx`

* Displays Astronomy Picture of the Day (APOD)
* Includes title, description, and smooth scroll buttons

### `NeoTracker.jsx`

* Interactive asteroid dashboard with polar and scatter charts
* Filters for hazardous asteroids, size range, and miss distance
* Date-range picker for querying past flybys

### `EpicCarousel.jsx`

* Earth satellite imagery viewer
* Scroll to cycle through 3 days of images
* View metadata like time, caption, and coordinates

### `MarsGallery.jsx`

* Browse Mars Rover photos from any Earth date
* Renders image grid with rover metadata

### `Navbar`, `LoadingOverlay`, `ErrorBanner`, etc.

* Clean, responsive navigation
* Spinner during API fetch
* Error feedback for offline or API issues

---

## Data Visualization

* **Polar Area Chart** (Recharts): For visualizing NEO diameters and miss distances
* **Scatter Plot** (D3.js): For more granular asteroid approach data
* **Timeline Viewer**: Scrollable image viewer for EPIC Earth feed
* **Cards and Grids**: For image galleries with camera and date info

---

## Getting Started Locally

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # add your NASA_API_KEY and PORT
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env  # add VITE_API_URL=http://localhost:5000
npm run dev
```

---

## Deployment Instructions

### Frontend (Vercel)

* Framework: Vite + React
* No build customization needed
* Environment Variable: `VITE_API_URL=https://your-backend-url`

### Backend (Render)

* Build command: `npm install`
* Start command: `node server.js`
* Environment Variables:

  * `NASA_API_KEY` — from [https://api.nasa.gov](https://api.nasa.gov)
  * `PORT` — typically 10000

---

## Best Practices & Quality

* Clear separation of concerns (backend ≠ frontend)
* All routes validated and error-handled
* Caching to prevent excessive API hits
* Retry logic for transient network failures
* Responsive UI for mobile and desktop
* Code is modular and organized with comments

---


## About the Author

Built by **Samar Patil**
🎓 MSc Computing: Data Analytics @ Dublin City University
📍 Based in Dublin, Ireland
🔗 [LinkedIn](https://www.linkedin.com/in/samarpatil/)

---

