import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token is valid on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Make a request to verify the token
          const response = await api.get('/auth/verify');
          
          // If successful, set auth state
          const userData = response.data.user || JSON.parse(localStorage.getItem('user'));
          setUser(userData);
          setIsAuth(true);
        } catch (error) {
          // If token verification fails, clear auth data
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuth(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginUser = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuth(true);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuth(false);
    toast.info('You have been logged out');
  };

  // Add this function to check token validity
  const checkTokenValidity = async () => {
    try {
      await api.get('/auth/verify');
      return true;
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logoutUser();
      }
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        user,
        loading,
        loginUser,
        logoutUser,
        checkTokenValidity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};