import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token and fetch user on app load
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch current user from /auth/me
  const fetchCurrentUser = async (token) => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    const token = res.data.access_token;
    localStorage.setItem("access_token", token);

    // Fetch user data
    await fetchCurrentUser(token);
  };

  // Owner Signup function
  const signupOwner = async (company_name, email, password) => {
    const res = await axiosInstance.post("/auth/signup-owner", {
      company_name,
      email,
      password,
    });
    const token = res.data.access_token;
    localStorage.setItem("access_token", token);

    // Fetch user data
    await fetchCurrentUser(token);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setUser(null);
    queryClient.clear(); // clear cached queries
    window.location.href = "/login"; // redirect
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, signupOwner }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
