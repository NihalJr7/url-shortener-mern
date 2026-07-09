import api from './api.js';

/**
 * Analytics API service
 */
const analyticsService = {
  /**
   * Get dashboard statistics
   */
  getDashboard: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },

  /**
   * Get detailed analytics for a specific URL
   * @param {string} id - URL ID
   */
  getUrlAnalytics: async (id) => {
    const response = await api.get(`/analytics/url/${id}`);
    return response.data;
  },
};

export default analyticsService;
