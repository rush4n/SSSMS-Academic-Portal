import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axiosConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Check if user is already logged in on page load
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Basic check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ email: decoded.sub, ...decoded });
        }
      } catch (error) {
        logout();
      }
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token } = response.data;

      // Save to LocalStorage
      localStorage.setItem("token", token);
      setToken(token);

      const decoded = jwtDecode(token);
      setUser({ email: decoded.sub });

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error:
          error.response?.status === 403
            ? "Invalid credentials"
            : "Server error. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
