import axios from 'axios';

/**
 * Single Axios instance shared across components.
 * During dev it points at http://localhost:5050;
 * in production leave VITE_BACKEND_URL unset and
 * deploy the frontend under the same domain ➔ /api.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/api',
  timeout: 8000,
});
