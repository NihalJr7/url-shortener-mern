import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext(null);

/**
 * Auth context provider
 * Manages user authentication state, login, register, logout
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await authService.getProfile();
          setUser(response.data);
        } catch (error) {
          // Token invalid — clear state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials);
    const { data, token: newToken } = response;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(newToken);
    setUser(data);
    return response;
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authService.register(userData);
    const { data, token: newToken } = response;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(newToken);
    setUser(data);
    return response;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Continue with logout even if API call fails
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback(async (data) => {
    const response = await authService.updateProfile(data);
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response;
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
