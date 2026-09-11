import axios from "axios";

// Automatically use local backend when running in local development
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

// Support all standard environment variable names: VITE_API_URL, VITE_API_BASE_URL, VITE_BACKEND_URL
const rawEnvUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL;

// Normalize root backend URL (removes trailing slash and /api suffix if present)
const normalizeBackendUrl = (url) => {
  if (!url) return "";
  return url.trim().replace(/\/+$/, "").replace(/\/api$/, "");
};

export const BACKEND_URL = isLocalhost
  ? (import.meta.env.VITE_BACKEND_URL || (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes("localhost") ? normalizeBackendUrl(import.meta.env.VITE_API_URL) : "http://localhost:5000"))
  : (rawEnvUrl ? normalizeBackendUrl(rawEnvUrl) : "https://my-profile-p7ic.onrender.com");

export const API_BASE_URL = `${BACKEND_URL}/api`;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }
  const clean = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BACKEND_URL}${clean}`;
};

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach Authorization header if admin_token exists
API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_authenticated", "true");
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_authenticated");
};

export const getPortfolio = async () => {
  const response = await API.get("/portfolio");
  return response.data;
};

export default API;