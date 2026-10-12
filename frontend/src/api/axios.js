import axios from "axios";

// In local dev VITE_API_URL is unset, so this falls back to "/api", which Vite's dev
// server proxies to localhost:5000 (see vite.config.js). In production, set
// VITE_API_URL to the deployed backend's URL + /api — a relative path has nowhere
// real to go once the frontend and backend are separate Render services.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
