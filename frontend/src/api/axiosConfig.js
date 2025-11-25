import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Matches your Spring Boot Controller
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the Token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
