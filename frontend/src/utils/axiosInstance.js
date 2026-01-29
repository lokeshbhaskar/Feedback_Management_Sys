import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000";  

// Create an axios instance
const axiosInstance = axios.create({ baseURL });

// Request interceptor to add token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized → maybe redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      window.location.href = "/login"; // optional
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
