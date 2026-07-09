import api from './api.js';

/**
 * URL API service
 */
const urlService = {
  /**
   * Create a new short URL
   * @param {{ originalUrl: string, customAlias?: string }} data
   */
  create: async (data) => {
    const response = await api.post('/url/create', data);
    return response.data;
  },

  /**
   * Get all URLs with pagination, search, and sorting
   * @param {{ page?: number, limit?: number, search?: string, sort?: string }} params
   */
  getAll: async (params = {}) => {
    const response = await api.get('/url/all', { params });
    return response.data;
  },

  /**
   * Get a single URL by ID
   * @param {string} id
   */
  getById: async (id) => {
    const response = await api.get(`/url/${id}`);
    return response.data;
  },

  /**
   * Update a URL
   * @param {string} id
   * @param {{ originalUrl?: string, customAlias?: string }} data
   */
  update: async (id, data) => {
    const response = await api.put(`/url/${id}`, data);
    return response.data;
  },

  /**
   * Delete a URL
   * @param {string} id
   */
  delete: async (id) => {
    const response = await api.delete(`/url/${id}`);
    return response.data;
  },
};

export default urlService;
