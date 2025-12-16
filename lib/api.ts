import axios from "axios";

const API = axios.create({
  baseURL: "https://entrovex-backend.vercel.app",
  withCredentials: true,
});

export const getAuthHeader = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API;
