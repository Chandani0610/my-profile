import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getPortfolio = async () => {
  const response = await API.get("/portfolio");
  return response.data;
};

export default API;