// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on startup
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ✅ Updated login to accept email, username, password, role
  const login = async ({ email, username, password, role }) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        email,
        username,
        password,
        role
      });

      const userData = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      return { success: false };
    }
  };

  // Registration function
  const register = async (userData) => {
    try {
      await axios.post('http://localhost:8080/api/auth/signup', userData);
      return { success: true, message: 'Registration successful! Please login.' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
