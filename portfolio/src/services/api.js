import axios from "axios";

// Automatically use local backend when running in local development
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api"
  : import.meta.env.VITE_API_BASE_URL || "https://my-profile-p7ic.onrender.com/api";

export const BACKEND_URL = isLocalhost
  ? "http://localhost:5000"
  : import.meta.env.VITE_BACKEND_URL || API_BASE_URL.replace(/\/api\/?$/, "");

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

export const getPortfolio = async () => {
  const response = await API.get("/portfolio");
  return response.data;
};

export default API;