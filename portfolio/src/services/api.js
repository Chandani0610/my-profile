import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  API_BASE_URL.replace(/\/api\/?$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getPortfolio = async () => {
  const response = await API.get("/portfolio");
  return response.data;
};

export default API;