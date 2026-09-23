import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('icityfix_token'));
  const [loading, setLoading] = useState(true);

  // Initialize user from stored token/localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('icityfix_token');
      const storedUser = localStorage.getItem('icityfix_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await axiosClient.get('/auth/me');
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('icityfix_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosClient.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { token: receivedToken, ...userData } = res.data;
        setToken(receivedToken);
        setUser(userData);
        localStorage.setItem('icityfix_token', receivedToken);
        localStorage.setItem('icityfix_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      throw new Error(res.message || 'Login failed');
    } catch (error) {
      return { success: false, message: error.message || 'Invalid credentials' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await axiosClient.post('/auth/register', userData);
      if (res.success && res.data) {
        const { token: receivedToken, ...userObj } = res.data;
        setToken(receivedToken);
        setUser(userObj);
        localStorage.setItem('icityfix_token', receivedToken);
        localStorage.setItem('icityfix_user', JSON.stringify(userObj));
        return { success: true, user: userObj };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const quickDemoLogin = async (role = 'CITIZEN') => {
    if (role === 'ADMIN') {
      return await login('admin@icityfix.local', 'iCityFix@123');
    }
    return await login('citizen@icityfix.local', 'iCityFix@123');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('icityfix_token');
    localStorage.removeItem('icityfix_user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isCitizen = user?.role === 'CITIZEN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        isAdmin,
        isCitizen,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
