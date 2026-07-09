import api from './api.js';

/**
 * Authentication API service
 */
const authService = {
  /**
   * Register a new user
   * @param {{ name: string, email: string, password: string }} data
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   * @param {{ email: string, password: string }} data
   */
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Update user profile
   * @param {{ name?: string, email?: string, currentPassword?: string, newPassword?: string }} data
   */
  updateProfile: async (data) => {
    const response = await api.put('/auth/update', data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

export default authService;
