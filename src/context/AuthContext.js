// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["auth-token"] = token;
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  axios.defaults.baseURL = "https://backend-tm.onrender.com";
  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["auth-token"] = res.data.token;
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post("/api/users/register", {
        username,
        email,
        password
      });
      localStorage.setItem("token", res.data.token);
      axios.defaults.headers.common["auth-token"] = res.data.token;
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["auth-token"];
    toast.success("Logout Success");
    setIsAuthenticated(false);
    <Navigate to="/login" />;
    // window.location.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
