import axios from "axios";

// this must be defined in your Render (or Vercel) Static‐Site env
// e.g. VITE_API_URL=https://nasa-space-explorer-2-hozv.onrender.com
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("❌ VITE_API_URL is not set!");
}

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10_000,
});
